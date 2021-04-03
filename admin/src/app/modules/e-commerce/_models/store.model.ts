export interface StoreType {
  id?: string;
  companyId?: string;
  name: string;
  address: string;
  createdBy?: string;
  modifiedAt?: string;
  createdAt?: string;
}

// Store Table
export interface StoreTablePayload {
  storeId: string;
  name: string;
}

export interface StoreTableType {
  id?: string;
  storeId: string;
  name: string;
  createdAt?: string;
  modifiedAt?: string;
}
