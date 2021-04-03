const path = require('path');

const getEnvVariable = (name, fallback) => {
  if (!fallback && !process.env[name]) {
    throw new Error(`Can not get ${name}`);
  }
  return process.env[name] || fallback;
};

module.exports.getAppRoot = () => path.join(__dirname, '../');

module.exports.getHost = () => {
  return process.env.HOST || 'localhost';
};

module.exports.getCookieSecret = () => {
  return getEnvVariable('COOKIE_SECRET');
};

module.exports.getPort = () => {
  return +process.env.PORT || 8080;
};

module.exports.getCacheVersion = () => {
  return module.exports.isProduction() && process.env.CACHE_VERSION;
};

module.exports.getNodeEnv = () => {
  return process.env.NODE_ENV;
};

module.exports.getCountry = () => {
  return getEnvVariable('COUNTRY', 'VN');
};

module.exports.getManifestName = () => {
  return process.env.MANIFEST_NAME || 'NgCommerce';
};

module.exports.getManifestDescription = () => {
  return process.env.MANIFEST_DESCRIPTION;
};

module.exports.getDefaultLanguage = () => {
  return getEnvVariable('DEFAULT_LANGUAGE', 'vn');
};

module.exports.getLocalCompression = () => {
  return process.env.LOCAL_COMPRESSION;
};

module.exports.isProduction = () => {
  return module.exports.getNodeEnv() === 'production';
};

module.exports.getMenuApiUrl = () => {
  return process.env.MENU_API_URL;
};

module.exports.getBundleAnalyze = () => {
  return process.env.BUNDLE_ANALYZE;
};

module.exports.getApiUrl = () => {
  return process.env.API_URL;
};

module.exports.getForceCacheableAssets = () => {
  return process.env.FORCE_CACHABLE_ASSETS || false;
};

module.exports.getAllowedLanguages = () => {
  const langs = getEnvVariable('ALLOWED_LANGUAGES', 'vn,en');
  const langSet = [].concat(langs.split(','));
  return langSet;
};

module.exports.stripeHasDecimalCurrency = () => {
  const hasDecimalCurrency = getEnvVariable('STRIPE_HAS_ZERO_DECIMAL_CURRENCY', '0');
  return hasDecimalCurrency === '1' ? true : false;
}

module.exports.getAllowedCountries = () => {
  const countries = getEnvVariable ('ALLOWED_COUNTRIES', 'VN,PH');
  const result = [].concat (countries.split (','));
  return result;
};

module.exports.getCurrency = () => {
  return process.env.CURRENCY || 'VND';
};

module.exports.getLocationId = country => {
  switch (country) {
    case 'SG':
      return process.env.SG_LOCATION_ID || '31';
    case 'HK':
      return process.env.HK_LOCATION_ID || '32';
    case 'KR':
      return process.env.KR_LOCATION_ID || '33';
    case 'PH':
      return process.env.PH_LOCATION_ID || '34';
    case 'VN':
      return process.env.VN_LOCATION_ID || '3';
    default:
      return process.env.VN_LOCATION_ID || '3';
  }
};

module.exports.processingSO = () => {
  return +process.env.PROCESSING_SO_EXPIRE_TIME || 60;
};

module.exports.stopSyncNs = () => {
  return process.env.STOP_SYNC_NS && process.env.STOP_SYNC_NS === '1'
    ? true
    : false;
};

module.exports.getLanguageSelectorString = () => {
  return Array.from(
    [].concat(
      module.exports.getDefaultLanguage(),
      module.exports.getAllowedLanguages()
    )
  ).reduce((acc, val) => {
    if (acc) {
      return `${acc}|${val}`;
    }
    return val;
  }, '');
};

module.exports.getUtcOffset = () => {
  const country = process.env.COUNTRY;
  if (country === 'PH') return 8 * 60; //utc+8
  return 7 * 60; //utc+7
};

module.exports.getSocialConfig = () => {
  const networks = {};
  if (process.env.LINK_FACEBOOK) {
    networks.fb = process.env.LINK_FACEBOOK;
  }
  if (process.env.LINK_INSTAGRAM) {
    networks.ig = process.env.LINK_INSTAGRAM;
  }
  if (process.env.LINK_WEBSITE) {
    networks.website = process.env.LINK_WEBSITE;
  }
  if (process.env.LINK_LINKEDIN) {
    networks.li = process.env.LINK_LINKEDIN;
  }
  if (process.env.LINK_CAREERS) {
    networks.careers = process.env.LINK_CAREERS;
  }
  if (process.env.LINK_YOUTUBE) {
    networks.yt = process.env.LINK_YOUTUBE;
  }
  return networks;
};

module.exports.getContacts = () => {
  return {
    name: process.env.CONTACT_NAME,
    email: process.env.CONTACT_EMAIL,
    phone: process.env.CONTACT_HOTLINE || '',
    domain: process.env.DOMAIN || 'https://ng-commerce.com',
    copyright: process.env.CONTACT_COPYRIGHT
  };
};

module.exports.getCrossBorderOrderPrefixs = () => {
  const crossBorderPrefix = process.env.CROSS_BORDER_ORDER_PREFIXS;
  if(crossBorderPrefix){
    return crossBorderPrefix.split(',');
  }
  return ['SG','HK','KR'];
};

module.exports.getCrossBorderStockEndpoint = () => {
  return process.env.CROSS_BORDER_STOCK_ENDPOINT;
};

module.exports.getShippingService = () => {
  return (
    process.env.SHIPPING_SERVICE || 'https://ng-commerce.com'
  );
};

module.exports.getShippingOptionsUrl = () => {
  return (
    process.env.SHIPPING_OPTIONS_URL || '/v1/3pl-management/delivery-service/query'
  );
};

module.exports.useCartLocation = () => {
  return process.env.USER_CART_LOCATION
    ? process.env.USER_CART_LOCATION.toLowerCase() == 'true'
    : false;
};

module.exports.disableShippingOptions = () => {
  return process.env.DISABLE_SHIPPING_OPTIONS
    ? process.env.DISABLE_SHIPPING_OPTIONS.toLowerCase() == 'true'
    : false;
};

module.exports.maxUniqueProducts = () => {
  const result = getEnvVariable('MAX_UNIQUE_PRODUCTS', 8);
  return +result;
};

module.exports.maxQuantity = () => {
  const result = getEnvVariable('MAX_QUANTITY', 5);
  return +result;
};

module.exports.localPaymentMethods = () => {
  const paymentMethods =
    getEnvVariable('LOCAL_PAYMENT_METHODS', false) || 'CC,COD,FREE';
  return paymentMethods.split(',');
};

module.exports.crossBorderPaymentMethods = () => {
  const paymentMethods =
    getEnvVariable('CROSS_BORDER_PAYMENT_METHODS', false) || 'STRIPE,FREE';
  return paymentMethods.split(',');
};

module.exports.getInviteReferralsUrl = () => {
  return process.env.INVITE_REFERRALS_URL;
}

module.exports.getInviteReferralsToken = () => {
  return process.env.INVITE_REFERRALS_TOKEN;
}

module.exports.getInviteReferralsBID = () => {
  return process.env.INVITE_REFERRALS_BID;
}
module.exports.paydollarPayMethod = () => {
  const result = getEnvVariable('PAYDOLLAR_PAY_METHOD', 'CC');
  return result;
};

module.exports.paydollarMpsMode = () => {
  const result = getEnvVariable('PAYDOLLAR_MPS_MODE', 'NIL');
  return result;
};

module.exports.paydollarMerchantId = () => {
  const result = getEnvVariable('PAYDOLLAR_MERCHANT_ID');
  return result;
};

module.exports.paydollarPayType = () => {
  const result = getEnvVariable('PAYDOLLAR_PAYTYPE');
  return result;
};

module.exports.paydollarCurrCode = () => {
  const result = getEnvVariable('PAYDOLLAR_CURRCODE');
  return result;
};

module.exports.paydollarSecureHashKey = () => {
  const result = getEnvVariable('PAYDOLLAR_SECURE_HASH_KEY');
  return result;
};
