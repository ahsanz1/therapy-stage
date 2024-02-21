import React from 'react';
import Decimal from 'decimal.js';

import { types as sdkTypes } from '../../util/sdkLoader';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import {
  DATE_TYPE_DATE,
  LINE_ITEM_DAY,
  LINE_ITEM_NIGHT,
  LINE_ITEM_HOUR,
  LISTING_UNIT_TYPES,
  DATE_TYPE_DATETIME,
} from '../../util/types';
import { unitDivisor, convertMoneyToNumber, convertUnitToSubUnit } from '../../util/currency';
import { getProcess, TX_TRANSITION_ACTOR_CUSTOMER } from '../../transactions/transaction';

import { OrderBreakdown } from '../../components';

import css from './OrderPanel.module.css';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { setAllLineItems } from '../../containers/ListingPage/ListingPage.duck';

const { Money, UUID } = sdkTypes;

const estimatedTotalPrice = (lineItems, marketplaceCurrency) => {
  const numericTotalPrice = lineItems.reduce((sum, lineItem) => {
    const numericPrice = convertMoneyToNumber(lineItem.lineTotal);
    return new Decimal(numericPrice).add(sum);
  }, new Decimal(0));

  const currency =
    lineItems[0] && lineItems[0].unitPrice ? lineItems[0].unitPrice.currency : marketplaceCurrency;

  return new Money(
    convertUnitToSubUnit(numericTotalPrice.toNumber(), unitDivisor(currency)),
    currency
  );
};

let bookingsArray = [];

const estimatedBooking = (
  bookingStart,
  bookingEnd,
  lineItemUnitType,
  timeZone = 'Etc/UTC',
  allLineItems,
  lineItems,
  saveAllLineItems
) => {
  const duration = { start: bookingStart, end: bookingEnd };

  if(!bookingEnd || !bookingStart) return

  const newBooking = {
    id: new UUID('estimated-booking'),
    type: 'booking',
    ...lineItems,
    attributes: {
      ...duration,
    },
  };
  const filteredArray =
    allLineItems?.length > 0
      ? allLineItems.find(booking => {
          return (
            booking.attributes.start === duration.start && booking.attributes.end === duration.end
          );
        })
      : null;
  if (!filteredArray) {
    bookingsArray = [
      ...allLineItems,
      {
        ...newBooking,
        amount: lineItems[0].lineTotal.amount,
        quantity: lineItems[0].quantity.d[0],
      },
    ];
    saveAllLineItems([
      ...allLineItems,
      {
        ...newBooking,
        amount: lineItems[0].lineTotal.amount,
        quantity: lineItems[0].quantity.d[0],
      },
    ]);
  }

  // Log the array and other relevant information
  return bookingsArray;
};

const estimatedCustomerTransaction = (
  lineItems,
  bookingStart,
  bookingEnd,
  lineItemUnitType,
  timeZone,
  process,
  processName,
  marketplaceCurrency,
  allLineItems,
  saveAllLineItems
) => {
  const transitions = process?.transitions;
  const now = new Date();
  const customerLineItems = lineItems.filter(item => item.includeFor.includes('customer'));
  const providerLineItems = lineItems.filter(item => item.includeFor.includes('provider'));
  const payinTotal = estimatedTotalPrice(customerLineItems, marketplaceCurrency);
  const payoutTotal = estimatedTotalPrice(providerLineItems, marketplaceCurrency);
  const bookingMaybe = {
    booking: estimatedBooking(
      bookingStart,
      bookingEnd,
      lineItemUnitType,
      timeZone,
      allLineItems,
      lineItems,
      saveAllLineItems
    ),
  };

  return {
    id: new UUID('estimated-transaction'),
    type: 'transaction',
    attributes: {
      createdAt: now,
      processName,
      lastTransitionedAt: now,
      lastTransition: transitions.REQUEST_PAYMENT,
      payinTotal,
      payoutTotal,
      lineItems: customerLineItems,
      transitions: [
        {
          createdAt: now,
          by: TX_TRANSITION_ACTOR_CUSTOMER,
          transition: transitions.REQUEST_PAYMENT,
        },
      ],
    },
    ...bookingMaybe,
  };
};

const EstimatedCustomerBreakdownMaybe = props => {
  const {
    breakdownData = {},
    lineItems,
    timeZone,
    currency,
    marketplaceName,
    processName,
    selectedTimeSlots, // Add this prop
    lineItemsArray,
    allLineItems,
    saveAllLineItems,
    selectedTimeSlot,
  } = props;
  let process = null;

  try {
    process = getProcess(processName);
  } catch (e) {
    return (
      <div className={css.error}>
        <FormattedMessage id="OrderPanel.unknownTransactionProcess" />
      </div>
    );
  }

  const unitLineItems = lineItems?.filter(
    item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  );
  // Assuming you need to estimate breakdown for each selected time slot

  const uniqueTimeSlots = Array.from(
    new Set(selectedTimeSlot.map(timeSlot => JSON.stringify(timeSlot)))
  ).map(timeSlot => JSON.parse(timeSlot));

  const breakdowns = uniqueTimeSlots.map((timeSlot, index) => {
    const { startDate, endDate } = timeSlot;
    const unitLineItem = lineItems?.find(
      item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
    );
    const lineItemUnitType = unitLineItem?.code;
    const shouldHaveBooking = [LINE_ITEM_DAY, LINE_ITEM_NIGHT].includes(lineItemUnitType);
    const hasLineItems = lineItems && lineItems.length > 0;
    const hasRequiredBookingData = !shouldHaveBooking || (startDate && endDate);
    const dateType = lineItemUnitType === LINE_ITEM_HOUR ? DATE_TYPE_DATETIME : DATE_TYPE_DATE;
    return { dateType, lineItemUnitType, startDate, endDate, hasLineItems, hasRequiredBookingData };
  });

  const tx = estimatedCustomerTransaction(
    lineItems,
    breakdowns?.[0]?.startDate,
    breakdowns?.[0]?.endDate,
    breakdowns?.[0]?.lineItemUnitType,
    timeZone,
    process,
    processName,
    currency,
    allLineItems,
    saveAllLineItems
  );
  
  return tx ? (
    <div>
      <OrderBreakdown
        key={`${breakdowns?.[0]?.startDate}_${breakdowns?.[0]?.endDate}`} // Add a unique key for each breakdown
        className={css.receipt}
        userRole="customer"
        transaction={tx}
        booking={tx.booking}
        dateType={breakdowns?.[0]?.dateType}
        timeZone={timeZone}
        currency={currency}
        marketplaceName={marketplaceName}
      />
    </div>
  ) : null;

  // return <div>{breakdowns}</div>;
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
  saveAllLineItems: params => dispatch(setAllLineItems(params)),
});

const EstimatedCustomerBreakdown = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  injectIntl
)(EstimatedCustomerBreakdownMaybe);

export default EstimatedCustomerBreakdown;
