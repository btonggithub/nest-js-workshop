import { ILogin } from "src/interfaces/app.interface";
import { IsNotEmpty, IsEmail } from "class-validator";

export class LoginModel implements ILogin{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    remember: boolean;
}