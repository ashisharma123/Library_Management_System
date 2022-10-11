import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemDocument = System & Document;

@Schema()
export class System {
  @Prop()
  _id: number;

  @Prop({ required: true })
  ISBN: number;

  @Prop({ required: true })
  book_name: string;

  @Prop({ required: true })
  copies: number;

  @Prop()
  when_free: number;

  @Prop()
  available: boolean;
}

export const SystemSchema = SchemaFactory.createForClass(System);
