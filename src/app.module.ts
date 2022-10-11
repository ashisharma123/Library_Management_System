import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemModule } from './system/system/system.module';
import { UsersModule } from './users/users.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [
    SystemModule,
    MongooseModule.forRoot('mongodb://localhost/LibraryMS'),
    UsersModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
