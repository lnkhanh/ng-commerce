import * as path from 'path';
import { IMailerSettings, IMailHbsTemplate, ReadFileFn } from './types';

export async function loadTemplates(
  rootPath: string,
  readFile: ReadFileFn,
  settings: IMailerSettings,
): Promise<IMailHbsTemplate> {
  const folderRoot = path.join(
    rootPath,
    settings.template,
    settings.country.toUpperCase(),
    settings.language.toLowerCase(),
  );
  const [subject, html, text] = await Promise.all([
    readFile(path.join(folderRoot, 'subject.hbs')).then(file => file.toString('utf8')),
    readFile(path.join(folderRoot, 'html.hbs')).then(file => file.toString('utf8')),
    readFile(path.join(folderRoot, 'text.hbs')).then(file => file.toString('utf8')),
  ]);

  return { subject, html, text, rendered: false };
}
