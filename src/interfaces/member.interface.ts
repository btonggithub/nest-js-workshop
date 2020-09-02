import { IAccount } from './app.interface';
import { Document } from 'mongoose';

export interface IMemberDocment extends IAccount, Document {

}
