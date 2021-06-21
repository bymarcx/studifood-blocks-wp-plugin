<?php

/**
 * Plugin Name: StudiFood - Custom Blocks
 * Plugin URI: studifood.com
 * Description: 21 :: Custom block plugin for StudiFood
 * Version: 1.0.0
 * Author: Marc Eberhard
 * Author URI: bymarc.media
 *
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load translations (if any) for the plugin from the /languages/ folder.
 * 
 * @link https://developer.wordpress.org/reference/functions/load_plugin_textdomain/
 */
add_action( 'init', 'studifood_load_textdomain' );

function studifood_load_textdomain() {
	load_plugin_textdomain( 'studifood', false, basename( __DIR__ ) . '/languages' );
}

/** 
 * Add custom image size for block featured image.
 * 
 * @link https://developer.wordpress.org/reference/functions/add_image_size/
 */
add_action( 'init', 'studifood_add_image_size' );

function studifood_add_image_size() {
	add_image_size( 'studifoodFeatImg', 600, 400, array( 'center', 'center' ) ); 
}

/** 
 * Register custom image size with sizes list to make it available.
 * 
 * @link https://codex.wordpress.org/Plugin_API/Filter_Reference/image_size_names_choose
 */
add_filter( 'image_size_names_choose', 'studifood_custom_sizes' );

function studifood_custom_sizes( $sizes ) {
	return array_merge( $sizes, array(
		'studifoodFeatImg' => __('studifood Featured Image'),
	) );
}

/**
 * Add the featured image to the REST API response.
 */
add_filter( 'rest_prepare_post', 'studifood_fetured_image_json', 10, 3 );

function studifood_fetured_image_json( $data, $post, $context ) {
	// Get the featured image id from the REST API response.
	$featured_image_id = $data->data['featured_media']; 

	// Get the URL for a specific image size based on the image ID.
	$featured_image_url = wp_get_attachment_image_src( $featured_image_id, 'studifoodFeatImg' ); // get url of the original size

	// If we have a URL, add it to the REST API response.
	if( $featured_image_url ) {
		$data->data['featured_image_studifoodFeatImg_url'] = $featured_image_url[0];
	}

	return $data;
}

/** 
 * Add custom "studifood" block category
 * 
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/filters/block-filters/#managing-block-categories
 */
add_filter( 'block_categories', 'studifood_block_categories', 10, 2 );

function studifood_block_categories( $categories, $post ) {
	if ( $post->post_type !== 'post' ) {
		return $categories;
	}
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'studifood',
				'title' => __( 'studifood', 'studifood' ),
				'icon'  => 'microphone',
			),
		)
	);
}

/**
 * Registers all block assets so that they can be enqueued through the Block Editor in
 * the corresponding context.
 *
 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-registration/
 */
add_action( 'init', 'studifood_register_blocks' );

function studifood_register_blocks() {

	// If Block Editor is not active, bail.
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	// Retister the block editor script.
	wp_register_script(
		'studifood-editor-script',											// label
		plugins_url( 'build/index.js', __FILE__ ),						// script file
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', "wp-data" ),		// dependencies
		filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )		// set version as file last modified time
	);

	// // Register the block editor stylesheet.
	// wp_register_style(
	// 	'studifood-editor-styles',											// label
	// 	plugins_url( 'build/editor.css', __FILE__ ),					// CSS file
	// 	array( 'wp-edit-blocks' ),										// dependencies
	// 	filemtime( plugin_dir_path( __FILE__ ) . 'build/editor.css' )	// set version as file last modified time
	// );

	// // Register the front-end stylesheet.
	// wp_register_style(
	// 	'studifood-front-end-styles',										// label
	// 	plugins_url( 'build/style.css', __FILE__ ),						// CSS file
	// 	array( ),														// dependencies
	// 	filemtime( plugin_dir_path( __FILE__ ) . 'build/style.css' )	// set version as file last modified time
	// );

	// Array of block created in this plugin.
	$blocks = [
		// 'podkit/media',
		'studifood/aboutus',
		'studifood/aboutus2',
		'studifood/ownrecipe',
		'studifood/featured-posts-head',
		'studifood/offsetblock',
	];
	
	// Loop through $blocks and register each block with the same script and styles.
	foreach( $blocks as $block ) {
		register_block_type( $block, array(
			'editor_script' => 'studifood-editor-script',					// Calls registered script above
			'editor_style' => 'studifood-editor-styles',					// Calls registered stylesheet above
			'style' => 'studifood-front-end-styles',						// Calls registered stylesheet above
		) );	  
	}

	// Register dynamic block.
	register_block_type( 'studifood/featured-recipes', array(
		'editor_script' => 'studifood-editor-script',
		'editor_style' => 'studifood-editor-styles',
		'style' => 'studifood-front-end-styles',
		'render_callback' => 'studifood_dynamic_render_callback'
	) );

	if ( function_exists( 'wp_set_script_translations' ) ) {
	/**
	 * Adds internationalization support. 
	 * 
	 * @link https://wordpress.org/gutenberg/handbook/designers-developers/developers/internationalization/
	 * @link https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
	 */
	wp_set_script_translations( 'studifood-editor-script', 'studifood', plugin_dir_path( __FILE__ ) . '/languages' );
	}

}

/**
 * Build classes based on block attributes.
 * Returns string of classes.
 * 
 * $attributes - array - Block attributes.
 */
function studifood_block_classes( $attributes ) {
	$classes = null;
	// if ( $attributes['align'] ) {
	// 	$classes = 'align' . $attributes['align'] . ' ';
	// }

	// if ( $attributes['className'] ) {
	// 	$classes .= $attributes['className']; 
	// }

	return $classes;
}

/**
 * Serve up featured image is available, otherwise serve up logo.
 * Returns <img> element.
 * 
 * $post - object - The post object.
 */ 
// function studifood_post_img( $post ) {
// 	$studifood_img = get_the_post_thumbnail( $post, 'studifoodFeatImg' );
// 	if ( empty( $studifood_img ) ) {
// 		$url = plugins_url( "src/sf-logo-white.svg", __FILE__ );
// 		$studifood_img = '<img src="' . $url . '" alt="Das ist StudiFood." />';
// 	}
// 	return $studifood_img;
// }

/**
 * Render the saved output from the dynamic block.
 * 
 * $attributes - array - Block attributes.
 * $content - Block inner content.
 */
function studifood_dynamic_render_callback( $attributes, $content ) {

	global $post;

	// Get the latest posts using wp_get_recent_posts().
	$recent_posts = wp_get_recent_posts ( array(
			'post_type' => 'recipes',
            'posts_per_page' => 2,
			'meta_key' => 'wprm_rating_average',
            'orderby' => 'wprm_rating_average',
            'order' => 'DESC',
	) );
	
	// Check if any posts were returned, if not, say so.
	if ( 0 === count( $recent_posts ) ) {
		return 'No posts.';
	}

	// Get the post ID for the first post returned.
	$post_id = $recent_posts[0]['ID'];
	$post_id2 = $recent_posts[1]['ID'];


	// Get the post object based on post ID.
	$post = get_post( $post_id );
	$post2 = get_post( $post_id2 );


	// Setup postdata so regular template functions work.
	setup_postdata($post);
	setup_postdata($post2);

		// Get the recipes inside the current post.
		$recipes = WPRM_Recipe_Manager::get_recipe_ids_from_post($post_id);
		$recipes2 = WPRM_Recipe_Manager::get_recipe_ids_from_post($post_id2);

		// Access the first recipe, if there is one.
			$recipe_id = $recipes[0];
			$recipe_id2 = $recipes2[0];
			$recipe = WPRM_Recipe_Manager::get_recipe( $recipe_id );
			$recipe2 = WPRM_Recipe_Manager::get_recipe( $recipe_id2 );

			// Output the recipe name.
			//echo ("<p>" . $recipe->name() . "</p>" );
			//echo("<div class=\"img_overlay\"></div>" );
	

	$blockcontent = '<section class="section widget_featuredrecipeswidget nomargintop"><div class="container">
	<div class="row">
	<div class="col-12 offset-xl-1 col-xl-10">
                            <div class="row">
	<div class="col-md-0 col-xxl-3 order-1"></div>

                        <div class=" order-3 order-lg-2 col-md-12 col-lg-4 col-xxl-3 all-recipes" data-aos="fade"><div class="all-recipes-inner">
                            <a href="./rezepte" class="btn btn-secondary">Alle Rezepte</a>
                        </div></div>

	'.     
	sprintf(
		'<div class="col-lg-4 order-2 order-lg-3 col-xxl-3 recipe-card" data-aos="fade">
				<a href="%2$s">
						<p>%3$s</p>
						<div class="img_overlay"></div>
						%4$s
				</a>
		</div>',
		studifood_block_classes( $attributes ),
		esc_url( get_the_permalink($post) ),
		esc_html( $recipe->name() ),
		$recipe->image(1920,1080),		
		__("BLA", "studifood")
	) . sprintf(
		'<div class="col-lg-4 order-2 order-lg-3 col-xxl-3 recipe-card" data-aos="fade">
			<a href="%2$s">
				<p>%3$s</p>
				<div class="img_overlay"></div>
				%4$s
			</a>
		</div>',
	studifood_block_classes( $attributes ),
	esc_url( get_the_permalink($post2) ),
	esc_html( $recipe2->name() ),
	$recipe2->image(1920,1080),	
	). '</div></div></div></div></section>' ;


	return $blockcontent;



	// Reset postdata to avoid conflicts.
	wp_reset_postdata();
	
}