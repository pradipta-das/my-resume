<?php
/**
 * Plugin Name: Pradipta Case Studies
 * Description: Adds a "Case Studies" post type with project details (client, year, role, services, results…) for the website's /case-studies pages, read through the REST API at wp/v2/case-studies.
 * Version:     1.0.0
 * Author:      Pradipta Das
 * Requires PHP: 7.4
 *
 * Writing a case study:
 *   - Title, excerpt (the one-line summary on cards and under the title) and
 *     featured image (at least 1600px wide looks best).
 *   - The editor holds the full story: headings, text, screenshots.
 *   - "Case Study Details" below the editor holds the facts.
 *   - "Order" (Page Attributes / Summary panel) sets the position on the
 *     listing: lower numbers first, newest first for equal numbers.
 *
 * The REST lock (pradipta-rest-lock) keeps the endpoint private to the
 * website. Case studies have no pages on this site; they live on
 * pradipta.online/case-studies.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PRADIPTA_CASE_STUDY_POST_TYPE = 'case-study';

/*
 * Fields, keyed by meta key: label, input type and help text. Lists ("lines")
 * take one item per line; results take "value | label" per line.
 */
function pradipta_case_study_fields() {
	return array(
		'cs_client'    => array( 'Client', 'text', 'e.g. Springolino' ),
		'cs_year'      => array( 'Year', 'text', 'e.g. 2025' ),
		'cs_industry'  => array( 'Industry', 'text', 'e.g. Leisure & hospitality' ),
		'cs_role'      => array( 'My role', 'text', 'e.g. Design & development' ),
		'cs_duration'  => array( 'Duration', 'text', 'e.g. 8 weeks' ),
		'cs_live_url'  => array( 'Live site URL', 'url', 'https://' ),
		'cs_services'  => array( 'Services', 'lines', "One per line, e.g.\nWordPress development\nCustom booking plugin" ),
		'cs_stack'     => array( 'Technology', 'lines', "One per line, e.g.\nWordPress\nPHP\nGSAP" ),
		'cs_results'   => array( 'Results', 'lines', "One per line as value | label, e.g.\n+40% | Online bookings\n2.1s | Faster page loads" ),
		'cs_challenge' => array( 'The challenge', 'textarea', 'What problem did the client have? A short paragraph or two.' ),
		'cs_approach'  => array( 'The approach', 'textarea', 'How did you solve it? A short paragraph or two.' ),
	);
}

/* =========================================================
   POST TYPE
========================================================= */

add_action( 'init', function () {
	register_post_type(
		PRADIPTA_CASE_STUDY_POST_TYPE,
		array(
			'labels'             => array(
				'name'               => 'Case Studies',
				'singular_name'      => 'Case Study',
				'add_new_item'       => 'Add New Case Study',
				'edit_item'          => 'Edit Case Study',
				'new_item'           => 'New Case Study',
				'search_items'       => 'Search Case Studies',
				'not_found'          => 'No case studies yet.',
				'not_found_in_trash' => 'No case studies in the trash.',
				'all_items'          => 'All Case Studies',
			),
			// No pages on this site (it redirects to pradipta.online), but
			// editable in the admin and readable by the website over REST.
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true,
			'rest_base'          => 'case-studies',
			'menu_icon'          => 'dashicons-portfolio',
			'menu_position'      => 21,
			'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes', 'custom-fields' ),
		)
	);

	foreach ( pradipta_case_study_fields() as $key => $field ) {
		register_post_meta(
			PRADIPTA_CASE_STUDY_POST_TYPE,
			$key,
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => '',
				'show_in_rest'      => true,
				'sanitize_callback' => function ( $value ) use ( $field ) {
					return pradipta_case_study_sanitize( $value, $field[1] );
				},
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
} );

function pradipta_case_study_sanitize( $value, $type ) {
	$value = (string) $value;
	switch ( $type ) {
		case 'url':
			return esc_url_raw( trim( $value ) );
		case 'lines':
		case 'textarea':
			return sanitize_textarea_field( $value );
		default:
			return sanitize_text_field( $value );
	}
}

/* =========================================================
   DETAILS PANEL
========================================================= */

add_action( 'add_meta_boxes_' . PRADIPTA_CASE_STUDY_POST_TYPE, function () {
	add_meta_box( 'pradipta-case-study-details', 'Case Study Details', 'pradipta_case_study_details_box', null, 'normal', 'high' );
} );

function pradipta_case_study_details_box( WP_Post $post ) {
	wp_nonce_field( 'pradipta_case_study_save', 'pradipta_case_study_nonce' );
	?>
	<style>
		.pcs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px 24px; }
		.pcs-field label { display: block; font-weight: 600; margin-bottom: 4px; }
		.pcs-field input, .pcs-field textarea { width: 100%; }
		.pcs-field textarea { min-height: 110px; }
		.pcs-field.is-wide { grid-column: 1 / -1; }
		.pcs-field .description { margin-top: 4px; white-space: pre-line; }
	</style>
	<div class="pcs-grid">
		<?php foreach ( pradipta_case_study_fields() as $key => $field ) : ?>
			<?php
			list( $label, $type, $help ) = $field;
			$value = get_post_meta( $post->ID, $key, true );
			$wide  = in_array( $type, array( 'lines', 'textarea' ), true ) && in_array( $key, array( 'cs_results', 'cs_challenge', 'cs_approach' ), true );
			?>
			<div class="pcs-field<?php echo $wide ? ' is-wide' : ''; ?>">
				<label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label>
				<?php if ( 'lines' === $type || 'textarea' === $type ) : ?>
					<textarea id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>"><?php echo esc_textarea( $value ); ?></textarea>
					<p class="description"><?php echo esc_html( $help ); ?></p>
				<?php else : ?>
					<input type="<?php echo 'url' === $type ? 'url' : 'text'; ?>" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $value ); ?>" placeholder="<?php echo esc_attr( $help ); ?>" />
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
	<?php
}

add_action( 'save_post_' . PRADIPTA_CASE_STUDY_POST_TYPE, function ( $post_id ) {
	if ( ! isset( $_POST['pradipta_case_study_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['pradipta_case_study_nonce'] ), 'pradipta_case_study_save' ) ) {
		return;
	}
	if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) || wp_is_post_revision( $post_id ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	foreach ( pradipta_case_study_fields() as $key => $field ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, pradipta_case_study_sanitize( wp_unslash( $_POST[ $key ] ), $field[1] ) );
		}
	}
} );

// The panel above edits these fields, so keep them out of the generic
// "Custom Fields" box (which 'custom-fields' support would otherwise show).
add_filter( 'is_protected_meta', function ( $protected, $meta_key ) {
	return 0 === strpos( $meta_key, 'cs_' ) ? true : $protected;
}, 10, 2 );

/* =========================================================
   ADMIN LIST COLUMNS
========================================================= */

add_filter( 'manage_' . PRADIPTA_CASE_STUDY_POST_TYPE . '_posts_columns', function ( $columns ) {
	return array(
		'cb'        => $columns['cb'],
		'title'     => 'Title',
		'cs_client' => 'Client',
		'cs_year'   => 'Year',
		'cs_order'  => 'Order',
		'date'      => $columns['date'],
	);
} );

add_action( 'manage_' . PRADIPTA_CASE_STUDY_POST_TYPE . '_posts_custom_column', function ( $column, $post_id ) {
	if ( 'cs_order' === $column ) {
		echo (int) get_post_field( 'menu_order', $post_id );
		return;
	}
	if ( in_array( $column, array( 'cs_client', 'cs_year' ), true ) ) {
		echo esc_html( get_post_meta( $post_id, $column, true ) );
	}
}, 10, 2 );
