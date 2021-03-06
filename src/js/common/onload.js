import storage from '../service/storage';
import KEYS from '../constant/keys';
import { setMessage } from '../service/message_box';
import queryString from '../service/queryString';
import { verifyEmailToken } from '../service/api';

// const checkAuth = () => {
//   const token = storage.get(KEYS.TOKEN);

//   if (token && isPathname('/')) {
//     location.pathname = '/referral.html';
//   }
// }

const checkVerifyEmailToken = () => {
  const token = queryString(KEYS.TOKEN_EMAIL_VERIFY_QS);
  if (token) {
    verifyEmailToken(token)
      .then(() => {
        setMessage('Your email has been verified', 'info');
        location.href = `${location.origin}/referral.html`;
      })
      .catch(e => {
        setMessage(e.message, 'error');
      });
  }
};

const checkReferralCode = () => {
  const referralCode = queryString(KEYS.REFERRAL_QUERY);
  const myReferralCode = storage.get(KEYS.MY_REFERRAL_CODE);

  if (referralCode) {
    if (myReferralCode && referralCode == myReferralCode) {
      location.href = `${location.origin}/referral.html`;
    } else {
      storage.set(KEYS.REFERRAL_CODE, referralCode);
      location.href = `${location.origin}`;
    }
  }
};

const main = () => {
  // checkAuth();
  checkVerifyEmailToken();
  checkReferralCode();
};

main();
