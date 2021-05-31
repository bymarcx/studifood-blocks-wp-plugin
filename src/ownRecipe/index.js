const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PanelBody } = wp.components;
const { Fragment } = wp.element;
const { RichText, MediaUpload, InspectorControls, URLInputButton } = wp.blockEditor;

console.info(wp.blockEditor);

import { ReactComponent as Logo } from "../img/sf-logo.svg";
import logoWhiteURL from "../img/sf-logo-white.svg";
import placeholder from "../img/1920x1080.png";

registerBlockType("studifood/ownrecipe", {
  title: __("Own Recipe", "studifood"),
  icon: { src: Logo },
  category: "studifood",
  attributes: {
    ownRecipeTitle: {
      type: "string",
      source: "html",
      selector: ".studifood-ownRecipetitle"
    },
    ownRecipeText: {
      type: "array",
      source: "children",
      multiline: "p",
      selector: ".studifood-ownRecipetext"
    },
    ownRecipeButton: {
      type: "string",
      source: "html",
      selector: ".studifood-ownRecipebutton",
    },
    ownRecipeurl: {
      type: "string",
      source: "attribute",
      selector: ".studifood-ownRecipelink",
      attribute: "href",
    },
    ownRecipeImage: {
      type: "string",
      source: "attribute",
      selector: ".studifood-logo img",
      attribute: "src",
      default: placeholder
    }
  },

  edit: props => {

    // Lift info from props and populate various constants.
    const {
      attributes: { ownRecipeTitle, ownRecipeButton, ownRecipeurl, ownRecipeText, ownRecipeImage },
      className,
      setAttributes
    } = props;

    // Grab newEpisodeTitle, set the value of episodeTitle to newEpisodeTitle.
    const onChangeownRecipeTitle = newownRecipeTitle => {
      setAttributes({ ownRecipeTitle: newownRecipeTitle });
    };

    const onChangeownRecipeText = newownRecipeText => {
      setAttributes({ ownRecipeText: newownRecipeText });
    };

    const onChangeownRecipeButton = newownRecipeButton => {
      setAttributes({ ownRecipeButton: newownRecipeButton });
    };


    // Grab imageObject, set the value of episodeImage to imageObject.sizes.studifoodFeatImg.url.
    const onImageSelect = imageObject => {
      console.log("image", imageObject);
      setAttributes({ ownRecipeImage: imageObject.sizes.large.url });
    };

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody
            title={__('Select Button Link', 'awp')}
            initialOpen={true}
          >
            <div className="editor-post-featured-image">
              <URLInputButton
                url={ownRecipeurl}
                onChange={(newownRecipeurl) => setAttributes({ ownRecipeurl: newownRecipeurl })}
              />
            </div>
          </PanelBody>
        </InspectorControls>

        <div className={`studifood-block studifood-editable`}>
          <div class="studifood-editor-block-headline">StudiFood :: Own Recipe Block</div>
          <div class="container-1">
            {/* <div class="col-1"> */}
            <div>
              <div className="studifood-info">
                <h2 className="studifood-ownRecipetitle">
                  <RichText
                    placeholder={__("Eigenes Rezept", "studifood")}
                    value={ownRecipeTitle}
                    onChange={onChangeownRecipeTitle}
                  />
                </h2>
                <div className="studifood-ownRecipetext">
                  <RichText
                    placeholder={__("Sende uns dein eigenes Rezept...", "studifood")}
                    onChange={onChangeownRecipeText}
                    value={ownRecipeText}
                  />
                  <p className="studifood-ownRecipeButton">
                    <RichText
                      placeholder={__("zum Formular", "studifood")}
                      value={ownRecipeButton}
                      onChange={onChangeownRecipeButton}
                    />
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Fragment>
    );
  },
  save: props => {
    const {
      attributes: { ownRecipeImage, ownRecipeText, ownRecipeButton, ownRecipeurl, ownRecipeTitle }
    } = props;

    return (
      <section class="widget_ownRecipewidget wp-block-studifood-ownrecipe" data-aos="fade">
        <div class="container">
          <div class="row">
            <div class="col-md-10 offset-md-1 offset-0 col-12 col--1">
              <h2 className="studifood-ownRecipetitle" >
                <RichText.Content value={ownRecipeTitle} />
              </h2>
              <p className="studifood-ownRecipetext">
                <RichText.Content value={ownRecipeText} />
              </p>
              <a className="studifood-ownRecipeButton studifood-ownRecipelink btn btn-secondary" href={ownRecipeurl} class="" >
                <RichText.Content value={ownRecipeButton} />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
});
