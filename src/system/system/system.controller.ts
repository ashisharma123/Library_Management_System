import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { System } from './system.model';
import { SystemService } from './system.service';

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Post('registration')
  async registerUser(@Body() bookDto: System) {
    return await this.systemService.registerBooks(bookDto);
  }

  @Get()
  async getAllBooks() {
    return await this.systemService.getAllBooks();
  }

  @Get('query')
  async getBook(@Query('book') query: string) {
    return await this.systemService.getBook(query);
  }
}
