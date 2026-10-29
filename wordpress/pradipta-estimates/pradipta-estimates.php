<?php
/**
 * Plugin Name: Pradipta Project Estimates
 * Description: Stores project estimates sent by the website's cost estimator (pradipta/v1/estimates), lists them under "Project Estimates" in the admin, and emails the visitor a copy of their estimate.
 * Version:     1.1.0
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
 * The visitor gets a plain-text copy of their estimate from "Pradipta Das",
 * with replies going to the admin email. It uses the same optional
 * wp-config.php settings as the consultations plugin:
 *
 *     define( 'PRADIPTA_MAIL_FROM', 'hello@pradipta.online' );  // sender address
 *     define( 'PRADIPTA_MAIL_FROM_NAME', 'Pradipta Das' );
 *     define( 'PRADIPTA_MAIL_REPLY_TO', 'hello@pradipta.online' );
 *     define( 'PRADIPTA_SITE_URL', 'https://pradipta.online' );
 *
 * Change or turn off the email with the pradipta_estimate_acknowledgement
 * filter (return an empty array to skip it).
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
			),
		)
	);
} );

function pradipta_estimates_authorized( WP_REST_Request $request ) {
	$secret   = defined( 'PRADIPTA_ESTIMATE_SECRET' ) ? (string) PRADIPTA_ESTIMATE_SECRET : '';
	$provided = (string) $request->get_header( 'x-estimate-secret' );

	return '' !== $secret && hash_equals( $secret, $provided );
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
	$answers  = pradipta_estimates_clean( (array) $request->get_param( 'answers' ) );
	$estimate = pradipta_estimates_clean( (array) $request->get_param( 'estimate' ) );

	$currency = isset( $estimate['currency'] ) ? strtoupper( substr( $estimate['currency'], 0, 3 ) ) : '';
	$low      = isset( $estimate['low'] ) ? (float) $estimate['low'] : 0;
	$high     = isset( $estimate['high'] ) ? (float) $estimate['high'] : 0;

	$post_id = wp_insert_post(
		array(
			'post_type'   => PRADIPTA_ESTIMATE_POST_TYPE,
			'post_status' => 'private',
			'post_title'  => sprintf( '%s — %s %s–%s', $email, $currency, number_format( $low ), number_format( $high ) ),
			'meta_input'  => array(
				'_estimate_email'             => $email,
				'_estimate_marketing_consent' => $consent ? '1' : '0',
				// When consent was given, kept as a record of the opt-in.
				'_estimate_consent_at'        => $consent ? current_time( 'mysql', true ) : '',
				'_estimate_currency'          => $currency,
				'_estimate_low'               => $low,
				'_estimate_high'              => $high,
				'_estimate_answers'           => wp_json_encode( $answers ),
				'_estimate_result'            => wp_json_encode( $estimate ),
			),
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'save_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
	}

	pradipta_estimates_acknowledge( $post_id, $email, $estimate );

	return new WP_REST_Response( array( 'id' => $post_id ), 201 );
}

// AI-written text for the email: no links, and not too long. The estimate is
// written from the visitor's answers and anyone can type any address into
// the form, so the email mustn't carry links a stranger could plant.
function pradipta_estimates_email_text( $text, $limit = 600 ) {
	$text = preg_replace( '~(?:https?://|www\.)\S+~i', '', (string) $text );
	$text = trim( preg_replace( '/\s+/', ' ', $text ) );
	return mb_strlen( $text ) > $limit ? rtrim( mb_substr( $text, 0, $limit - 1 ) ) . '…' : $text;
}

// Emails the visitor a copy of their estimate. Best effort: the estimate is
// already saved and shown on the website, so a mail failure doesn't fail it.
function pradipta_estimates_acknowledge( $post_id, $email, $estimate ) {
	$site     = untrailingslashit( defined( 'PRADIPTA_SITE_URL' ) ? PRADIPTA_SITE_URL : 'https://pradipta.online' );
	$currency = isset( $estimate['currency'] ) ? strtoupper( substr( (string) $estimate['currency'], 0, 3 ) ) : '';
	$money    = function ( $amount ) use ( $currency ) {
		return trim( $currency . ' ' . number_format( (float) $amount ) );
	};
	$range    = $money( $estimate['low'] ?? 0 ) . ' – ' . number_format( (float) ( $estimate['high'] ?? 0 ) );

	$lines = array(
		'Hi there,',
		'',
		"Thanks for trying the cost estimator. Here's a copy of your estimate to keep.",
		'',
		'YOUR ESTIMATE',
		$range,
	);

	if ( isset( $estimate['timeline']['minWeeks'], $estimate['timeline']['maxWeeks'] ) ) {
		$lines[] = sprintf( 'Timeline: %d–%d weeks', (int) $estimate['timeline']['minWeeks'], (int) $estimate['timeline']['maxWeeks'] );
	}

	if ( ! empty( $estimate['summary'] ) ) {
		$lines[] = '';
		$lines[] = pradipta_estimates_email_text( $estimate['summary'] );
	}

	if ( isset( $estimate['phaseOne']['low'], $estimate['phaseOne']['high'] ) ) {
		$lines[] = '';
		$lines[] = 'START SMALLER';
		$lines[] = $money( $estimate['phaseOne']['low'] ) . ' – ' . number_format( (float) $estimate['phaseOne']['high'] );
		if ( ! empty( $estimate['phaseOne']['scope'] ) ) {
			$lines[] = pradipta_estimates_email_text( $estimate['phaseOne']['scope'], 300 );
		}
	}

	if ( isset( $estimate['agency']['low'], $estimate['agency']['high'] ) ) {
		$lines[] = '';
		$lines[] = 'TYPICAL AGENCY PRICE';
		$lines[] = $money( $estimate['agency']['low'] ) . ' – ' . number_format( (float) $estimate['agency']['high'] );
		$lines[] = 'The same work at typical agency rates in your market.';
	}

	if ( ! empty( $estimate['breakdown'] ) && is_array( $estimate['breakdown'] ) ) {
		$lines[] = '';
		$lines[] = 'BREAKDOWN';
		foreach ( array_slice( $estimate['breakdown'], 0, 12 ) as $row ) {
			$lines[] = sprintf(
				'- %s: %s – %s',
				pradipta_estimates_email_text( $row['item'] ?? '', 80 ),
				$money( $row['low'] ?? 0 ),
				number_format( (float) ( $row['high'] ?? 0 ) )
			);
		}
	}

	foreach ( array( 'costDrivers' => 'WHAT DRIVES THE COST', 'assumptions' => 'ASSUMPTIONS' ) as $key => $label ) {
		if ( ! empty( $estimate[ $key ] ) && is_array( $estimate[ $key ] ) ) {
			$lines[] = '';
			$lines[] = $label;
			foreach ( array_slice( $estimate[ $key ], 0, 8 ) as $item ) {
				$lines[] = '- ' . pradipta_estimates_email_text( $item, 200 );
			}
		}
	}

	$lines = array_merge(
		$lines,
		array(
			'',
			"This is a ballpark for planning, not a quote. Every project has details a questionnaire can't capture, and the real number depends on them.",
			'',
			"If you'd like to talk it through, just reply to this email, or book a free consultation call:",
			$site . '/free-consultation',
			'',
			'Pradipta Das',
			$site,
		)
	);

	$message = apply_filters(
		'pradipta_estimate_acknowledgement',
		array(
			'subject' => 'Your website estimate: ' . $range,
			'body'    => implode( "\n", $lines ),
		),
		$post_id,
		$estimate
	);

	if ( empty( $message['subject'] ) || empty( $message['body'] ) ) {
		return;
	}

	$sent = pradipta_estimates_mail_visitor( $email, $message['subject'], $message['body'] );
	update_post_meta( $post_id, '_estimate_acknowledged', $sent ? '1' : '0' );
}

// Sends an email to a visitor as "Pradipta Das", with replies coming back to
// the site owner. The sender filters apply to this one email only.
function pradipta_estimates_mail_visitor( $to, $subject, $body ) {
	$from      = defined( 'PRADIPTA_MAIL_FROM' ) && is_email( PRADIPTA_MAIL_FROM ) ? PRADIPTA_MAIL_FROM : '';
	$from_name = defined( 'PRADIPTA_MAIL_FROM_NAME' ) ? (string) PRADIPTA_MAIL_FROM_NAME : 'Pradipta Das';
	$reply_to  = defined( 'PRADIPTA_MAIL_REPLY_TO' ) && is_email( PRADIPTA_MAIL_REPLY_TO ) ? PRADIPTA_MAIL_REPLY_TO : get_option( 'admin_email' );
	$from_name = str_replace( array( "\r", "\n", '<', '>', '"' ), '', $from_name );

	$set_from      = function ( $address ) use ( $from ) {
		return $from ? $from : $address;
	};
	$set_from_name = function () use ( $from_name ) {
		return $from_name;
	};

	add_filter( 'wp_mail_from', $set_from );
	add_filter( 'wp_mail_from_name', $set_from_name );

	$headers = is_email( $reply_to ) ? array( sprintf( 'Reply-To: %s <%s>', $from_name, $reply_to ) ) : array();
	$sent    = wp_mail( $to, $subject, $body, $headers );

	remove_filter( 'wp_mail_from', $set_from );
	remove_filter( 'wp_mail_from_name', $set_from_name );

	return $sent;
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
			printf(
				'%s %s – %s',
				esc_html( get_post_meta( $post_id, '_estimate_currency', true ) ),
				esc_html( number_format( (float) get_post_meta( $post_id, '_estimate_low', true ) ) ),
				esc_html( number_format( (float) get_post_meta( $post_id, '_estimate_high', true ) ) )
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
		return esc_html( $currency . ' ' . number_format( (float) $amount ) );
	};
	?>
	<h3>Contact</h3>
	<p>
		<a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a><br />
		Newsletter: <?php echo $consent ? esc_html( 'Yes (opted in ' . $consent_at . ' UTC)' ) : 'No'; ?><br />
		<?php
		// Estimates saved before version 1.1 have no record.
		$acknowledged = get_post_meta( $post->ID, '_estimate_acknowledged', true );
		$ack_label    = '1' === $acknowledged ? 'Sent' : ( '0' === $acknowledged ? 'Failed (check your mail setup)' : 'Not sent' );
		?>
		Copy emailed to visitor: <?php echo esc_html( $ack_label ); ?>
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

		<?php if ( isset( $estimate['agency']['low'], $estimate['agency']['high'] ) ) : ?>
			<p>
				<strong>Shown as typical agency price:</strong>
				<?php echo $money( $estimate['agency']['low'] ); ?> – <?php echo $money( $estimate['agency']['high'] ); ?>
			</p>
		<?php endif; ?>

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
