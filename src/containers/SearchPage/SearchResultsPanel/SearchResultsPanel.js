import React from 'react';
import { array, bool, node, object, string } from 'prop-types';
import classNames from 'classnames';

import { propTypes } from '../../../util/types';
import {
  LinkedLogo,
  ListingCard,
  Modal,
  PaginationLinks,
  PrimaryButton,
} from '../../../components';

import css from './SearchResultsPanel.module.css';
import FilterComponent from '../FilterComponent';
import { listingPageEvent } from '../../../util/datalayer-events';

const SearchResultsPanel = props => {
  const {
    className,
    rootClassName,
    listings,
    pagination,
    search,
    setActiveListing,
    isMapVariant,
    therapyTypeFilters,
    onManageDisableScrolling,
    marketplaceCurrency,
    urlQueryParams,
    intl,
    showAsPopup,
    initialValues,
    getHandleChangedValueFn,
  } = props;
  const classes = classNames(rootClassName || css.root, className);

  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const [therapyType, setTherapyType] = React.useState('');
  const filteredURL = typeof window !== 'undefined' && window.location.href.includes('FiltersID');

  React.useEffect(() => {
    if (!filteredURL) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      const checkParams =
        typeof location !== 'undefined' &&
        new URLSearchParams(location.search).get('pub_FiltersID');
      setTherapyType(checkParams);
    }
  }, []);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    if (filteredURL && listings?.length > 0) {
      listingPageEvent(listings, intl);
    }
  }, []);

  const paginationLinks =
    pagination && pagination.totalPages > 1 ? (
      <PaginationLinks
        className={css.pagination}
        pageName="SearchPage"
        pageSearchParams={search}
        pagination={pagination}
      />
    ) : null;

  const cardRenderSizes = isMapVariant => {
    if (isMapVariant) {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 767px) 100vw',
        `(max-width: 1023px) ${panelMediumWidth}vw`,
        `(max-width: 1920px) ${panelLargeWidth / 2}vw`,
        `${panelLargeWidth / 3}vw`,
      ].join(', ');
    } else {
      // Panel width relative to the viewport
      const panelMediumWidth = 50;
      const panelLargeWidth = 62.5;
      return [
        '(max-width: 549px) 100vw',
        '(max-width: 767px) 50vw',
        `(max-width: 1439px) 26vw`,
        `(max-width: 1920px) 18vw`,
        `14vw`,
      ].join(', ');
    }
  };
  return (
    <div className={classes}>
      <Modal
        id="therapyTypeFilters"
        customClassName={'modalFilters'}
        closeButtonClasses={css.closeModalFilters}
        isOpen={isModalOpen}
        onClose={closeModal}
        usePortal
        onManageDisableScrolling={onManageDisableScrolling}
      >
        {therapyTypeFilters.map(config => {
          return (
            <>
              <div className={css.outer_div}>
                <LinkedLogo className={css.logoLink} layout="desktop" alt={''} />
                <div>Find the right therapist for you</div>
              </div>
              <FilterComponent
                key={`TypeSearchFilters.${config.scope || 'built-in'}.${config.key}`}
                idPrefix="TypeSearchFilters"
                className={css.filter}
                config={config}
                marketplaceCurrency={marketplaceCurrency}
                urlQueryParams={urlQueryParams}
                initialValues={initialValues}
                getHandleChangedValueFn={getHandleChangedValueFn}
                intl={intl}
                liveEdit
                showAsPopup={showAsPopup}
                isDesktop
              />
            </>
          );
        })}
      </Modal>
      <div className={isMapVariant ? css.listingCardsMapVariant : css.listingCards}>
        {listings?.map((l, index) => (
          <ListingCard
            className={css.listingCard}
            key={l?.id?.uuid}
            listing={l}
            index={index}
            renderSizes={cardRenderSizes(isMapVariant)}
            setActiveListing={setActiveListing}
            urlQueryParams={therapyType}
          />
        ))}
        {props.children}
      </div>
      {paginationLinks}
    </div>
  );
};

SearchResultsPanel.defaultProps = {
  children: null,
  className: null,
  listings: [],
  pagination: null,
  rootClassName: null,
  search: null,
  isMapVariant: true,
};

SearchResultsPanel.propTypes = {
  children: node,
  className: string,
  listings: array,
  pagination: propTypes.pagination,
  rootClassName: string,
  search: object,
  isMapVariant: bool,
};

export default SearchResultsPanel;
