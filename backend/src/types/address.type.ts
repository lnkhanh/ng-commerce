
export type IAddressModel = {
  _id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address1: string;
  address2?: string;
  district: {
    _id: string;
    name: string;
  };
  city: {
    _id: string;
    name: string;
  };
  country: string;
  phone?: string;
  taxCode?: string;
};
