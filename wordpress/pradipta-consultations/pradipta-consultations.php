<?php
/**
 * Plugin Name: Pradipta Consultation Requests
 * Description: Stores free consultation call requests sent by the website (pradipta/v1/consultations), lists them under "Consultations" in the admin, emails a notification for each one, and sends the visitor a short acknowledgement.
 * Version:     1.1.0
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
 *
 * The visitor gets a plain-text acknowledgement from "Pradipta Das". Replies
 * go to the admin email. Optional settings in wp-config.php:
 *
 *     define( 'PRADIPTA_MAIL_FROM', 'hello@pradipta.online' );  // sender address
 *     define( 'PRADIPTA_MAIL_FROM_NAME', 'Pradipta Das' );
 *     define( 'PRADIPTA_MAIL_REPLY_TO', 'hello@pradipta.online' );
 *     define( 'PRADIPTA_SITE_URL', 'https://pradipta.online' );
 *
 * Only set PRADIPTA_MAIL_FROM to an address your mail setup is allowed to send
 * from (an SMTP plugin authenticated for that domain), or the emails will land
 * in spam. Change or turn off the email with the pradipta_consultation_acknowledgement
 * filter (return an empty array to skip it).
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
	pradipta_consultations_acknowledge( $post_id, $name, $email );

	return new WP_REST_Response( array( 'id' => $post_id ), 201 );
}

// Tells the visitor their request arrived. Best effort, like the notification.
//
// Anyone can type any address into the form, so this email repeats nothing
// they wrote except a short first name: echoing their message would let the
// form be used to send arbitrary text to strangers from this site.
function pradipta_consultations_acknowledge( $post_id, $name, $email ) {
	$first = mb_substr( (string) strtok( trim( $name ), " \t" ), 0, 40 );
	$site  = untrailingslashit( defined( 'PRADIPTA_SITE_URL' ) ? PRADIPTA_SITE_URL : 'https://pradipta.online' );

	$body = implode(
		"\n",
		array(
			sprintf( 'Hi %s,', $first ),
			'',
			'Thank you for booking a free consultation. This is just a quick note to say your request arrived safely.',
			'',
			"It's also the only automatic email you'll get from me. I'll read what you shared properly and reply personally within one working day, with a few times for our call.",
			'',
			'If you think of anything else in the meantime, just reply to this email. It comes straight to me.',
			'',
			'Speak soon,',
			'Pradipta Das',
			$site,
		)
	);

	$message = apply_filters(
		'pradipta_consultation_acknowledgement',
		array(
			'subject' => sprintf( 'Thanks, %s. Your consultation request arrived', $first ),
			'body'    => $body,
		),
		$post_id
	);

	if ( empty( $message['subject'] ) || empty( $message['body'] ) ) {
		return;
	}

	$sent = pradipta_consultations_mail_visitor( $email, $message['subject'], $message['body'] );
	update_post_meta( $post_id, '_consultation_acknowledged', $sent ? '1' : '0' );
}

// Sends an email to a visitor as "Pradipta Das", with replies coming back to
// the site owner. The sender filters apply to this one email only.
function pradipta_consultations_mail_visitor( $to, $subject, $body ) {
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

// Whether the visitor's acknowledgement went out. Requests saved before
// version 1.1 have no record.
function pradipta_consultations_ack_label( $post_id ) {
	$sent = get_post_meta( $post_id, '_consultation_acknowledged', true );
	if ( '1' === $sent ) {
		return 'Sent';
	}
	return '0' === $sent ? 'Failed (check your mail setup)' : 'Not sent';
}

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
		Newsletter: <?php echo $consent ? esc_html( 'Yes (opted in ' . $consent_at . ' UTC)' ) : 'No'; ?><br />
		Acknowledgement email: <?php echo esc_html( pradipta_consultations_ack_label( $post->ID ) ); ?>
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
