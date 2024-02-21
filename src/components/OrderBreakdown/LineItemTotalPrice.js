import React from 'react';
import { bool } from 'prop-types';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { formatMoney } from '../../util/currency';
import { propTypes } from '../../util/types';
import { resolveLatestProcessName, getProcess } from '../../transactions/transaction';
const { types } = require('sharetribe-flex-sdk');
import css from './OrderBreakdown.module.css';

const LineItemTotalPrice = props => {
  const { Money } = types;
  const { transaction, isProvider, intl, updatedBookings } = props;
  const processName = resolveLatestProcessName(transaction?.attributes?.processName);
  if (!processName) {
    return null;
  }
  const process = getProcess(processName);
  const isCompleted = process.isCompleted(transaction?.attributes?.lastTransition);
  const isRefunded = process.isRefunded(transaction?.attributes?.lastTransition);

  let providerTotalMessageId = 'OrderBreakdown.providerTotalDefault';
  if (isCompleted) {
    providerTotalMessageId = 'OrderBreakdown.providerTotalReceived';
  } else if (isRefunded) {
    providerTotalMessageId = 'OrderBreakdown.providerTotalRefunded';
  }

  const totalLabel = isProvider ? (
    <FormattedMessage id={providerTotalMessageId} />
  ) : (
    <FormattedMessage id="OrderBreakdown.total" />
  );

  let totalPrices = transaction.attributes.payinTotal;
  const totalPrice = transaction?.attributes?.lineItems?.[0]?.lineTotal?.totalAmount;
  if (isProvider && totalPrices?.amount > 0) {
    totalPrices = new Money(totalPrices?.amount - 2500, totalPrices?.currency);
  }
  const formattedTotalPrice = formatMoney(intl, totalPrice);
  const formattedTotalPrices = formatMoney(intl, totalPrices);

  let totalAmount = 0;
  updatedBookings?.map(item => {
    totalAmount = totalAmount + item?.amount;
  });

  totalAmount =
    totalAmount &&
    formatMoney(intl, new Money(totalAmount, updatedBookings?.[0]?.[0]?.unitPrice?.currency));
  let totalValue = '$0.00';

  if (formattedTotalPrice != '$0.00') {
    totalValue = formattedTotalPrice;
  } else if (formattedTotalPrices != '$0.00') {
    totalValue = formattedTotalPrices;
  }

  return (
    <>
      <hr className={css.totalDivider} />
      <div className={css.lineItemTotal}>
        <div className={css.totalLabel}>{totalLabel}</div>
        <div className={css.totalPrice}>{totalAmount || formattedTotalPrices}</div>
      </div>
    </>
  );
};

LineItemTotalPrice.propTypes = {
  transaction: propTypes.transaction.isRequired,
  isProvider: bool.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemTotalPrice;
