import React, { useState } from 'react';
import { FormattedMessage, FormattedDate } from '../../util/reactIntl';
import {
  LINE_ITEM_NIGHT,
  DATE_TYPE_DATE,
  LINE_ITEM_HOUR,
  propTypes,
  LISTING_UNIT_TYPES,
  LINE_ITEM_CUSTOMER_COMMISSION,
  LINE_ITEM_PROVIDER_COMMISSION,
} from '../../util/types';
import { subtractTime } from '../../util/dates';

import css from './OrderBreakdown.module.css';
import LineItemTotalPrice from './LineItemTotalPrice';
import LineItemProviderCommissionRefundMaybe from './LineItemProviderCommissionRefundMaybe';
import LineItemProviderCommissionMaybe from './LineItemProviderCommissionMaybe';
import LineItemSubTotalMaybe from './LineItemSubTotalMaybe';
import LineItemUnknownItemsMaybe from './LineItemUnknownItemsMaybe';
import LineItemPickupFeeMaybe from './LineItemPickupFeeMaybe';
import LineItemShippingFeeMaybe from './LineItemShippingFeeMaybe';
import LineItemBasePriceMaybe from './LineItemBasePriceMaybe';
import LineItemRefundMaybe from './LineItemRefundMaybe';
import LineItemCustomerCommissionMaybe from './LineItemCustomerCommissionMaybe';
import LineItemCustomerCommissionRefundMaybe from './LineItemCustomerCommissionRefundMaybe';
import { formatMoney } from '../../util/currency';
import Button from '../Button/Button';
import IconClose from '../IconClose/IconClose';

const BookingPeriod = props => {
  const { startDate, endDate, dateType, timeZone, removeSlot, listIndex } = props;
  const timeZoneMaybe = timeZone
    ? { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }
    : null;
  const timeFormatOptions =
    dateType === DATE_TYPE_DATE
      ? {
          weekday: 'long',
        }
      : {
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        };

  const dateFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSectionLeft}>
          {/* <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingStart" />
          </div> */}
          <div className={css.dayInfo}>
            <FormattedDate
              value={startDate}
              {...timeFormatOptions}
              {...dateFormatOptions}
              {...timeZoneMaybe}
            />
          </div>
          {/* <div className={css.itemLabel}>
            <FormattedDate value={startDate} {...dateFormatOptions} {...timeZoneMaybe} />
          </div> */}
        </div>

        <div className={css.bookingPeriodSectionRight}>
          {/* <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingEnd" />
          </div> */}
          <div className={css.dayInfo}>
            <FormattedDate
              value={endDate}
              {...timeFormatOptions}
              {...dateFormatOptions}
              {...timeZoneMaybe}
            />
            <button className={css.removeSlot} type="button" onClick={() => removeSlot(listIndex)}>
              <IconClose rootClassName={css.closeIcon} size="small" />
            </button>
          </div>
          {/* <div className={css.itemLabel}>
            <FormattedDate value={endDate} {...dateFormatOptions} {...timeZoneMaybe} />
          </div> */}
        </div>
      </div>
    </>
  );
};

const LineItemBookingPeriod = props => {
  const {
    booking,
    dateType,
    timeZone,
    selectedTimeSlots,
    // lineItems,
    intl,
    // isProvider,
    userRole,
    marketplaceCurrency,
    // isCustomer,
    marketplaceName,
    transaction,
    updatedBookings,
    removeSlot,
  } = props;
  const isCustomer = userRole === 'customer';
  const isProvider = userRole === 'provider';
  const lineItems = transaction.attributes.lineItems;
  const unitLineItem = lineItems?.find(
    item => LISTING_UNIT_TYPES.includes(item.code) && !item.reversal
  );
  // Line-item code that matches with base unit: day, night, hour, item
  const lineItemUnitType = unitLineItem?.code;

  const hasCommissionLineItem = lineItems.find(item => {
    const hasCustomerCommission = isCustomer && item.code === LINE_ITEM_CUSTOMER_COMMISSION;
    const hasProviderCommission = isProvider && item.code === LINE_ITEM_PROVIDER_COMMISSION;
    return (hasCustomerCommission || hasProviderCommission) && !item.reversal;
  });

  // const classes = classNames(rootClassName || css.root, className);

  if (!booking) {
    return null;
  }
  // Attributes: displayStart and displayEnd can be used to differentiate shown time range
  // from actual start and end times used for availability reservation. It can help in situations
  // where there are preparation time needed between bookings.
  // Read more: https://www.sharetribe.com/api-reference/marketplace.html#bookings
  let quantityArr = [];
  let totalAmount = [];
  return (
    <>
      <div className={css.bookingPeriod}>
        <div className={css.bookingPeriodSectionLeft}>
          <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingStart" />
          </div>
        </div>
        <div className={css.bookingPeriodSectionRight}>
          <div className={css.dayLabel}>
            <FormattedMessage id="OrderBreakdown.bookingEnd" />
          </div>
        </div>
      </div>

      {updatedBookings.map((data, index) => {
        const { start, end, displayStart, displayEnd } = data.attributes;
        const localStartDate = displayStart || start;
        const localEndDateRaw = displayEnd || end;
        const isNightly = lineItemUnitType === LINE_ITEM_NIGHT;
        const isHour = lineItemUnitType === LINE_ITEM_HOUR;
        const endDay =
          isNightly || isHour ? localEndDateRaw : subtractTime(localEndDateRaw, 1, 'days');

        return (
          <>
            <div className={`${css.lineItem} ${css.lineItem_slot}`}>
              <BookingPeriod
                key={index}
                startDate={localStartDate}
                endDate={endDay}
                dateType={dateType}
                timeZone={timeZone}
                removeSlot={removeSlot}
                listIndex={index}
              />
            </div>
          </>
        );
      })}
      {/* <hr className={css.totalDivider} /> */}
      <LineItemBasePriceMaybe
        lineItems={lineItems}
        code={lineItemUnitType}
        intl={intl}
        totalQty={quantityArr}
        totalAmount={totalAmount}
      />
      <LineItemShippingFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemPickupFeeMaybe lineItems={lineItems} intl={intl} />
      <LineItemUnknownItemsMaybe lineItems={lineItems} isProvider={isProvider} intl={intl} />
      <LineItemSubTotalMaybe
        lineItems={lineItems}
        code={lineItemUnitType}
        userRole={userRole}
        intl={intl}
        marketplaceCurrency={marketplaceCurrency}
        totalAmount={totalAmount}
      />
      <LineItemRefundMaybe
        lineItems={lineItems}
        intl={intl}
        marketplaceCurrency={marketplaceCurrency}
      />
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
        totalAmount={totalAmount}
        updatedBookings={updatedBookings}
      />
      {hasCommissionLineItem ? (
        <span className={css.feeInfo}>
          <FormattedMessage id="OrderBreakdown.commissionFeeNote" />
        </span>
      ) : null}
    </>
  );
};
LineItemBookingPeriod.defaultProps = { booking: {}, dateType: null };

LineItemBookingPeriod.propTypes = {
  booking: propTypes.booking,
  dateType: propTypes.dateType,
};

export default LineItemBookingPeriod;
