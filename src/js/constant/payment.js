export const ORDER_STATUS = {
  TIMED_OUT: -1,
  PENDING: 0,
  RECEIVE_COIN: 1,
  FAILED: 2,
  PAYMENT_SUCCESS: 3,
  SENT_MASTER_WALLET: 4,
  PAYPAL_CAPTURE_FAILED: 10,
};
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.TIMED_OUT]: 'Timed out',
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.RECEIVE_COIN]: 'Paid',
  [ORDER_STATUS.FAILED]: 'Failed',
  [ORDER_STATUS.PAYMENT_SUCCESS]: 'Paid',
  [ORDER_STATUS.PAYPAL_CAPTURE_FAILED]: 'Failed',
  [ORDER_STATUS.SENT_MASTER_WALLET]: 'Paid',
};
export const PAYMENT_TYPE = {
  CRYPTO: 1,
  PAYPAL: 2,
  ZELLE: 3,
  AMAZON: 4,
  AUTHORIZE_DOT_NET: 5,
};
export const PAYMENT_TYPE_TEXT = {
  [PAYMENT_TYPE.CRYPTO]: 'Crypto',
  [PAYMENT_TYPE.PAYPAL]: 'Paypal',
  [PAYMENT_TYPE.ZELLE]: 'Zelle',
  [PAYMENT_TYPE.AMAZON]: 'Amazon Payment',
  [PAYMENT_TYPE.AUTHORIZE_DOT_NET]: 'Credit card',
};
export const ZELLE_PAYMENT_ADDRESS = 'payment@incognito.org';

export const ORIGIN_PRODUCT_PRICE = 399;

export const SHIPPING_DAYS_DEFAULT = 2;
