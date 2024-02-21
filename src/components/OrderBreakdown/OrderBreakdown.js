/**
 * This component will show the booking info and calculated total price.
 * I.e. dates and other details related to payment decision in receipt format.
 */
import React from 'react';
import { oneOf, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape, injectIntl } from '../../util/reactIntl';
import {
  propTypes,
  LISTING_UNIT_TYPES,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';

import LineItemBookingPeriod from './LineItemBookingPeriod';
// import LineItemBasePriceMaybe from './LineItemBasePriceMaybe';
// import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
// import LineItemShippingFeeMaybe from './LineItemShippingFeeMaybe';
// import LineItemPickupFeeMaybe from './LineItemPickupFeeMaybe';
// import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
// import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
// import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
// import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
// import LineItemRefundMaybe from './LineItemRefundMaybe';
// import LineItemTotalPrice from './LineItemTotalPrice';
// import LineItemUnknownItemsMaybe from './LineItemUnknownItemsMaybe';

import css from './OrderBreakdown.module.css';
import { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  fetchLineItemsSuccess,
  setAllLineItems,
  setSelectedTimeSlot,
} from '../../containers/ListingPage/ListingPage.duck';
import Decimal from 'decimal.js';

export const OrderBreakdownComponent = props => {
  const {
    rootClassName,
    className,
    userRole,
    transaction,
    booking,
    bookingData,
    intl,
    dateType,
    timeZone,
    currency,
    marketplaceName,
    selectedTimeSlots,
    lineItems,
    saveLineItems,
    lineItemsArray,
    allLineItems = [],
    saveAllLineItems,
    selectedTimeSlot,
    setSelectedTimeSlot,
  } = props;

  let sessionData = [];
  if (window && window.sessionStorage && window.location.href.includes("/checkout")) {
    const checkoutPageData = window.sessionStorage.getItem('CheckoutPage');
    if (checkoutPageData) {
      sessionData = JSON.parse(checkoutPageData);
    }
  }
  const storedData =
    allLineItems?.length > 0
      ? allLineItems
      : sessionData?.orderData?.allLineItem
      ? sessionData?.orderData?.allLineItem
      : booking
      ? [booking]
      : [];
  const [updatedBookings, setUpdatedBookings] = useState(storedData);

  const removeSlot = indexToRemove => {
    // booking.splice(indexToRemove, 1);
    // lineItemsArray.splice(indexToRemove, 1)
    let totalAmount = 0;
    let qty = 0;
    // lineItemsArray.map(item => {
    //   totalAmount =
    //     totalAmount +
    //     item.amount;
    //   qty = Number(qty) + Number(item.quantity);
    // });
    allLineItems.splice(indexToRemove, 1);
    selectedTimeSlot.splice(indexToRemove, 1);
    // lineItems[0].lineTotal.amount = totalAmount;
    // lineItems[0].quantity.d[0] = new Decimal(qty);
    saveAllLineItems(allLineItems);
    // saveLineItems(lineItems);
    setUpdatedBookings([...allLineItems]);
    setSelectedTimeSlot([]);
  };

  // const isCustomer = userRole === 'customer';
  // const isProvider = userRole === 'provider';
  // const lineItems = transaction.attributes.lineItems;
  // const unitLineItem = lineItems?.find(
  //   item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  // );
  // // Line-item code that matches with base unit: day, night, hour, item
  // const lineItemUnitType = unitLineItem?.code;

  // const hasCommissionLineItem = lineItems.find(item => {
  //   const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
  //   const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
  //   return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  // });

  const classes = classNames(rootClassName || css.root, className);

  /**
   * OrderBreakdown contains different line items:
   *
   * LineItemBookingPeriod: prints booking start and booking end types. Prop dateType
   * determines if the date and time or only the date is shown
   *
   * LineItemShippingFeeMaybe: prints the shipping fee (combining additional fee of
   * additional items into it).
   *
   * LineItemShippingFeeRefundMaybe: prints the amount of refunded shipping fee
   *
   * LineItemBasePriceMaybe: prints the base price calculation for the listing, e.g.
   * "$150.00 * 2 nights $300"
   *
   * LineItemUnknownItemsMaybe: prints the line items that are unknown. In ideal case there
   * should not be unknown line items. If you are using custom pricing, you should create
   * new custom line items if you need them.
   *
   * LineItemSubTotalMaybe: prints subtotal of line items before possible
   * commission or refunds
   *
   * LineItemRefundMaybe: prints the amount of refund
   *
   * LineItemCustomerCommissionMaybe: prints the amount of customer commission
   * The default transaction process used by this template doesn't include the customer commission.
   *
   * LineItemCustomerCommissionRefundMaybe: prints the amount of refunded customer commission
   *
   * LineItemProviderCommissionMaybe: prints the amount of provider commission
   *
   * LineItemProviderCommissionRefundMaybe: prints the amount of refunded provider commission
   *
   * LineItemTotalPrice: prints total price of the transaction
   *
   */

  return (
    <div className={classes}>
      {updatedBookings.length > 0 && (
        <LineItemBookingPeriod
          booking={updatedBookings}
          // code={lineItemUnitType}
          dateType={dateType}
          timeZone={timeZone}
          selectedTimeSlots={selectedTimeSlot}
          // lineItems={lineItems}
          intl={intl}
          // isProvider={isProvider}
          userRole={userRole}
          marketplaceCurrency={currency}
          // isCustomer={isCustomer}
          marketplaceName={marketplaceName}
          transaction={transaction}
          updatedBookings={updatedBookings}
          removeSlot={removeSlot}
        />
      )}

      {/* 
      <LineItemBasePriceMaybe lineItems={lineItems} code={lineItemUnitType} intl={intl} />
      <LineItemShippingFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemPickupFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemUnknownItemsMaybe lineItems={lineItems} isProvider={isProvider} intl={intl} />

      <LineItemSubTotalMaybe
        lineItems={lineItems}
        code={lineItemUnitType}
        userRole={userRole}
        intl={intl}
        marketplaceCurrency={currency}
      />
      <LineItemRefundMaybe lineItems={lineItems} intl={intl} marketplaceCurrency={currency} />

      <LineItemCustomerCommissionMaybe
        lineItems={lineItems}
        isCustomer={isCustomer}
        marketplaceName={marketplaceName}
        intl={intl}
      />
      <LineItemCustomerCommissionRefundMaybe
        lineItems={lineItems}
        isCustomer={isCustomer}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      <LineItemProviderCommissionMaybe
        lineItems={lineItems}
        isProvider={isProvider}
        marketplaceName={marketplaceName}
        intl={intl}
      />
      <LineItemProviderCommissionRefundMaybe
        lineItems={lineItems}
        isProvider={isProvider}
        marketplaceName={marketplaceName}
        intl={intl}
      />

      <LineItemTotalPrice
        transaction={transaction}
        isProvider={isProvider}
        intl={intl}
        selectedTimeSlots={selectedTimeSlots} // Pass the selectedTimeSlots prop
      /> */}
    </div>
  );
};

OrderBreakdownComponent.defaultProps = {
  rootClassName: null,
  className: null,
  booking: null,
  dateType: null,
};

OrderBreakdownComponent.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,
  userRole: oneOf(['customer', 'provider']).isRequired,
  transaction: propTypes.transaction.isRequired,
  booking: propTypes.booking,
  dateType: propTypes.dateType,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    lineItems: state.ListingPage.lineItems,
    lineItemsArray: state.ListingPage.lineItemsArray,
    allLineItems: state.ListingPage.allLineItems,
    selectedTimeSlot: state.ListingPage.selectedTimeSlot,
  };
};

const mapDispatchToProps = dispatch => ({
  saveLineItems: params => dispatch(fetchLineItemsSuccess(params)),
  saveAllLineItems: params => dispatch(setAllLineItems(params)),
  setSelectedTimeSlot: params => dispatch(setSelectedTimeSlot(params)),
});

const OrderBreakdown = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(OrderBreakdownComponent);

OrderBreakdown.displayName = 'OrderBreakdown';

export default OrderBreakdown;
