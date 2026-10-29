<?php
/**
 * Plugin Name: Pradipta REST Lock
 * Description: Closes the public REST API (/wp-json and ?rest_route=). Only logged-in users, the Next.js site (by API key) and a short allowlist of routes get through; everyone else gets a 401.
 * Version:     1.1.0
 * Author:      Pradipta Das
 * Requires PHP: 7.4
 *
 * Setup: add the key to wp-config.php, matching WORDPRESS_API_SECRET in the
 * Next.js app:
 *
 *     define( 'PRADIPTA_API_SECRET', 'a-long-random-string' );
 *
 * Until the constant is defined, only logged-in users and the allowlist get
 * through, so set it before activating or the blog on the Next.js site stops
 * loading.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * Routes that stay public because something legitimately calls them without
 * the key. Matched against the start of the route.
 *   - Contact Form 7 submits its forms through the REST API.
 *   - The estimates endpoint checks its own secret (pradipta-estimates).
 */
function pradipta_rest_lock_public_routes() {
	return apply_filters(
		'pradipta_rest_lock_public_routes',
		array(
			'/contact-form-7/v1/',
			'/pradipta/v1/estimates',
		)
	);
}

/* =========================================================
   APPLICATION PASSWORDS ON HOSTS THAT DROP THE HEADER
   Some Apache/FastCGI setups remove the Authorization header
   before PHP runs, so Application Password logins never reach
   WordPress. Clients can send the same "Basic ..." value in
   X-WP-Authorization instead. It's copied to where WordPress
   reads credentials (wp_validate_application_password, which
   runs after plugins load), and the password is still checked
   by WordPress, so it grants nothing the usual header wouldn't.
========================================================= */

function pradipta_rest_lock_alternate_basic_auth() {
	if ( isset( $_SERVER['PHP_AUTH_USER'] ) || ! isset( $_SERVER['HTTP_X_WP_AUTHORIZATION'] ) ) {
		return;
	}

	// The same format check WordPress applies to the Authorization header.
	$header = (string) $_SERVER['HTTP_X_WP_AUTHORIZATION'];
	if ( ! preg_match( '%^Basic [a-z\d/+]*={0,2}$%i', $header ) ) {
		return;
	}

	$userpass = base64_decode( substr( $header, 6 ) );
	if ( false === $userpass || false === strpos( $userpass, ':' ) ) {
		return;
	}

	list( $_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'] ) = explode( ':', $userpass, 2 );
}
pradipta_rest_lock_alternate_basic_auth();

/* =========================================================
   GATE
   Runs after WordPress's own cookie check (priority 100). That
   check logs out any request without a valid nonce and then
   returns true for it ("no error"), so true can't be read as
   "authenticated": the decision rests on who is logged in once
   it has run. That's a user with a valid nonce (the block editor,
   Elementor) or an application password.
========================================================= */

add_filter( 'rest_authentication_errors', function ( $result ) {
	// An earlier check already rejected the request (e.g. a bad nonce).
	if ( is_wp_error( $result ) ) {
		return $result;
	}

	if ( is_user_logged_in() ) {
		return $result;
	}

	$secret   = defined( 'PRADIPTA_API_SECRET' ) ? (string) PRADIPTA_API_SECRET : '';
	$provided = isset( $_SERVER['HTTP_X_PRADIPTA_API_KEY'] ) ? (string) wp_unslash( $_SERVER['HTTP_X_PRADIPTA_API_KEY'] ) : '';
	if ( '' !== $secret && hash_equals( $secret, $provided ) ) {
		return $result;
	}

	// The route, however the request reached the API (/wp-json/... or ?rest_route=...).
	$route = isset( $GLOBALS['wp']->query_vars['rest_route'] ) ? '/' . ltrim( (string) $GLOBALS['wp']->query_vars['rest_route'], '/' ) : '';
	foreach ( pradipta_rest_lock_public_routes() as $prefix ) {
		if ( 0 === strpos( $route, $prefix ) ) {
			return $result;
		}
	}

	return new WP_Error( 'rest_forbidden', 'Not available.', array( 'status' => 401 ) );
}, 101 );

/* =========================================================
   DON'T ADVERTISE THE API
   Removes the <link rel="https://api.w.org/"> tag, the matching
   HTTP Link header, and the RSD entry, which point visitors and
   scanners at /wp-json.
========================================================= */

add_action( 'init', function () {
	remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
	remove_action( 'template_redirect', 'rest_output_link_header', 11 );
	remove_action( 'xmlrpc_rsd_apis', 'rest_output_rsd' );
} );
