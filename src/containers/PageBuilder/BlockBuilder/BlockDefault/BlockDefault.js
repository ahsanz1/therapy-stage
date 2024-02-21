import React from 'react';
import { func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockContainer from '../BlockContainer';

import css from './BlockDefault.module.css';

const FieldMedia = props => {
  const { className, media, sizes, options } = props;
  const hasMediaField = hasDataInFields([media], options);
  return hasMediaField ? (
    <div className={classNames(className, css.media)}>
      <Field data={media} sizes={sizes} options={options} />
    </div>
  ) : null;
};

const BlockDefault = props => {
  const {
    blockId,
    className,
    rootClassName,
    mediaClassName,
    textClassName,
    ctaButtonClass,
    title,
    text,
    callToAction,
    media,
    responsiveImageSizes,
    options,
    mainSectionClassName,
  } = props;
  const classes = classNames(rootClassName || css.root, className);
  const hasTextComponentFields = hasDataInFields([title, text, callToAction], options);

  return (
    <BlockContainer id={blockId} className={`${classes} ${mainSectionClassName}`}>
      <div className={css.inner_block}>
        {/* <div className={css.block_background}> </div> */}
        <div className={css.booking_btn}>
          {hasTextComponentFields ? (
            <Field data={callToAction} className={ctaButtonClass} options={options} />
          ) : null}
        </div>
        <FieldMedia
          media={media}
          sizes={responsiveImageSizes}
          className={mediaClassName}
          options={options}
        />
        {hasTextComponentFields ? (
          <div
            className={classNames(
              textClassName,
              mainSectionClassName === 'section-4' ? css.card_text : css.text
            )}
          >
            {mainSectionClassName === 'section-4' ? (
              <>
                <Field className={css.name} data={text} options={options} />
                <Field data={title} options={options} />
              </>
            ) : (
              <>
                <Field data={title} options={options} />
                <Field className={css.name} data={text} options={options} />
              </>
            )}
          </div>
        ) : null}
      </div>
    </BlockContainer>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

BlockDefault.defaultProps = {
  className: null,
  rootClassName: null,
  mediaClassName: null,
  textClassName: null,
  ctaButtonClass: null,
  title: null,
  text: null,
  callToAction: null,
  media: null,
  responsiveImageSizes: null,
  options: null,
};

BlockDefault.propTypes = {
  blockId: string.isRequired,
  className: string,
  rootClassName: string,
  mediaClassName: string,
  textClassName: string,
  ctaButtonClass: string,
  title: object,
  text: object,
  callToAction: object,
  media: object,
  responsiveImageSizes: string,
  options: propTypeOption,
};

export default BlockDefault;
