/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { generate } from 'password-hash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAccessTokenDucument } from 'src/interfaces/access-token.interface';
import { IMemberDocment } from 'src/interfaces/member.interface';
import { IAuthen } from 'src/interfaces/authen.interface';
// authen
import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class DBAuthenService implements IAuthen {
  constructor(
    @InjectModel('AccessToken')
    private AccessTokenCollection: Model<IAccessTokenDucument>,
  ) {}

  // สร้าง token
  async generateAccessToken(member: IMemberDocment) {
    const model = {
      memberID: member._id,
      accessToken: generate(Math.random().toString()),
      exprise: new Date().setMinutes(new Date().getMinutes() + 30),
    };
    const token = await this.AccessTokenCollection.create(model);
    return token.accessToken;
  }

  // ยืนยัน ผู้ใช้งาน ที่เข้าสู่ระบบ
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateUser(accessToken: any): Promise<IMemberDocment> {
    try {
      const tokenItem = await this.AccessTokenCollection.findOne({
        accessToken,
      }).populate('memberID');
      if (tokenItem.exprise > new Date()) {
        
        return tokenItem.memberID;
      }
    } catch (ex) {}
    return null;
  }
}

@Injectable()
export class DBAuthenStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: DBAuthenService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(token: any, done: Function): Promise<any> {
    const user = await this.authService.validateUser(token);
    if (!user) {
      return done(new UnauthorizedException('Unauthorized please login!'));
    }
    return done(null, user);
  }
}
