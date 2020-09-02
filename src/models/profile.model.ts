import { IProfile } from "src/interfaces/app.interface";
import { IsNotEmpty } from "class-validator";

export class ProfileModel implements IProfile{
    @IsNotEmpty()
    firstname: string;

    @IsNotEmpty()
    lastname: string;

    @IsNotEmpty()
    position: string;

    image: string;
}