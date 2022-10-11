import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: string;

  @Prop()
  ISBN: number;

  @Prop()
  book_name: string;

  @Prop()
  student_name: string;

  @Prop()
  student_id: string;

  @Prop()
  renew: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  deadline: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
