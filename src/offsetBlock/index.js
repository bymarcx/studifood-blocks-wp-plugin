const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks, useBlockProps } = wp.blockEditor;

console.info(wp.blockEditor);

import { ReactComponent as Logo } from "../img/sf-logo.svg";
import logoWhiteURL from "../img/sf-logo-white.svg";
import placeholder from "../img/1920x1080.png";

registerBlockType("studifood/offsetblock", {
  title: __("Offset Block", "studifood"),
  icon: { src: Logo },
  category: "studifood",
  attributes: {
  },
  edit: () => {
    const blockProps = useBlockProps();

    return (
      <div className={`studifood-block studifood-editable`}>
        <div class="studifood-editor-block-headline">StudiFood :: Offset Block</div>
        <div class="container-1"></div>
        <div {...blockProps}>
          <InnerBlocks />
        </div>
      </div>
    );
  },

  save: () => {
    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps}>
        <div class="container">
          <div class="row">
            <div class="col-10 offset-1">
              <InnerBlocks.Content />
            </div>
          </div>
        </div>
      </div>
    );
  },
});
