import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import css from './style.module.css';
import { FormattedMessage } from 'react-intl';
import IconClose from '../IconClose/IconClose';

const CustomModal = ({ id = '', isOpen, onClose, children, closeButtonMessage = '' }) => {
  if (!isOpen) return null;

  return ReactDOM
    ? ReactDOM.createPortal(
        <div id={id} className={css['modal-overlay']}>
          <div className={css.modal}>
            <button className={css['close-button']} onClick={onClose}>
              <span className={css.closeText}>
                {closeButtonMessage || <FormattedMessage id="Modal.close" />}
              </span>
              <IconClose rootClassName={css.closeIcon} />
            </button>
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default CustomModal;
