import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './users.model';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryModule } from 'src/library/library.module';
import { LibraryService } from 'src/library/library.service';
import { LibrarySchema } from 'src/library/library.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    //LibraryModule,
    MongooseModule.forFeature([{ name: 'Library', schema: LibrarySchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersModule, MongooseModule],
})
export class UsersModule {}
