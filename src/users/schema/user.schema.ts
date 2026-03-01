import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/common/enums/role.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ type: [String], enum: Role, default: [Role.USER ]})
    role: Role[]    
}

export const UserSchema = SchemaFactory.createForClass(User)