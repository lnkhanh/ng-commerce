import { IMailHbsTemplate, IRecipient, ISendMailCommand, Env } from './types';
import * as Handlebars from 'handlebars';

export async function renderMail(mailTemplates: IMailHbsTemplate, data: any): Promise<IMailHbsTemplate> {
  const html = Handlebars.compile(mailTemplates.html)(data);
  const text = Handlebars.compile(mailTemplates.text)(data);
  const subject = Handlebars.compile(mailTemplates.subject)(data);
  return { html, text, subject, rendered: true };
}

export function buildMailCommand(recipient: IRecipient, mailData: IMailHbsTemplate): ISendMailCommand {
  return {
    from: Env.mailFromName + ' <' + Env.mailFromEmail + '>',
    to: [recipient.firstName + ' ' + recipient.lastName + ' <' + recipient.email + '>'],
    subject: mailData.subject,
    html: mailData.html,
    text: mailData.text,
  };
}
