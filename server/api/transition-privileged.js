const { transactionLineItems } = require('../api-util/lineItems');
const {
  getSdk,
  getTrustedSdk,
  handleError,
  serialize,
  fetchCommission,
} = require('../api-util/sdk');

module.exports = (req, res) => {
  const { isSpeculative, orderData, bodyParams, queryParams } = req.body;

  const sdk = getSdk(req, res);
  let lineItems = null;

  const listingPromise = () => sdk.listings.show({ id: bodyParams?.params?.listingId });

  Promise.all([listingPromise(), fetchCommission(sdk)])
    .then(([showListingResponse, fetchAssetsResponse]) => {
      const listing = showListingResponse.data.data;
      const commissionAsset = fetchAssetsResponse.data.data[0];
      const providerCommission =
        commissionAsset?.type === 'jsonAsset'
          ? commissionAsset.attributes.data.providerCommission
          : null;
      lineItems = transactionLineItems(
        listing,
        { ...orderData, ...bodyParams.params },
        providerCommission
      );

      return getTrustedSdk(req);
    })
    .then(trustedSdk => {
      // Omit listingId from params (transition/request-payment-after-inquiry does not need it)
      const { listingId, ...restParams } = bodyParams?.params || {};

      // Add lineItems to the body params
      const body = {
        ...bodyParams,
        params: {
          ...restParams,
          lineItems,
          metadata: { start: 'asdas' },
        },
      };

      if (isSpeculative) {
        return trustedSdk.transactions.transitionSpeculative(body, queryParams);
      }
      return trustedSdk.transactions.transition(body, queryParams);
    })
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};

// module.exports = (req, res) => {
//   const { isSpeculative, orderData, bodyParams, queryParams } = req.body;
//   const sdk = getSdk(req, res);
//   let lineItems = null;
//   const listingPromise = () => sdk.listings.show({ id: bodyParams?.params?.listingId });
//   let multiSlotsData = [];
//   Promise.all([listingPromise(), fetchCommission(sdk)])
//     .then(([showListingResponse, fetchAssetsResponse]) => {
//       const listing = showListingResponse.data.data;
//       const commissionAsset = fetchAssetsResponse.data.data[0];
//       const providerCommission =
//         commissionAsset?.type === 'jsonAsset'
//           ? commissionAsset.attributes.data.providerCommission
//           : null;
//       lineItems = transactionLineItems(
//         listing,
//         { ...orderData, ...bodyParams.params },
//         providerCommission
//       );

//       return getTrustedSdk(req);
//     })
//     .then(trustedSdk => {
//       const { params } = bodyParams;
//       const { allLineItem } = params;
//       // const { multiBookings } = params;

//       const objectWithoutAllLineItem = Object.fromEntries(
//         Object.entries(params).filter(([key]) => key !== 'allLineItem')
//       );

//       for (let index = 0; index < allLineItem.length; index++) {
//         const element = allLineItem[index];

//         const newObj = {
//           one: {
//             code: element?.['0'].code,
//             unitPrice: {
//               _sdkType: element?.['0'].unitPrice?._sdkType,
//               amount: element?.['0'].unitPrice?.amount,
//               currency: element?.['0'].unitPrice?.currency,
//             },
//             quantity: element?.['0'].quantity,
//             includeFor: ['customer', 'provider'],
//           },
//           two: {
//             code: element?.['1'].code,
//             unitPrice: {
//               _sdkType: element?.['1'].unitPrice?._sdkType,
//               amount: element?.['1'].unitPrice?.amount,
//               currency: element?.['1'].unitPrice?.currency,
//             },
//             percentage: element?.['1'].percentage,
//             includeFor: ['provider'],
//           },
//         };
//         multiSlotsData.push(newObj);
//       }

//       const customPayload = multiSlotsData.flatMap(parentObject => [
//         parentObject.one,
//         parentObject.two,
//       ]);

//       // Add lineItems to the body params
//       const body = {
//         ...bodyParams,
//         params: {
//           ...objectWithoutAllLineItem,
//           lineItems: [...customPayload],
//         },
//       };

//       if (isSpeculative) {
//         // return trustedSdk.transactions.transitionSpeculative(body, queryParams);
//          return trustedSdk.transactions.initiate(body, queryParams);
//       }
//       return trustedSdk.transactions.transition(body, queryParams);
//     })
//     .then(apiResponse => {
//       const { status, statusText, data } = apiResponse;
//       res
//         .status(status)
//         .set('Content-Type', 'application/transit+json')
//         .send(
//           serialize({
//             status,
//             statusText,
//             data,
//           })
//         )
//         .end();
//     })
//     .catch(e => {
//       handleError(res, e);
//     });
// };
