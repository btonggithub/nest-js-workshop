import { Document } from 'mongoose';

export interface IAccessTokenDucument extends Document {
  memberID: any;
  accessToken: string;
  exprise: Date; 
}
