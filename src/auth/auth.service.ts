import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/schema/user.schema";
import { OTP, OTPDocument } from "./schema/otp.schema";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/common/utils/email.util";
import { generateOTP } from "src/common/utils/otp.util";
import bcrypt from 'bcrypt'


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,

        @InjectModel(OTP.name)
        private otpModel: Model<OTPDocument>,

        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async RequstOTP(email: String) {
        let otpcheck = await this.otpModel.findOne({ email })

        if (otpcheck) {
            throw new ConflictException("OTP Already Sent to Email, Check the Email")
        }

        const otp: string = generateOTP(8)
        const expireOTP = new Date(Date.now() + 5 * 60 * 1000)

        const hashedOtp = await bcrypt.hash(otp, 10)

        const otpRecode = new this.otpModel({
            email,
            otp: hashedOtp,
            expireAt: expireOTP
        })

        await otpRecode.save()

        let user = await this.userModel.findOne({ email })

        if(!user) {
            user = new this.userModel({ email })
            await user.save()
            await this.emailService.sendOTP(user.email, otp)

            const token = this.jwtService.sign(
                { sub: user._id, email, type: "OTP_TOKEN"},
                { expiresIn: '5m'}
            );

            return ({ success: true, message: "Account Created Successful, OTP sent to Email...", token: token})
        }
    }

    async VerifyOTP (token: string, otp: string ){

    }
}