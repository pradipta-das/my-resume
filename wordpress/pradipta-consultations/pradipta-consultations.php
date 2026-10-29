<?php
/**
 * Plugin Name: Pradipta Consultation Requests
 * Description: Stores free consultation call requests sent by the website (pradipta/v1/consultations), lists them under "Consultations" in the admin, and emails a notification for each one.
 * Version:     1.0.0
 * Author:      Pradipta Das
 * Requires PHP: 7.4
 *
 * Setup: uses the same API key as the REST lock, so nothing new is needed if
 * wp-config.php already has (matching WORDPRESS_API_SECRET in the Next.js app):
 *
 *     define( 'PRADIPTA_API_SECRET', 'a-long-random-string' );
 *
 * Requests without that key are rejected, and the endpoint stays closed until
 * the constant is defined.
 *
 * Notifications go to the site's admin email; change the address with the
 * pradipta_consultation_notify_to filter, or return '' to turn them off.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PRADIPTA_CONSULTATION_POST_TYPE = 'consultation_request';

/* =========================================================
   POST TYPE
   Private: visible only in the admin, never on the site or in
   the public REST API. Entries can't be created by hand.
========================================================= */

add_action( 'init', function () {
	register_post_type(
		PRADIPTA_CONSULTATION_POST_TYPE,
		array(
			'labels'          => array(
				'name'          => 'Consultations',
				'singular_name' => 'Consultation Request',
				'edit_item'     => 'Consultation Request',
				'search_items'  => 'Search Requests',
				'not_found'     => 'No consultation requests yet.',
			),
			'public'          => false,
			'show_ui'         => true,
			'show_in_menu'    => true,
			'show_in_rest'    => false,
			'menu_icon'       => 'dashicons-format-chat',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		)
	);
} );

/* =========================================================
   REST ENDPOINT: POST /wp-json/pradipta/v1/consultations
========================================================= */

add_action( 'rest_api_init', function () {
	register_rest_route(
		'pradipta/v1',
		'/consultations',
		array(
			'methods'             => 'POST',
			'callback'            => 'pradipta_consultations_create',
			'permission_callback' => 'pradipta_consultations_authorized',
			'args'                => array(
				'audience'          => array(
					'type'     => 'string',
					'enum'     => array( 'Individual', 'Agency' ),
					'required' => true,
				),
				'name'              => array(
					'type'     => 'string',
					'required' => true,
				),
				'email'             => array(
					'type'     => 'string',
					'format'   => 'email',
					'required' => true,
				),
				'phone'             => array(
					'type' => 'string',
				),
				'marketing_consent' => array(
					'type'     => 'boolean',
					'required' => true,
				),
				'answers'           => array(
					'type'     => 'object',
					'required' => true,
				),
			),
		)
	);
} );

function pradipta_consultations_authorized( WP_REST_Request $request ) {
	$secret   = defined( 'PRADIPTA_API_SECRET' ) ? (string) PRADIPTA_API_SECRET : '';
	$provided = (string) $request->get_header( 'x-pradipta-api-key' );

	return '' !== $secret && hash_equals( $secret, $provided );
}

// Cleans every answer; the free-text message keeps its line breaks.
function pradipta_consultations_clean( $value ) {
	if ( is_array( $value ) ) {
		$clean = array();
		foreach ( $value as $key => $item ) {
			$clean[ is_int( $key ) ? $key : sanitize_text_field( $key ) ] = pradipta_consultations_clean( $item );
		}
		return $clean;
	}
	return sanitize_textarea_field( (string) $value );
}

function pradipta_consultations_create( WP_REST_Request $request ) {
	$email = sanitize_email( $request->get_param( 'email' ) );
	if ( ! is_email( $email ) ) {
		return new WP_Error( 'invalid_email', 'A valid email is required.', array( 'status' => 400 ) );
	}

	$name = sanitize_text_field( $request->get_param( 'name' ) );
	if ( '' === $name ) {
		return new WP_Error( 'invalid_name', 'A name is required.', array( 'status' => 400 ) );
	}

	$audience = 'Agency' === $request->get_param( 'audience' ) ? 'Agency' : 'Individual';
	$phone    = sanitize_text_field( (string) $request->get_param( 'phone' ) );
	$consent  = (bool) $request->get_param( 'marketing_consent' );
	$answers  = pradipta_consultations_clean( (array) $request->get_param( 'answers' ) );

	$post_id = wp_insert_post(
		array(
			'post_type'   => PRADIPTA_CONSULTATION_POST_TYPE,
			'post_status' => 'private',
			'post_title'  => sprintf( '%s (%s) — %s', $name, $audience, $email ),
			'meta_input'  => array(
				'_consultation_audience'          => $audience,
				'_consultation_name'              => $name,
				'_consultation_email'             => $email,
				'_consultation_phone'             => $phone,
				'_consultation_marketing_consent' => $consent ? '1' : '0',
				// When consent was given, kept as a record of the opt-in.
				'_consultation_consent_at'        => $consent ? current_time( 'mysql', true ) : '',
				'_consultation_answers'           => wp_json_encode( $answers ),
			),
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		return new WP_Error( 'save_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
	}

	pradipta_consultations_notify( $post_id, $audience, $name, $email, $phone, $answers );

	return new WP_REST_Response( array( 'id' => $post_id ), 201 );
}

// Emails the request so it can be answered quickly. Best effort: the request
// is already saved, so a mail failure doesn't fail the submission.
function pradipta_consultations_notify( $post_id, $audience, $name, $email, $phone, $answers ) {
	$to = apply_filters( 'pradipta_consultation_notify_to', get_option( 'admin_email' ) );
	if ( ! $to ) {
		return;
	}

	$lines = array(
		sprintf( '%s (%s)', $name, $audience ),
		$email,
	);
	if ( $phone ) {
		$lines[] = $phone;
	}
	$lines[] = '';

	foreach ( $answers as $question => $answer ) {
		$lines[] = $question . ': ' . ( is_array( $answer ) ? implode( ', ', $answer ) : $answer );
	}

	$lines[] = '';
	$lines[] = 'View in WordPress: ' . admin_url( 'post.php?post=' . $post_id . '&action=edit' );

	$headers = array( sprintf( 'Reply-To: %s <%s>', str_replace( array( "\r", "\n", '<', '>' ), '', $name ), $email ) );

	wp_mail( $to, sprintf( 'New consultation request: %s', $name ), implode( "\n", $lines ), $headers );
}

/* =========================================================
   ADMIN LIST COLUMNS
========================================================= */

add_filter( 'manage_' . PRADIPTA_CONSULTATION_POST_TYPE . '_posts_columns', function () {
	return array(
		'cb'                   => '<input type="checkbox" />',
		'consultation_name'    => 'Name',
		'consultation_type'    => 'Type',
		'consultation_email'   => 'Email',
		'consultation_consent' => 'Newsletter',
		'date'                 => 'Received',
	);
} );

add_action( 'manage_' . PRADIPTA_CONSULTATION_POST_TYPE . '_posts_custom_column', function ( $column, $post_id ) {
	switch ( $column ) {
		case 'consultation_name':
			printf(
				'<a href="%s"><strong>%s</strong></a>',
				esc_url( get_edit_post_link( $post_id ) ),
				esc_html( get_post_meta( $post_id, '_consultation_name', true ) )
			);
			break;

		case 'consultation_type':
			echo esc_html( get_post_meta( $post_id, '_consultation_audience', true ) );
			break;

		case 'consultation_email':
			$email = get_post_meta( $post_id, '_consultation_email', true );
			printf( '<a href="mailto:%1$s">%2$s</a>', esc_attr( $email ), esc_html( $email ) );
			break;

		case 'consultation_consent':
			echo get_post_meta( $post_id, '_consultation_marketing_consent', true ) === '1' ? 'Yes' : 'No';
			break;
	}
}, 10, 2 );

/* =========================================================
   DETAILS PANEL (read-only)
========================================================= */

add_action( 'add_meta_boxes_' . PRADIPTA_CONSULTATION_POST_TYPE, function () {
	add_meta_box( 'pradipta-consultation-details', 'Request Details', 'pradipta_consultations_details_box', null, 'normal', 'high' );
} );

function pradipta_consultations_details_box( WP_Post $post ) {
	$name       = get_post_meta( $post->ID, '_consultation_name', true );
	$audience   = get_post_meta( $post->ID, '_consultation_audience', true );
	$email      = get_post_meta( $post->ID, '_consultation_email', true );
	$phone      = get_post_meta( $post->ID, '_consultation_phone', true );
	$consent    = get_post_meta( $post->ID, '_consultation_marketing_consent', true ) === '1';
	$consent_at = get_post_meta( $post->ID, '_consultation_consent_at', true );
	$answers    = json_decode( (string) get_post_meta( $post->ID, '_consultation_answers', true ), true ) ?: array();
	?>
	<h3>Contact</h3>
	<p>
		<strong><?php echo esc_html( $name ); ?></strong> (<?php echo esc_html( $audience ); ?>)<br />
		<a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a><br />
		<?php if ( $phone ) : ?>
			<a href="tel:<?php echo esc_attr( $phone ); ?>"><?php echo esc_html( $phone ); ?></a><br />
		<?php endif; ?>
		Newsletter: <?php echo $consent ? esc_html( 'Yes (opted in ' . $consent_at . ' UTC)' ) : 'No'; ?>
	</p>

	<h3>Answers</h3>
	<table class="widefat striped" style="max-width:720px">
		<tbody>
		<?php foreach ( $answers as $question => $answer ) : ?>
			<tr>
				<th style="width:35%"><?php echo esc_html( $question ); ?></th>
				<td><?php echo nl2br( esc_html( is_array( $answer ) ? implode( ', ', $answer ) : $answer ) ); ?></td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
	<?php
}
