import { Profile, Strategy as FacebookStrategy } from 'passport-facebook';
import { ISessionRequest } from "@src/types/account/session-request.type";
import { AccountRepository } from '@src/repositories/account.repository';
import { IAccountModel } from '@src/types/account.type';

const genders: {
  [key: string]: string
} = {
  male: 'M',
  female: 'F',
};

const verifyFunction = async (
  req: ISessionRequest,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: (...args: unknown[]) => void,
) => {
  let user;

  const provider = {
    provider: 'facebook',
    facebookProvider: Object.assign(profile._json, {
      accessToken,
      refreshToken,
    }),
  };

  // if (req.user && req.user.provider !== 'facebook') {
  //     try {
  //         user = await AccountRepository.associateOauthProvider(req.user.id, provider);
  //         return done(null, user);
  //     } catch (e) {
  //         return done(e);
  //     }
  // }

  const accountData: IAccountModel = Object.assign(
    {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails && profile.emails.length ? profile.emails[0].value : `${profile.id}@facebook.com`,
      gender: genders[profile.gender] || genders.female,
      state: 'confirmed'
    },
    provider,
  );

  try {
    user = await AccountRepository.findOrCreateOauthAccount(accountData);
    if (!user) {
      return done({ message: 'COULD_NOT_LOGIN_FACEBOOK_EMAIL_ALREADY_EXISTS' }, false);
    }
    done(null, user);
  } catch (e) {
    done(e);
    console.log(e);
  }
};

export const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    passReqToCallback: true,
    profileFields: ['id', 'name', 'email'],
  },
  verifyFunction,
);
