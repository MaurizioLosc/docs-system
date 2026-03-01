import { IsEmail } from "class-validator"

export class ReqeustOTPDTO {
    @IsEmail()
    email: string;
}