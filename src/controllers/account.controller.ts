import { Controller, Post, Body } from '@nestjs/common';
import { RegisterModule } from 'src/models/register.model';
import { ValidationPipe } from 'src/pips/validation.pipe';
import { AppService } from 'src/services/app.service';
import { LoginModel } from 'src/models/login.model';

@Controller('api/account')
export class AccountController {
  constructor(private service: AppService) {}

  @Post('register') //ลงทะเบียน
  register(@Body(new ValidationPipe()) body: RegisterModule) {
    return this.service.onRegister(body);
  }

  @Post('login')
  login(@Body(new ValidationPipe()) body: LoginModel) {
    return this.service.onLogin(body);
  }
}
