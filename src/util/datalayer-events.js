import Decimal from 'decimal.js';
import { convertMoneyToNumber, formatMoney } from './currency';
const { types } = require('sharetribe-flex-sdk');

export const listingPageEvent = (items, intl) => {
  const { Money } = types;
  const _items =
    items &&
    items?.length > 0 &&
    items?.map((item, index) => {
      const { attributes = {}, id, type, author } = item;
      const itemObj = {
        item_name: author?.attributes?.profile?.displayName,
        item_id: id?.uuid,
        price: convertMoneyToNumber(attributes?.price),
        item_brand: 'Therapy is Brown',
        item_category: attributes?.title,
        item_list_name: attributes?.title,
        index: index,
        quantity: '1',
      };
      return itemObj;
    });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: 'view_item_list',
    ecommerce: {
      items: _items,
    },
  });
};

export const productDetailEvent = (eventName, orderData, product, intl) => {
  const { Money } = types;
  let qtyTotal = 0;
  const { attributes = {}, id, type, author } = product;
  orderData?.length > 0 &&
    orderData?.map(item => {
      qtyTotal = qtyTotal + item?.quantity;
    });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: eventName,
    ecommerce: {
      items: [
        {
          item_name: author?.attributes?.profile?.displayName,
          item_id: id?.uuid,
          price: convertMoneyToNumber(attributes?.price),
          item_brand: 'Therapy is Brown',
          item_category: attributes?.title,
          quantity: qtyTotal || '1',
        },
      ],
    },
  });
};

export const addToCartEvent = (eventName, orderData, listing, intl) => {
  const { Money } = types;
  const items = orderData?.map(lineItem => {
    const itemObj = {
      item_id: listing?.id?.uuid,
      item_name: listing?.author?.attributes?.profile?.displayName,
      item_type: listing?.attributes?.publicData?.unitType,
      price: convertMoneyToNumber(listing?.attributes?.price),
      quantity: lineItem?.quantity,
      item_category: listing?.attributes?.title,
      startDate: lineItem?.attributes?.start,
      endDate: lineItem?.attributes?.end,
    };
    return itemObj;
  });

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: eventName,
    ecommerce: {
      items: items,
    },
  });
};

export const beginCheckoutEvent = (orderData, listing, intl) => {
  const { Money } = types;
  const totalAmount = orderData?.allLineItem?.reduce(
    (sum, lineItem) => sum + (lineItem?.amount || 0),
    0
  );

  const items = orderData?.allLineItem?.map(lineItem => {
    const itemObj = {
      item_id: listing?.id?.uuid,
      item_name: listing?.author?.attributes?.profile?.displayName,
      item_type: listing?.attributes?.publicData?.unitType,
      price: convertMoneyToNumber(listing?.attributes?.price),
      quantity: lineItem?.quantity,
      item_category: listing?.attributes?.title,
      startDate: lineItem?.attributes?.start,
      endDate: lineItem?.attributes?.end,
    };

    return itemObj;
  });

  window.dataLayer = window?.dataLayer || [];
  window.dataLayer?.push({
    event: 'begin_checkout',
    userId: listing?.author?.id?.uuid,
    ecommerce: {
      items: items,
    },
  });
};

export const loginSignUpEvent = (eventName, userId, userIdkey) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    [userIdkey]: userId,
    ...(eventName === 'login' && { method: 'Email' }),
  });
};

export const purchaseEvent = (currentUser, transaction, allLineItems, intl) => {
  const { Money } = types;
  let items = [];
  let totalAmount = 0;
  allLineItems?.forEach(lineItem => {
    const itemPrice = new Money(lineItem?.amount, allLineItems?.[0]?.[0]?.unitPrice?.currency);
    items?.push({
      item_id: transaction.listing?.id?.uuid,
      item_name: transaction?.listing?.author?.attributes?.profile?.displayName,
      item_type: transaction.attributes.lineItems[0].code.split('/')[1],
      price: convertMoneyToNumber(itemPrice),
      quantity: lineItem?.quantity,
      item_category: transaction?.listing?.attributes?.title,
      startDate: lineItem?.attributes?.start,
      endDate: lineItem?.attributes?.end,
    });
  });
  allLineItems?.map(item => {
    totalAmount = totalAmount + item?.amount;
  });

  const totalValue = new Money(totalAmount, allLineItems?.[0]?.[0]?.unitPrice?.currency);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    userId: currentUser?.id?.uuid,
    ecommerce: {
      currency: transaction?.listing?.attributes?.price?.currency,
      value: convertMoneyToNumber(totalValue),
      transaction_id: transaction?.id?.uuid,
      items: items,
    },
  });
};
