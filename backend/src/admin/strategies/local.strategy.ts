import { Strategy as LocalStrategy } from 'passport-local';
import { AccountRepository } from '@src/repositories/account.repository';

// eslint-disable-next-line @typescript-eslint/ban-types
const authFunction = async (email: string, password: string, done: Function) => {
  const user = await AccountRepository.authenticate(email, password);

  if (user) {
    return done(null, user);
  }

  return done({ message: 'EMAIL_PASSWORD_INCORRECT' }, false);
};

export const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  authFunction,
);
