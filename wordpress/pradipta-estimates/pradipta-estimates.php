<?php
/**
 * Plugin Name: Pradipta Project Estimates
 * Description: Stores project estimates sent by the website's cost estimator (pradipta/v1/estimates) and lists them under "Project Estimates" in the admin.
 * Version:     1.3.0
 * Author:      Pradipta Das
 * Requires PHP: 7.4
 *
 * Setup: add the shared secret to wp-config.php, matching WORDPRESS_ESTIMATE_SECRET
 * in the Next.js app:
 *
 *     define( 'PRADIPTA_ESTIMATE_SECRET', 'a-long-random-string' );
 *
 * Requests without that secret are rejected, and the endpoint stays closed
 * until the constant is defined.
 *
 * The website emails the visitor their copy itself, from its own domain, and
 * tells this plugin whether it went out, which the details panel shows. Since
 * version 1.3 the plugin sends no email.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PRADIPTA_ESTIMATE_POST_TYPE = 'project_estimate';

/* =========================================================
   POST TYPE
   Private: visible only in the admin, never on the site or in
   the public REST API. Entries can't be created by hand.
========================================================= */

add_action( 'init', function () {
	register_post_type(
		PRADIPTA_ESTIMATE_POST_TYPE,
		array(
			'labels'          => array(
				'name'          => 'Project Estimates',
				'singular_name' => 'Project Estimate',
				'edit_item'     => 'Project Estimate',
				'search_items'  => 'Search Estimates',
				'not_found'     => 'No estimates yet.',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_icon'       => 'dashicons-calculator',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		)
	);
} );

/* =========================================================
   REST ENDPOINT: POST /wp-json/pradipta/v1/estimates
========================================================= */

add_action( 'rest_api_init', function () {
	register_rest_route(
		'pradipta/v1',
		'/estimates',
		array(
			'methods'             => 'POST',
			'callback'            => 'pradipta_estimates_create',
			'permission_callback' => 'pradipta_estimates_authorized',
			'args'                => array(
				'email'             => array(
					'type'     => 'string',
					'format'   => 'email',
					'required' => true,
				),
				'marketing_consent' => array(
					'type'     => 'boolean',
					'required' => true,
				),
				'answers'           => array(
					'type'     => 'object',
					'required' => true,
				),
				'estimate'          => array(
					'type'     => 'object',
					'required' => true,
				),
				// Whether the website emailed the visitor a copy, and with the PDF.
				'emailed'           => array(
					'type'     => 'boolean',
					'required' => false,
				),
				'pdf_attached'      => array(
					'type'     => 'boolean',
					'required' => false,
				),
			),
		)
	);
} );

function pradipta_estimates_authorized( WP_REST_Request $request ) {
	$secret   = defined( 'PRADIPTA_ESTIMATE_SECRET' ) ? (string) PRADIPTA_ESTIMATE_SECRET : '';
	$provided = (string) $request->get_header( 'x-estimate-secret' );

	return '' !== $secret && hash_equals( $secret, $provided );
}

// An amount as the website shows it: the currency's symbol, whole units, and
// Indian digit grouping for rupees (₹1,50,000). Mirrors formatMoney in the
// Next.js app (src/app/lib/estimate/format.ts).
function pradipta_estimates_money( $amount, $currency ) {
	$digits = (string) abs( (int) round( (float) $amount ) );

	if ( 'INR' === $currency && strlen( $digits ) > 3 ) {
		$digits = preg_replace( '/\B(?=(\d{2})+(?!\d))/', ',', substr( $digits, 0, -3 ) ) . ',' . substr( $digits, -3 );
	} else {
		$digits = number_format( (float) $digits );
	}

	$symbols = array(
		'INR' => '₹',
		'USD' => '$',
		'GBP' => '£',
		'CAD' => 'CA$',
		'AUD' => 'A$',
	);
	return isset( $symbols[ $currency ] ) ? $symbols[ $currency ] . $digits : trim( $currency . ' ' . $digits );
}

function pradipta_estimates_range( $low, $high, $currency ) {
	return pradipta_estimates_money( $low, $currency ) . ' – ' . pradipta_estimates_money( $high, $currency );
}

// Cleans every string in a nested array of form answers or estimate fields.
function pradipta_estimates_clean( $value ) {
	if ( is_array( $value ) ) {
		$clean = array();
		foreach ( $value as $key => $item ) {
			$clean[ is_int( $key ) ? $key : sanitize_text_field( $key ) ] = pradipta_estimates_clean( $item );
		}
		return $clean;
	}
	if ( is_int( $value ) || is_float( $value ) ) {
		return $value;
	}
	if ( is_bool( $value ) ) {
		return $value;
	}
	return sanitize_text_field( (string) $value );
}

function pradipta_estimates_create( WP_REST_Request $request ) {
	$email = sanitize_email( $request->get_param( 'email' ) );
	if ( ! is_email( $email ) ) {
		return new WP_Error( 'invalid_email', 'A valid email is required.', array( 'status' => 400 ) );
	}

	$consent  = (bool) $request->get_param( 'marketing_consent' );
	$emailed  = (bool) $request->get_param( 'emailed' );
	$answers  = pradipta_estimates_clean( (array) $request->get_param( 'answers' ) );
	$estimate = pradipta_estimates_clean( (array) $request->get_param( 'estimate' ) );

	$currency = isset( $estimate['currency'] ) ? strtoupper( substr( $estimate['currency'], 0, 3 ) ) : '';
	$low      = isset( $estimate['low'] ) ? (float) $estimate['low'] : 0;
	$high     = isset( $estimate['high'] ) ? (float) $estimate['high'] : 0;

	$post_id = wp_insert_post(
		array(
			'post_type'   => PRADIPTA_ESTIMATE_POST_TYPE,
			'post_status' => 'private',
			'post_title'  => $email . ' — ' . pradipta_estimates_range( $low, $high, $currency ),
			// wp_insert_post strips slashes from meta, which would break the JSON's
			// escapes (line breaks, quotes, non-English text), so they're added first.
			'meta_input'  => array(
				'_estimate_email'             => $email,
				'_estimate_marketing_consent' => $consent ? '1' : '0',
				// When consent was given, kept as a record of the opt-in.
				'_estimate_consent_at'        => $consent ? current_time( 'mysql', true ) : '',
				'_estimate_currency'          => $currency,
				'_estimate_low'               => $low,
				'_estimate_high'              => $high,
				'_estimate_answers'           => wp_slash( wp_json_encode( $answers ) ),
				'_estimate_result'            => wp_slash( wp_json_encode( $estimate ) ),
				'_estimate_acknowledged'      => $emailed ? '1' : '0',
				'_estimate_pdf_attached'      => $emailed && $request->get_param( 'pdf_attached' ) ? '1' : '0',
			),
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'save_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
	}

	return new WP_REST_Response( array( 'id' => $post_id ), 201 );
}

/* =========================================================
   ADMIN LIST COLUMNS
========================================================= */

add_filter( 'manage_' . PRADIPTA_ESTIMATE_POST_TYPE . '_posts_columns', function () {
	return array(
		'cb'               => '<input type="checkbox" />',
		'estimate_email'   => 'Email',
		'estimate_range'   => 'Estimate',
		'estimate_consent' => 'Newsletter',
		'date'             => 'Received',
	);
} );

add_action( 'manage_' . PRADIPTA_ESTIMATE_POST_TYPE . '_posts_custom_column', function ( $column, $post_id ) {
	switch ( $column ) {
		case 'estimate_email':
			$email = get_post_meta( $post_id, '_estimate_email', true );
			printf(
				'<a href="%s"><strong>%s</strong></a>',
				esc_url( get_edit_post_link( $post_id ) ),
				esc_html( $email )
			);
			break;

		case 'estimate_range':
			echo esc_html(
				pradipta_estimates_range(
					get_post_meta( $post_id, '_estimate_low', true ),
					get_post_meta( $post_id, '_estimate_high', true ),
					get_post_meta( $post_id, '_estimate_currency', true )
				)
			);
			break;

		case 'estimate_consent':
			echo get_post_meta( $post_id, '_estimate_marketing_consent', true ) === '1' ? 'Yes' : 'No';
			break;
	}
}, 10, 2 );

/* =========================================================
   DETAILS PANEL (read-only)
========================================================= */

add_action( 'add_meta_boxes_' . PRADIPTA_ESTIMATE_POST_TYPE, function () {
	add_meta_box( 'pradipta-estimate-details', 'Estimate Details', 'pradipta_estimates_details_box', null, 'normal', 'high' );
} );

function pradipta_estimates_details_box( WP_Post $post ) {
	$email    = get_post_meta( $post->ID, '_estimate_email', true );
	$consent  = get_post_meta( $post->ID, '_estimate_marketing_consent', true ) === '1';
	$consent_at = get_post_meta( $post->ID, '_estimate_consent_at', true );
	$answers  = json_decode( (string) get_post_meta( $post->ID, '_estimate_answers', true ), true ) ?: array();
	$estimate = json_decode( (string) get_post_meta( $post->ID, '_estimate_result', true ), true ) ?: array();
	$currency = isset( $estimate['currency'] ) ? $estimate['currency'] : '';
	$money    = function ( $amount ) use ( $currency ) {
		return esc_html( pradipta_estimates_money( $amount, $currency ) );
	};
	?>
	<h3>Contact</h3>
	<p>
		<a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a><br />
		Newsletter: <?php echo $consent ? esc_html( 'Yes (opted in ' . $consent_at . ' UTC)' ) : 'No'; ?><br />
		<?php
		// Estimates saved before version 1.1 have no record.
		$acknowledged = get_post_meta( $post->ID, '_estimate_acknowledged', true );
		$ack_label    = '1' === $acknowledged ? 'Sent' : ( '0' === $acknowledged ? 'Failed (check the website\'s logs)' : 'Not sent' );
		?>
		Copy emailed to visitor: <?php echo esc_html( $ack_label ); ?>
		<?php if ( '1' === $acknowledged ) : ?>
			(<?php echo '1' === get_post_meta( $post->ID, '_estimate_pdf_attached', true ) ? 'with the PDF' : 'without a PDF'; ?>)
		<?php endif; ?>
	</p>

	<?php if ( $estimate ) : ?>
		<h3>Estimate</h3>
		<p>
			<strong><?php echo $money( $estimate['low'] ?? 0 ); ?> – <?php echo $money( $estimate['high'] ?? 0 ); ?></strong>
			<?php if ( isset( $estimate['timeline'] ) ) : ?>
				· <?php echo esc_html( ( $estimate['timeline']['minWeeks'] ?? '?' ) . '–' . ( $estimate['timeline']['maxWeeks'] ?? '?' ) ); ?> weeks
			<?php endif; ?>
		</p>
		<?php if ( ! empty( $estimate['summary'] ) ) : ?>
			<p><?php echo esc_html( $estimate['summary'] ); ?></p>
		<?php endif; ?>

		<?php if ( isset( $estimate['phaseOne']['low'], $estimate['phaseOne']['high'] ) ) : ?>
			<p>
				<strong>Start smaller:</strong>
				<?php echo $money( $estimate['phaseOne']['low'] ); ?> – <?php echo $money( $estimate['phaseOne']['high'] ); ?>
				<?php if ( ! empty( $estimate['phaseOne']['scope'] ) ) : ?>
					· <?php echo esc_html( $estimate['phaseOne']['scope'] ); ?>
				<?php endif; ?>
			</p>
		<?php endif; ?>

		<?php
		// Estimates from before the plugin's version 1.2 compared agency prices.
		foreach ( array( 'freelance' => 'typical freelance price', 'agency' => 'typical agency price' ) as $key => $label ) :
			if ( isset( $estimate[ $key ]['low'], $estimate[ $key ]['high'] ) ) :
				?>
			<p>
				<strong>Shown as <?php echo esc_html( $label ); ?>:</strong>
				<?php echo $money( $estimate[ $key ]['low'] ); ?> – <?php echo $money( $estimate[ $key ]['high'] ); ?>
			</p>
				<?php
			endif;
		endforeach;
		?>

		<?php if ( ! empty( $estimate['rush'] ) ) : ?>
			<p><strong>Rush premium applied.</strong></p>
		<?php endif; ?>

		<?php if ( ! empty( $estimate['breakdown'] ) ) : ?>
			<table class="widefat striped" style="max-width:640px">
				<tbody>
				<?php foreach ( $estimate['breakdown'] as $row ) : ?>
					<tr>
						<td><?php echo esc_html( $row['item'] ?? '' ); ?></td>
						<td><?php echo $money( $row['low'] ?? 0 ); ?> – <?php echo $money( $row['high'] ?? 0 ); ?></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>

		<?php foreach ( array( 'costDrivers' => 'Cost drivers', 'assumptions' => 'Assumptions' ) as $key => $label ) : ?>
			<?php if ( ! empty( $estimate[ $key ] ) ) : ?>
				<h4><?php echo esc_html( $label ); ?></h4>
				<ul style="list-style:disc;padding-left:20px">
					<?php foreach ( $estimate[ $key ] as $item ) : ?>
						<li><?php echo esc_html( $item ); ?></li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>
		<?php endforeach; ?>
	<?php endif; ?>

	<h3>Answers</h3>
	<table class="widefat striped" style="max-width:640px">
		<tbody>
		<?php foreach ( $answers as $question => $answer ) : ?>
			<tr>
				<th style="width:45%"><?php echo esc_html( $question ); ?></th>
				<td><?php echo esc_html( is_array( $answer ) ? implode( ', ', $answer ) : $answer ); ?></td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
	<?php
}
