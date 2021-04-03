export interface IMailerSettings {
  language: string;
  country: string;
  template: string;
  recipient?: IRecipient;
}

export const AVAILABLE_TEMPLATES = {
  RESET_PASSWORD: 'resetPassword',
};

export interface IRecipient {
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface IMailHbsTemplate {
  subject: string;
  html: string;
  text: string;
  rendered: boolean;
}

export interface ISendMailCommand {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
}

export type ReadFileFn = (path: string) => Promise<Buffer>;

export interface IMailTransport {
  send: (mail: ISendMailCommand) => Promise<any>;
}
export class Env {
  public static get mailgunApiKey(): string {
    return process.env.MAILGUN_KEY;
  }
  public static get mailgunDomain(): string {
    return process.env.MAILGUN_DOMAIN;
  }

  public static get mailFromName(): string {
    return process.env.MAIL_FROM_NAME || 'NgCommerce';
  }

  public static get mailFromEmail(): string {
    return process.env.MAIL_FROM_EMAIL || 'help@ng-commerce.com';
  }
}
