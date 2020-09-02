import { IMemberDocment } from './member.interface';

export interface IAuthen {
  generateAccessToken(member: IMemberDocment): Promise<string>;

  validateUser(accessToken: any): Promise<IMemberDocment>;
}
