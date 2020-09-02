/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  IProfile,
  IAccount,
  IChangePassword,
  IMember,
  ISearch,
} from 'src/interfaces/app.interface';
import { InjectModel } from '@nestjs/mongoose';
import { IMemberDocment } from 'src/interfaces/member.interface';
import { Model, Mongoose, Schema } from 'mongoose';
import { BASE_DIR } from 'src/main';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { verify, generate } from 'password-hash';
import { strict } from 'assert';
import { time } from 'console';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel('Member') private MemberCollection: Model<IMemberDocment>,
  ) {
    // const member: IAccount[] = [];
    // for (let i = 0; i < 100; i++) {
    //   member.push({
    //     firstname: `Firstname${i}`,
    //     lastname: `Lastname${i}`,
    //     email: `email${i}@mail.com`,
    //     password: generate(`password-${i}`),
    //     image: '',
    //     position: '',
    //     role: RoleAccount.Member,
    //   });
    // }
    // this.MemberCollection.create(member, err => console.log(err));
  }

  // ลบข้อมูลสมาชิก
  deleteMemberItem(memberID: any) {
    return this.MemberCollection.remove({ _id: memberID });
  }

  //แก้ไขข้อมูลสมาชิก
  async updateMemberItem(memberID: any, body: IAccount) {
    const memberUpdate = await this.MemberCollection.findById(memberID);
    if (!memberUpdate) throw new BadRequestException('ไม่มีข้อมูลนี้ในระบบ');

    try {
      memberUpdate.firstname = body.firstname;
      memberUpdate.lastname = body.lastname;
      memberUpdate.image = body.image || '';
      memberUpdate.position = body.position;
      memberUpdate.email = body.email;
      memberUpdate.role = body.role;
      memberUpdate.updated = new Date();

      if (body.password && body.password.trim() != '')
        memberUpdate.password = generate(body.password);

      const updated = await this.MemberCollection.update(
        { _id: memberID },
        memberUpdate,
      );

      if (!updated.ok)
        throw new BadRequestException('ไม่สามารถ แก้ไขข้อมูลได้!');

      return await this.MemberCollection.findById(memberID, {
        image: false,
        password: false,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  //แสดงข้อมูลสมาชิกคนเดียว
  async getMemeberItem(memberID: any) {
    console.log(memberID);
    const memberItem = await this.MemberCollection.findById(memberID, {
      password: false,
    });
    return memberItem;
  }

  // สร้าง ข้อมูลสมาชิกใหม่
  async createMemberItem(body: IAccount) {
    const count = await this.MemberCollection.count({ email: body.email });
    if (count > 0) throw new BadRequestException('มีอีเมล์นี้ในระบบแล้ว');

    body.password = generate(body.password);
    body.image = body.image || '';
    const created = await this.MemberCollection.create(body);
    created.password = '';
    return created;
  }

  //แสดงข้อมูลสมาชิก
  async getMemberItems(searchOption: ISearch) {
    let queryItemFunciton = () =>
      this.MemberCollection.find({}, { image: false });

    // ค้นหา
    if (searchOption.searchText && searchOption.searchType) {
      const text = searchOption.searchText;
      const type = searchOption.searchType;
      const conditions = {};
      switch (type) {
        case 'role':
          conditions[type] = text;
          queryItemFunciton = () =>
            this.MemberCollection.find(conditions, { image: false });
          break;
        case 'updated':
          queryItemFunciton = () =>
            this.MemberCollection.find({}, { image: false })
              .where('updated')
              .gt(text['from'])
              .lt(text['to']);
          //   queryItemFunciton = () =>
          //     this.MemberCollection.find(
          //       { updated: { $gt: text['from'], $lt: text['to']} },
          //       { image: false },
          //     );
          break;
        default:
          conditions[type] = new RegExp(text, 'i');
          queryItemFunciton = () =>
            this.MemberCollection.find(conditions, { image: false });
          break;
      }
    }

    // ค้นหาและแบ่งหน้า
    const items = await queryItemFunciton()
      .sort({ updated: -1 })
      .skip((searchOption.startPage - 1) * searchOption.limitPage)
      .limit(searchOption.limitPage);

    // หาผลรวมของหน้า page ทั้งหมด
    const totalItems = await queryItemFunciton().count({});
    return <IMember>{
      items,
      totalItems,
    };
  }

  //เปลี่ยนรหัสผ่าน
  async onchangePassword(memberID: any, body: IChangePassword) {
    const memberItem = await this.MemberCollection.findById(memberID);
    if (!verify(body.old_pass, memberItem.password))
      throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง');

    const updated = await this.MemberCollection.update({ _id: memberID }, <
      IAccount
    >{
      password: generate(body.new_pass),
      updated: new Date(),
    });

    if (updated.ok > 0) return updated;
  }

  //แก้ไข โปรไฟล์
  async onUpdateProfile(memberID: any, body: IProfile) {
    const updated = await this.MemberCollection.update({ _id: memberID }, <
      IAccount
    >{
      firstname: body.firstname,
      lastname: body.lastname,
      position: body.position,
      image: body.image,
      updated: new Date(),
    });
    if (!updated.ok) throw new BadRequestException('ข้อมูลไม่มีการเปลี่ยนแปลง');
    const memberItem = await this.MemberCollection.findById(memberID, {
      password: false,
    });
    // memberItem.image = memberItem.image
    //   ? 'http://localhost:3000/' + memberItem.image + '?var=' + Math.random()
    //   : '';
    return memberItem;
  }

  // แปลงรูปภาพ จาก base64 to file
  private convertUploadImage(memberID, image: string) {
    try {
      const uploadDir = BASE_DIR + '/uploads';
      // create folder
      if (!existsSync(uploadDir)) mkdirSync(uploadDir);
      //ตรวจสอบ ชนิด .jpg
      if (image.indexOf('image/jpeg') >= 0) {
        const fileName = `${uploadDir}/${memberID}.jpg`;
        writeFileSync(
          fileName,
          new Buffer(image.replace('data:image/jpeg;base64,', ''), 'base64'),
        );
        return fileName.replace(BASE_DIR, '');
      }
      return '';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
