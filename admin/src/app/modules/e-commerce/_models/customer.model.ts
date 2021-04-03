import { BaseModel } from '@app/core/views/crud';

export class CustomerModel extends BaseModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  userName: string;
  gender: string;
  status: number; // 0 = Active | 1 = Suspended | Pending = 2
  dateOfBbirth: string;
  dob: Date;
  ipAddress: string;
  type: number; // 0 = Business | 1 = Individual

  clear() {
    this.dob = new Date();
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = null;
    this.userName = '';
    this.gender = 'Female';
    this.ipAddress = '';
    this.type = 1;
    this.status = 1;
  }
}
