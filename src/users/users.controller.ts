import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.model';
import { UsersService } from './users.service';

@Controller('Student')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async registerBook(@Body() userDto: User) {
    return await this.usersService.register(userDto);
  }

  @Get('query')
  async getBook(@Query('name') name: string) {
    return await this.usersService.getBooks(name);
  }

  @Get('renew/:ISBN')
  async renew(@Param('ISBN') isbn: number, @Query('name') name: string) {
    return await this.usersService.renew(isbn, name);
  }

  @Get('history')
  async history(@Query('name') name: string) {
    return await this.usersService.history(name);
  }
}
