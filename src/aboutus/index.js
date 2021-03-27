const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, MediaUpload } = wp.blockEditor;

console.info(wp.blockEditor);

import { ReactComponent as Logo } from "../sf-logo.svg";
import logoWhiteURL from "../sf-logo-white.svg";

registerBlockType("studifood/aboutus", {
  title: __("About us", "studifood"),
  icon: { src: Logo },
  category: "studifood",
  attributes: {
    AboutUsTitle: {
      type: "string",
      source: "html",
      selector: ".studifood-abouttitle"
    },
    AboutUsText: {
      type: "array",
      source: "children",
      multiline: "p",
      selector: ".studifood-abouttext"
    },
    AboutUsImage: {
      type: "string",
      source: "attribute",
      selector: ".studifood-logo img",
      attribute: "src",
      default: logoWhiteURL
    }
  },

  edit: props => {

    // Lift info from props and populate various constants.
    const {
      attributes: { AboutUsTitle, AboutUsText, AboutUsImage },
      className,
      setAttributes
    } = props;

    // Grab newEpisodeTitle, set the value of episodeTitle to newEpisodeTitle.
    const onChangeAboutUsTitle = newAboutUsTitle => {
      setAttributes({ AboutUsTitle: newAboutUsTitle });
    };

    const onChangeAboutUsText = newAboutUsText => {
      setAttributes({ AboutUsText: newAboutUsText });
    };

    // Grab imageObject, set the value of episodeImage to imageObject.sizes.studifoodFeatImg.url.
    const onImageSelect = imageObject => {
      setAttributes({ AboutUsImage: imageObject.sizes.studifoodFeatImg.url });
    };

    return (
      <div className={`studifood-block studifood-editable`}>
        <div class="studifood-editor-block-headline">StudiFood :: About us Block</div>
        <div class="container-1">
          <div class="col-1">
              <div className="studifood-info">
                <h2 className="studifood-abouttitle">
                  <RichText
                    placeholder={__("Wir über uns!", "studifood")}
                    value={AboutUsTitle}
                    onChange={onChangeAboutUsTitle}
                  />
                </h2>
                <div className="studifood-abouttext">
                  <RichText
                    placeholder={__("Beschreibung über StudiFood...", "studifood")}
                    onChange={onChangeAboutUsText}
                    value={AboutUsText}
                  />
                </div>
              </div>
            </div>
            <div class="col-2">
              <figure className="studifood-logo">
                <MediaUpload
                  onSelect={onImageSelect}
                  allowedTypes={ 'image' }
                  type="image"
                  value={AboutUsImage}
                  render={({ open }) => {
                    return <img 
                        src={AboutUsImage}
                        onClick={open}
                        />;
                  }
                  }
                />
              </figure>
            </div>
        </div>
      </div>
    );
  },
  save: props => {
    const {
      attributes: { AboutUsImage, AboutUsText, AboutUsTitle }
    } = props;

    return (
      <section class="widget_aboutuswidget">
        <div class="container">
          <div class="row">
            <div class="col-md-6 col-12">
              <h2 className="studifood-abouttitle" >
                <RichText.Content value={AboutUsTitle} />
              </h2>
              <p className="studifood-abouttext">
                <RichText.Content value={AboutUsText} />
              </p>
            </div>
            <div class="col-md-6 col-12">
              <figure className="studifood-logo">
                <img src={AboutUsImage} alt="logo" />
              </figure>
            </div>
          </div>
        </div>
      </section>
    );
  }
});
