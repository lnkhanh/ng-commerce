import * as fs from 'fs';
import * as util from 'util';
import { logger } from '../logger';
import { IMailerSettings, IMailHbsTemplate, IMailTransport, IRecipient } from './types';
import { loadTemplates } from './loaders';
import { buildMailCommand, renderMail } from './transform';
import MailGunSender from './effects/mailgun';
const readFile = util.promisify(fs.readFile);
import * as path from 'path';
export const current = __dirname;

export const TEMPLATES = {
  ORDER_CONFIRMATION: 'orderConfirmation',
  RESET_PASSWORD: 'resetPassword',
};

export class Email {
  private templateName: string;
  private language: string;
  private country: string;
  private recipient: IRecipient;
  private transport: IMailTransport;

  constructor(settings: IMailerSettings, transport: IMailTransport = new MailGunSender()) {
    this.templateName = settings.template;
    this.language = settings.language;
    this.country = settings.country;
    this.recipient = settings.recipient;
    this.transport = transport;
  }

  public getTemplate(): string {
    return this.templateName;
  }
  public getCountry(): string {
    return this.country;
  }

  public getRecipient(): IRecipient {
    return this.recipient;
  }

  public getLanguage(): string {
    return this.language;
  }

  public addTemplate(templateName: string): void {
    this.templateName = templateName;
  }

  public setLanguage(language: string) {
    this.language = language;
  }
  public setRecipient(user: IRecipient) {
    this.recipient = user;
    return this;
  }

  public send(data: any, root?: string): Promise<unknown> {
    const MAIL_PATH = root || process.env.EMAILS_DIR || path.join(__dirname, '../../../emails');
    return loadTemplates(MAIL_PATH, readFile, {
      template: this.templateName,
      country: this.country,
      language: this.language,
    })
      .then((templates: IMailHbsTemplate) => {
        return renderMail(templates, data);
      })
      .then((rendered: IMailHbsTemplate) => {
        return buildMailCommand(this.recipient, rendered);
      })
      .then(command => {
        return this.transport.send(command);
      })
      .then(() => {
        return true;
      })
      .catch(e => {
        logger.error('Send Email Error', data, e);
        throw e;
      });
  }
}
