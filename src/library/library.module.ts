import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemController } from 'src/system/system/system.controller';
import { System } from 'src/system/system/system.model';
import { SystemModule } from 'src/system/system/system.module';
import { SystemService } from 'src/system/system/system.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { LibraryController } from './library.controller';
import { LibrarySchema } from './library.model';
import { LibraryService } from './library.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Library', schema: LibrarySchema }]),
    SystemModule,
    UsersModule,
  ],
  controllers: [LibraryController],
  providers: [LibraryService, UsersService],
  exports: [LibraryModule, MongooseModule],
})
export class LibraryModule {}
