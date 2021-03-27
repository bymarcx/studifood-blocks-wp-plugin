const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PanelBody } = wp.components;
const { Fragment } = wp.element;
const { RichText, MediaUpload, InspectorControls } = wp.blockEditor;

console.info(wp.blockEditor);

import { ReactComponent as Logo } from "../sf-logo.svg";
import logoWhiteURL from "../sf-logo-white.svg";

registerBlockType("studifood/featured-posts-head", {
    title: __("Featured Recipies Head", "studifood"),
    icon: { src: Logo }, 
    category: "studifood",
    attributes: {
        FeaturedHeadTitle: {
            type: "string",
            source: "html",
            selector: ".studifood-FeaturedHeadTitle"
        },
        FeaturedHeadText: {
            type: "array",
            source: "children",
            multiline: "p",
            selector: ".studifood-FeaturedHeadText"
        },
        FeaturedHeadImage: {
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
            attributes: { FeaturedHeadTitle, FeaturedHeadText, FeaturedHeadImage },
            className,
            setAttributes
        } = props;

        // Grab newEpisodeTitle, set the value of episodeTitle to newEpisodeTitle.
        const onChangeFeaturedHeadTitle = newFeaturedHeadTitle => {
            setAttributes({ FeaturedHeadTitle: newFeaturedHeadTitle });
        };

        const onChangeFeaturedHeadText = newFeaturedHeadText => {
            setAttributes({ FeaturedHeadText: newFeaturedHeadText });
        };

        // Grab imageObject, set the value of episodeImage to imageObject.sizes.studifoodFeatImg.url.
        const onImageSelect = imageObject => {
            setAttributes({ FeaturedHeadImage: imageObject.sizes.studifoodFeatImg.url });
        };

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody
                        title={__('Select block background image', 'awp')}
                        initialOpen={true}
                    >
                        <div className="editor-post-featured-image">
                            ...We will add code here...
                            <MediaUpload
                                onSelect={onImageSelect}
                                allowedTypes={ 'image' }
                                type="image"
                                render={({ open }) => {
                                    return (
                                        <button onClick={open}>
                                            <img
                                                src={ FeaturedHeadImage }
                                            />
                                        </button>
                                    );
                                }}
                            />
                        </div>
                    </PanelBody>
                </InspectorControls>
                <div className={`studifood-block studifood-editable`}>
                    <div class="studifood-editor-block-headline">StudiFood :: FeaturesRecipes - Head Block</div>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6 element-1">
                                <div className="studifood-info">
                                    <h2 className="studifood-FeaturedHeadTitle">
                                        <RichText
                                            placeholder={__("Beliebte Rezepte", "studifood")}
                                            value={FeaturedHeadTitle}
                                            onChange={onChangeFeaturedHeadTitle}
                                        />
                                    </h2>
                                    <div className="studifood-FeaturedHeadText">
                                        <RichText
                                            placeholder={__("Beschreibung der beliebten Rezepte", "studifood")}
                                            onChange={onChangeFeaturedHeadText}
                                            value={FeaturedHeadText}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <div class="col-md-6 element-2">
                            <figure className="studifood-logo">
                                <MediaUpload
                                    onSelect={onImageSelect}
                                    allowedTypes={'image'}
                                    type="image"
                                    value={FeaturedHeadImage}
                                    render={({ open }) => {
                                        return <img
                                            src={FeaturedHeadImage}
                                            onClick={open}
                                        />;
                                    }
                                    }
                                />
                            </figure>
                        </div> */}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    },
    save: props => {
        const {
            attributes: { FeaturedHeadImage, FeaturedHeadText, FeaturedHeadTitle }
        } = props;

        return (
            <section class="widget_featuredrecipeswidget">
                <div class="container">
                    <div class="row">
                        <div class="col-12 offset-xl-1 col-xl-10">
                            <div class="row">
                                <div class="col-12 headline-box" data-aos="fade" >
                                    <div class="headline-box-inner">
                                        <h2 className="studifood-FeaturedHeadTitle" >
                                            <RichText.Content value={FeaturedHeadTitle} />
                                        </h2>
                                        <p className="studifood-FeaturedHeadText">
                                            <RichText.Content value={FeaturedHeadText} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        );
    }
});
