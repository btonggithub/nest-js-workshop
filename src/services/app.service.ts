import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMemberDocment } from 'src/interfaces/member.interface';
import {
  IRegister,
  IAccount,
  RoleAccount,
  ILogin,
} from 'src/interfaces/app.interface';
import { generate, verify } from 'password-hash';
import { DBAuthenService } from './db-authen.service';
import { JwtAuthenServiece } from './jwt-authen.service';

@Injectable()
export class AppService {
  constructor(
    private authenService: JwtAuthenServiece,
    @InjectModel('Member') private MemberCollection: Model<IMemberDocment>,
  ) {}

  // ลงทะเบียน
  async onRegister(body: IRegister) {
    const count = await this.MemberCollection.count({ email: body.email });
    if (count > 0) throw new BadRequestException('มีอีเมล์ในระบบแล้ว');

    delete body.cpassword;
    const model: IAccount = body;
    model.password = generate(body.password);
    model.image = '';
    model.position = '';
    model.role = RoleAccount.Member;
    const modelItem = await this.MemberCollection.create(model);
    modelItem.password = '';
    return modelItem;
  }

  async onLogin(body: ILogin) {
    const member = await this.MemberCollection.findOne({ email: body.email });
    if (!member) throw new BadRequestException('ไม่มีผู้ใช้งานนี้ในระบบ');
    if (verify(body.password, member.password)) {
      return {
        accessToken: await this.authenService.generateAccessToken(member),
      };
    }
    throw new BadRequestException('อีเมล์ หรือ รหัสผ่านไม่ถูกต้อง');
  }
}
