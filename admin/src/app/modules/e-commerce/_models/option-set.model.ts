export class OptionSet {
  id?: string;
  name: string;
  displayName: string;
  displayOrder?: number;
  displayControlType: string;
  options?: Option[];
  modifiedAt?: string;
  createdAt?: string;
}

export type Option = {
  name: string;
  displayName: string;
  value: number;
  displayOrder?: number;
}

export enum OptionSetControlType {
	CHECKBOX,
	RADIO,
	SELECT
}

export const optionSetControlTypes = [
  { name: 'Checkbox', val: OptionSetControlType.CHECKBOX },
  { name: 'Radio', val: OptionSetControlType.RADIO },
  { name: 'Select', val: OptionSetControlType.SELECT },
];