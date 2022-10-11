import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LibraryDocument = Library & Document;

@Schema({ timestamps: true })
export class Library {
  @Prop()
  _id: string;

  @Prop({ required: true })
  ISBN: number;

  @Prop()
  book_name: string;

  @Prop({ required: true })
  student_name: string;

  @Prop()
  borrowed: boolean;

  @Prop()
  returned: boolean;

  @Prop()
  borrowed_time: string;

  @Prop()
  returned_time: string;

  @Prop()
  renewed: boolean;

  @Prop()
  return_time: string;
}

export const LibrarySchema = SchemaFactory.createForClass(Library);
