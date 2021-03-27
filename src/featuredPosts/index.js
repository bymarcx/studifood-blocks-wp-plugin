const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.blockEditor;
const { withSelect } = wp.data;

import { ReactComponent as Logo } from "../sf-logo.svg";
import logoWhiteURL from "../sf-logo-white.svg";

registerBlockType("studifood/featured-recipes", {
  title: __("Two featured recipes", "studifood"),
  icon: { src: Logo },
  category: "studifood",
  edit: withSelect( select => {
    return {
      // Send a GET query to the REST API.
      posts: select( "core" ).getEntityRecords( "postType", "recipes", {
        per_page: 2
      })
    };
  })(({ posts, className }) => {
    // Wait for posts to be returned.
    if ( !posts ) {
      return "Loading...";
    }
    
    // If no posts are returned.
    if ( posts && posts.length === 0 ) {
      return "No posts";
    }

    // Grab the first post.
    const post = posts[0];
    console.info(post);

    const featImg = imageURL => {
      return imageURL ? imageURL : logoWhiteURL;
    }

    return (
      <div className={`${className} studifood-block studifood-dynamic`} >
        <div class="studifood-editor-block-headline">StudiFood :: FeaturesRecipes - Recipe Block</div>
        <p class="studifood-editor-block-headline"> AUSGABE NUR IM FRONTEND :: HIER GIBT ES NICHTS ZU BEARBEITEN :) <br/>2 FEATURED RECIPES</p>
      </div>
    );
  }),
  
  save(props) {
    return null;
  }
});
