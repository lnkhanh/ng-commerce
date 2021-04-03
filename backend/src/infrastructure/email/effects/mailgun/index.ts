import { IMailTransport, ISendMailCommand } from '../../types';
const KEY = process.env.MAILGUN_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = require('mailgun.js');
const mg = mailgun.client({ username: 'api', key: KEY });

export default class MailGunSender implements IMailTransport {
  mailgun: any;
  constructor(mailgun?: any) {
    this.mailgun = mailgun || mg;
  }
  send(data: ISendMailCommand): Promise<unknown> {
    return this.mailgun.messages.create(DOMAIN, data);
  }
}
