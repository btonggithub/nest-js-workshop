/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthen } from 'src/interfaces/authen.interface';
import { IMemberDocment } from 'src/interfaces/member.interface';
import { sign } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtAuthenServiece implements IAuthen {
  constructor(
    @InjectModel('Member') private MemberCollection: Model<IMemberDocment>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public secretKey: string = 'NodeJS Member Workshop';

  async generateAccessToken(member: IMemberDocment) {
    const payload = { email: member.email };
    return sign(payload, this.secretKey, { expiresIn: 60 * 60 });
  }

  async validateUser({ email }): Promise<IMemberDocment> {
    try {
      const userItem = await this.MemberCollection.findOne({
        email,
      });
      return userItem;
    } catch (error) {}
    return null;
  }
}

@Injectable()
export class JwtAuthenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: JwtAuthenServiece) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authService.secretKey,
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async validate(payload: any, done: Function) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException('Unauthorized please login!'));
    }
    return done(null, user);
  }
}
