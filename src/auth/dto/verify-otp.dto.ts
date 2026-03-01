import { IsString } from "class-validator";

export class VerifyOTPDTO {
    @IsString()
    otp: string;
}