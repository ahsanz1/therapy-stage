import React, { Component } from 'react';
import { array, bool, func, number, object, string } from 'prop-types';
import { compose } from 'redux';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, intlShape, injectIntl, useIntl } from '../../../util/reactIntl';
import { timestampToDate } from '../../../util/dates';
import { propTypes } from '../../../util/types';
import { BOOKING_PROCESS_NAME } from '../../../transactions/transaction';

import { Form, H6, PrimaryButton } from '../../../components';

import EstimatedCustomerBreakdownMaybe from '../EstimatedCustomerBreakdownMaybe';
import FieldDateAndTimeInput from './FieldDateAndTimeInput';

import css from './BookingTimeForm.module.css';
import { isEqual } from 'lodash';
import { connect } from 'react-redux';
import { setSelectedTimeSlot } from '../../../containers/ListingPage/ListingPage.duck';
import { addToCartEvent, productDetailEvent } from '../../../util/datalayer-events';

export class BookingTimeFormComponent extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);

    // Initialize state to keep track of selected time slots
    this.state = {
      selectedTimeSlots: [],
      setValues: [],
      prevSetValues: [],
    };
  }

  componentWillUnmount() {
    this.setState({
      selectedTimeSlots: [],
      setValues: [],
      prevSetValues: [],
    });
  }
  handleFormSubmit(e) {
    const { selectedTimeSlots } = this.state;
    const obj = {
      ...e,
      selectedTimeSlots: selectedTimeSlots,
      allLineItem: this.props.allLineItems,
    };

    addToCartEvent(
      'add_to_cart',
      this.props.allLineItems,
      this.props.currentlisting,
      this.props.intl
    );

    this.props.onSubmit(obj);
   
  }

  // When the values of the form are updated we need to fetch
  // lineItems from this template's backend for the EstimatedTransactionMaybe
  // In case you add more fields to the form, make sure you add
  // the values here to the orderData object.
  handleOnChange(formValues) {
    const { bookingStartTime, bookingEndTime } = formValues.values;

    const startDate = bookingStartTime ? timestampToDate(bookingStartTime) : null;
    const endDate = bookingEndTime ? timestampToDate(bookingEndTime) : null;

    const listingId = this.props.listingId;
    const isOwnListing = this.props.isOwnListing;

    // Note: we expect values bookingStartTime and bookingEndTime to be strings
    // which is the default case when the value has been selected through the form
    const isStartBeforeEnd = bookingStartTime < bookingEndTime;

    if (
      bookingStartTime &&
      bookingEndTime &&
      isStartBeforeEnd &&
      !this.props.fetchLineItemsInProgress
    ) {
      this.props.onFetchTransactionLineItems({
        orderData: { bookingStart: startDate, bookingEnd: endDate },
        listingId,
        isOwnListing,
      });

      // Update the selected time slots in the component state
      this.props.setSelectedTimeSlot([{ startDate, endDate, bookingStartTime, bookingEndTime }]);

      this.setState(prevState => ({
        selectedTimeSlots: [
          ...prevState.selectedTimeSlots,
          { startDate, endDate, bookingStartTime, bookingEndTime },
        ],
      }));
    }
    productDetailEvent(
      'timeslot_added',
      this.props.allLineItems,
      this.props.currentlisting,
      this.props.intl
    );
  }

  render() {
    const {
      rootClassName,
      className,
      price: unitPrice,
      dayCountAvailableForBooking,
      marketplaceName,
      currentlisting,
      ...rest
    } = this.props;
    const classes = classNames(rootClassName || css.root, className);
    const { selectedTimeSlots, setValues } = this.state;

    const isStartTimeChanged =
      setValues.bookingStartTime !== this.state.prevSetValues.bookingStartTime;
    const isEndTimeChanged = setValues.bookingEndTime !== this.state.prevSetValues.bookingEndTime;

    const isSameValues = isStartTimeChanged || isEndTimeChanged;
    return (
      <FinalForm
        {...rest}
        unitPrice={unitPrice}
        onSubmit={this.handleFormSubmit}
        render={fieldRenderProps => {
          var {
            endDatePlaceholder,
            startDatePlaceholder,
            form,
            pristine,
            handleSubmit,
            intl,
            isOwnListing,
            listingId,
            values,
            monthlyTimeSlots,
            onFetchTimeSlots,
            timeZone,
            lineItems,
            fetchLineItemsInProgress,
            fetchLineItemsError,
          } = fieldRenderProps;
          timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          const startTime = values && values.bookingStartTime ? values.bookingStartTime : null;
          const endTime = values && values.bookingEndTime ? values.bookingEndTime : null;
          const startDate = startTime ? timestampToDate(startTime) : null;
          const endDate = endTime ? timestampToDate(endTime) : null;

          // This is the place to collect breakdown estimation data. See the
          // EstimatedCustomerBreakdownMaybe component to change the calculations
          // for customized payment processes.
          const breakdownData =
            startDate && endDate
              ? {
                  startDate,
                  endDate,
                }
              : null;

          const showEstimatedBreakdown =
            breakdownData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;
          return (
            <Form onSubmit={handleSubmit} className={classes} enforcePagePreloadFor="CheckoutPage">
              <FormSpy
                subscription={{ values: true }}
                onChange={values => {
                  this.setState({ setValues: values });
                  // this.handleOnChange(values);
                }}
              />
              {monthlyTimeSlots && timeZone ? (
                <FieldDateAndTimeInput
                  startDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingStartTitle' }),
                    placeholderText: startDatePlaceholder,
                  }}
                  endDateInputProps={{
                    label: intl.formatMessage({ id: 'BookingTimeForm.bookingEndTitle' }),
                    placeholderText: endDatePlaceholder,
                  }}
                  className={css.bookingDates}
                  listingId={listingId}
                  onFetchTimeSlots={onFetchTimeSlots}
                  monthlyTimeSlots={monthlyTimeSlots}
                  values={values}
                  intl={intl}
                  form={form}
                  pristine={pristine}
                  timeZone={timeZone}
                  dayCountAvailableForBooking={dayCountAvailableForBooking}
                />
              ) : null}
              <div className={css.submitButton}>
                <PrimaryButton
                  type="button"
                  inProgress={fetchLineItemsInProgress}
                  disabled={isSameValues}
                  onClick={() => {
                    this.setState({ prevSetValues: setValues });
                    this.handleOnChange(setValues);
                    console.log('breakdownData', lineItems);
                  }}
                >
                  Add Time Slot
                </PrimaryButton>
              </div>
              {showEstimatedBreakdown ? (
                <div className={css.priceBreakdownContainer}>
                  <H6 as="h3" className={css.bookingBreakdownTitle}>
                    <FormattedMessage id="BookingTimeForm.priceBreakdownTitle" />
                  </H6>
                  <hr className={css.totalDivider} />
                  <EstimatedCustomerBreakdownMaybe
                    breakdownData={breakdownData}
                    lineItems={lineItems}
                    timeZone={timeZone}
                    currency={unitPrice.currency}
                    marketplaceName={marketplaceName}
                    processName={BOOKING_PROCESS_NAME}
                    selectedTimeSlots={this.props.selectedTimeSlot}
                  />
                </div>
              ) : null}

              {fetchLineItemsError ? (
                <span className={css.sideBarError}>
                  <FormattedMessage id="BookingTimeForm.fetchLineItemsError" />
                </span>
              ) : null}
              {this.props.allLineItems?.length > 0 && (
                <div className={css.submitButton}>
                  <PrimaryButton type="submit">
                    <FormattedMessage id="BookingTimeForm.requestToBook" />
                  </PrimaryButton>
                </div>
              )}

              <p className={css.finePrint}>
                <FormattedMessage
                  id={
                    isOwnListing
                      ? 'BookingTimeForm.ownListing'
                      : 'BookingTimeForm.youWontBeChargedInfo'
                  }
                />
              </p>
            </Form>
          );
        }}
      />
    );
  }
}

BookingTimeFormComponent.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  isOwnListing: false,
  listingId: null,
  startDatePlaceholder: null,
  endDatePlaceholder: null,
  monthlyTimeSlots: null,
  lineItems: null,
  fetchLineItemsError: null,
};

BookingTimeFormComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  price: propTypes.money,
  isOwnListing: bool,
  listingId: propTypes.uuid,
  monthlyTimeSlots: object,
  onFetchTimeSlots: func.isRequired,
  timeZone: string.isRequired,

  onFetchTransactionLineItems: func.isRequired,
  lineItems: array,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,

  // for tests
  startDatePlaceholder: string,
  endDatePlaceholder: string,

  dayCountAvailableForBooking: number.isRequired,
};

const mapStateToProps = state => {
  return {
    lineItems: state.ListingPage.lineItems,
    lineItemsArray: state.ListingPage.lineItemsArray,
    selectedTimeSlot: state.ListingPage.selectedTimeSlot,
    allLineItems: state.ListingPage.allLineItems,
  };
};

const mapDispatchToProps = dispatch => ({
  saveLineItems: params => dispatch(fetchLineItemsSuccess(params)),
  saveAllLineItems: params => dispatch(setAllLineItems(params)),
  setSelectedTimeSlot: params => dispatch(setSelectedTimeSlot(params)),
});

const BookingTimeForm = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(BookingTimeFormComponent);

BookingTimeForm.displayName = 'BookingTimeForm';

export default BookingTimeForm;
