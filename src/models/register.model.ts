import { IRegister } from 'src/interfaces/app.interface';
import { IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { IsComparePassword } from 'src/pips/validation.pipe';

export class RegisterModule implements IRegister {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty({ message: 'กรุณากรอก Email' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^[A-z0-9]{6,15}/)
  password: string;

  @IsNotEmpty()
  @IsComparePassword('password')
  cpassword: string;
}
