import { IChangePassword } from 'src/interfaces/app.interface';
import { IsNotEmpty, Matches } from 'class-validator';
import { IsComparePassword } from 'src/pips/validation.pipe';

export class ChangePasswordModel implements IChangePassword {
  @IsNotEmpty()
  @Matches(/^[A-z0-9]{6,15}/)
  old_pass: string;

  @IsNotEmpty()
  @Matches(/^[A-z0-9]{6,15}/)
  new_pass: string;

  @IsNotEmpty()
  @IsComparePassword('new_pass')
  cnew_pass: string;
}
