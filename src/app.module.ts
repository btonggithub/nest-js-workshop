import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import {
  DBAuthenService,
  DBAuthenStrategy,
} from './services/db-authen.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './controllers/app.controller';
import { AccountController } from './controllers/account.controller';
import { MemberController } from './controllers/member.controller';

import { memberSchema } from './schemas/member.schema';
import { accessTokenSchema } from './schemas/access-token.schema';
import {
  JwtAuthenServiece,
  JwtAuthenStrategy,
} from './services/jwt-authen.service';
import { MemberService } from './services/member.service';
import { AppEnvironment } from './app.environment';

console.log(AppEnvironment.dbHost);

@Module({
  imports: [
    MongooseModule.forRoot(AppEnvironment.dbHost),
    MongooseModule.forFeature([
      { name: 'Member', schema: memberSchema },
      { name: 'AccessToken', schema: accessTokenSchema },
    ]),
  ],
  controllers: [AppController, AccountController, MemberController],
  providers: [
    AppService,
    DBAuthenService,
    DBAuthenStrategy,
    JwtAuthenServiece,
    JwtAuthenStrategy,
    MemberService,
  ],
})
export class AppModule {}
