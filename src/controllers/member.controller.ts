/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IMemberDocment } from 'src/interfaces/member.interface';
import { ProfileModel } from 'src/models/profile.model';
import { ValidationPipe } from 'src/pips/validation.pipe';
import { MemberService } from 'src/services/member.service';
import { ChangePasswordModel } from 'src/models/change-password.model';
import { SearchModel } from 'src/models/serch.model';
import {
  CreateMemberModel,
  ParamMemberModel,
  UpdateMemberModel,
} from 'src/models/member.model';
import { get } from 'http';
import { RoleGuard } from 'src/guards/role.guard';
import { RoleAccount } from 'src/interfaces/app.interface';

@Controller('api/member')
// @UseGuards(AuthGuard('bearer'))
@UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(private service: MemberService) {}

  @Get('data') // ข้อมูล profile
  getUserLogin(@Req() req: Request) {
    const userLogin: IMemberDocment = req.user as any;
    userLogin.id = userLogin._id;
    userLogin.password = '';
    // userLogin.image = userLogin.image
    //   ? 'http://localhost:3000' + userLogin.image
    //   : '';
    return userLogin;
  }

  @Post('profile')// แก้ไขข้อมูลส่วนตัว
  updateProfile(
    @Req() req: Request,
    @Body(new ValidationPipe()) body: ProfileModel,
  ) {
    const profile: IMemberDocment = req.user as any;
    return this.service.onUpdateProfile(profile.id, body);
  }
 
  @Post('change-password') //เปลี่ยนรหัสผ่าน
  changePassword(
    @Req() req: Request,
    @Body(new ValidationPipe()) body: ChangePasswordModel,
  ) {
    const user: IMemberDocment = req.user as any;
    return this.service.onchangePassword(user.id, body);
  }
  
  @Get()//แสดงข้อมูลสมาชิก
  @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Employee))
  showMembes(@Query(new ValidationPipe()) query: SearchModel) {
    query.startPage = parseInt(query.startPage as any);
    query.limitPage = parseInt(query.limitPage as any);
    const result = this.service.getMemberItems(query);
    // result.then(c => console.log(c));
    return result;
  }
  
  @Post()//เพิ่ม ข้อมูลสมาชิก
  @UseGuards(new RoleGuard(RoleAccount.Admin))
  createMember(@Body(new ValidationPipe()) body: CreateMemberModel) {
    return this.service.createMemberItem(body);
  }

  @Get(':id')// แสดงข้อมูลสมาชิก by id
  @UseGuards(new RoleGuard(RoleAccount.Admin))
  showMemberById(@Param(new ValidationPipe()) param: ParamMemberModel) {
    return this.service.getMemeberItem(param.id);
  }
  
  @Put(':id')// แก้ไขข้อมุลสมาชิก
  @UseGuards(new RoleGuard(RoleAccount.Admin))
  updateMember(
    @Param(new ValidationPipe()) param: ParamMemberModel,
    @Body(new ValidationPipe()) body: UpdateMemberModel,
  ) {
    return this.service.updateMemberItem(param.id, body);
  }
  
  @Delete(':id')// ลบข้อมูลสมาชิก
  @UseGuards(new RoleGuard(RoleAccount.Admin, RoleAccount.Employee))
  deleteMember(@Param(new ValidationPipe()) param: ParamMemberModel) {
    return this.service.deleteMemberItem(param.id);
  }
}
