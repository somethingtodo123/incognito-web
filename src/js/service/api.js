import fetch from './fetch';
import authModel from '../model/auth';
import subscribeModel from '../model/subscribe';
import referralLevelModel from '../model/referralLevel';
import $ from 'jquery';

export const subscribe = (email, referralCode, from = '') => {
  return fetch('auth/subscribe', {
    method: 'POST',
    body: {
      Email: email,
      ReferralCode: referralCode,
      FromPage: from,
    },
  })
    .then(subscribeModel.fromJson)
    .catch((e) => {
      throw new Error(
        e.message || 'Can not subscribe your email right now, please try later'
      );
    });
};

export const auth = (email) => {
  return fetch('auth/token', {
    method: 'POST',
    body: {
      Email: email,
    },
  })
    .then(authModel.fromJson)
    .catch((e) => {
      throw new Error(
        e.message || 'Can not register your email right now, please try later'
      );
    });
};

export const listReferralLevel = () => {
  return fetch('auth/referral-levels', {
    method: 'GET',
  })
    .then((data) => data && data.map(referralLevelModel.fromJson))
    .catch((e) => {
      throw new Error(e.message || 'Can not get referral program list');
    });
};

export const getUserTotalReferral = () => {
  return fetch('auth/total-referral', {
    method: 'GET',
  })
    .then((num) => Number.parseInt(num) || 0)
    .catch((e) => {
      throw new Error(e.message || 'Can not get user referral total');
    });
};

export const verifyEmailToken = (token) => {
  return fetch('auth/verify-email', {
    method: 'POST',
    body: {
      Token: token,
    },
  }).catch((e) => {
    throw new Error(e.message || 'Token is invalid');
  });
};

export const sendReferralInvitation = (emails) => {
  const emailStr = emails && emails.join(',');
  return fetch('auth/referral-invitation', {
    method: 'POST',
    body: {
      Email: emailStr,
    },
  }).catch((e) => {
    if (!APP_ENV.production) {
      console.error(e);
    }

    throw new Error(e.message || 'Can not send invitation to your email list');
  });
};

export const getTotalSubscribe = () => {
  return fetch('auth/total-subscrite', {
    method: 'GET',
  })
    .then((num) => Intl.NumberFormat().format(num))
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }

      throw new Error(e.message || 'Can not get total subscriber');
    });
};

export const getExchangeRates = () => {
  return fetch('exchange/rates', {
    method: 'GET',
  })
    .then((rates) => {
      const fiatRate = {};
      rates.forEach((rate) => {
        fiatRate[rate.Base.toLowerCase()] = rate.Price;
      });
      return fiatRate;
    })
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
    });
};

export const getProductPrice = () => {
  return fetch('order/price', {
    method: 'GET',
  })
    .then((price) => price)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
    });
};

export const signUp = ({ name, email }) => {
  return fetch('auth/signup', {
    method: 'POST',
    body: {
      FullName: name,
      Email: email,
    },
  })
    .then((user) => user)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const getShippingFee = ({
  address = '',
  city = '',
  zip = '',
  state,
  country,
}) => {
  return fetch('order/shipping-fee', {
    method: 'POST',
    body: {
      AddressStreet: address,
      AddressCity: city,
      AddressRegion: state,
      AddressPostalCode: zip,
      AddressCountry: country,
    },
  })
    .then((fee) => fee)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
    });
};

export const checkCCPaymentGatewayLimit = () => {
  return fetch('order/authorize/check-limit', {
    method: 'GET',
  })
    .then((isEnabled) => isEnabled)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const submitCryptoOrder = ({
  firstName,
  lastName,
  address,
  city,
  state,
  country,
  zip,
  coinName,
  quantity,
  phoneNumber,
}) => {
  const CURRENCIES = {
    ETH: 1,
    BTC: 2,
    BNB: 4,
    PRV: 7,
  };

  const ERC20_TOKENS = {
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    TUSD: '0x0000000000085d4780B73119b644AE5ecd22b376',
    PAX: '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
    GUSD: '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
    USDS: '0xa4bdb11dc0a2bec88d24a3aa1e6bb17201112ebe',
    BUSD: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
  };

  coinName = coinName.toUpperCase();
  let tokenId = null;
  let tokenSymbol = null;
  let currencyType = -1;

  if (coinName in CURRENCIES) {
    currencyType = CURRENCIES[coinName];
  } else if (coinName in ERC20_TOKENS) {
    currencyType = 3;
    tokenId = ERC20_TOKENS[coinName];
    tokenSymbol = coinName;
  }

  if (currencyType === CURRENCIES.PRV) {
    $(`#show-note`).append(`
      <div class="description">
        <h2 class="note">Please note:</h2>
        <div class="description">
          Please remember to include your order number <span class="order-number underline-text"></span> in the memo field. Orders without a memo will not be processed.     
        </div>
      </div>
    `);
  }

  return fetch('order/crypto/checkout', {
    method: 'POST',
    body: {
      FirstName: firstName,
      LastName: lastName,
      AddressStreet: address,
      AddressRegion: state,
      AddressCity: city,
      AddressPostalCode: zip,
      AddressCountry: country,
      CurrencyType: currencyType,
      Quantity: quantity,
      TokenID: tokenId,
      TokenSymbol: tokenSymbol,
      PhoneNumber: phoneNumber,
    },
  })
    .then((orderInfo) => orderInfo)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const submitZelleOrder = ({
  firstName,
  lastName,
  address,
  city,
  state,
  country,
  zip,
  quantity,
  phoneNumber,
}) => {
  return fetch('order/zelle/checkout', {
    method: 'POST',
    body: {
      FirstName: firstName,
      LastName: lastName,
      AddressStreet: address,
      AddressRegion: state,
      AddressCity: city,
      AddressPostalCode: zip,
      AddressCountry: country,
      Quantity: quantity,
      PhoneNumber: phoneNumber,
    },
  })
    .then((orderInfo) => orderInfo)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const submitCreditCardOrder = ({
  firstName,
  lastName,
  address,
  city,
  state,
  zip,
  country,
  phoneNumber,
  billingFirstName,
  billingLastName,
  billingAddress,
  billingCity,
  billingState,
  billingZip,
  billingCountry,
  cardNumber,
  cardExpiry,
  cardCode,
  quantity = 1,
}) => {
  return fetch('order/authorize/checkout', {
    method: 'POST',
    body: {
      ShippingTo: {
        FirstName: firstName,
        LastName: lastName,
        AddressStreet: address,
        AddressCity: city,
        AddressRegion: state,
        AddressPostalCode: zip,
        AddressCountry: country,
        PhoneNumber: phoneNumber,
      },
      BillingTo: {
        FirstName: billingFirstName,
        LastName: billingLastName,
        AddressStreet: billingAddress,
        AddressCity: billingCity,
        AddressRegion: billingState,
        AddressPostalCode: billingZip,
        AddressCountry: billingCountry,
      },
      CCInfo: {
        CCNumber: cardNumber,
        CCExpired: cardExpiry,
        CCCVC: cardCode,
      },
      Quantity: quantity,
    },
  })
    .then((orderInfo) => orderInfo)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }
      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const registerValidator = ({
  telegramId,
  nodeWalletAddress,
  nodeIP,
  referFrom,
  feedback,
}) => {
  return fetch('/validator/new', {
    method: 'POST',
    body: {
      TelegramID: telegramId,
      NodeWalletAddress: nodeWalletAddress,
      NodeIP: nodeIP,
      ReferFrom: referFrom,
      Feedback: feedback,
    },
  })
    .then((validator) => validator)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }

      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const getValidatorDetails = ({ telegramId, nodeWalletAddress }) => {
  return fetch('/validator/check', {
    method: 'POST',
    body: {
      TelegramID: telegramId,
      NodeWalletAddress: nodeWalletAddress,
    },
  })
    .then((validatorInfo) => validatorInfo)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }

      throw new Error(
        e.message ||
          'Something went wrong, but we’re on it. Please try again soon.'
      );
    });
};

export const getOrderHistory = ({ email, orderNumber }) => {
  return fetch(
    `order/history?OrderID=${encodeURIComponent(
      orderNumber
    )}&Email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
    }
  )
    .then((orderDetails) => orderDetails)
    .catch((e) => {
      if (!APP_ENV.production) {
        console.error(e);
      }

      throw e;
    });
};

export const getConfigsFromServer = () => {
  return fetch(`system/configs`, {
    method: 'GET',
  })
    .then((resolve) => resolve)
    .catch((e) => {
      throw e;
    });
};
