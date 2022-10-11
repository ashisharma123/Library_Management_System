import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { System, SystemSchema } from './system.model';
import { UserSchema } from 'src/users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'System', schema: SystemSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [SystemService],
  controllers: [SystemController],
  exports: [SystemService, MongooseModule],
})
export class SystemModule {}
