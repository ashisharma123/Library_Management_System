import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { System } from 'src/system/system/system.model';
import { SystemService } from 'src/system/system/system.service';
import { Library } from './library.model';
import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(
    private libraryService: LibraryService,
    private systemService: SystemService,
  ) {}

  @Post('register')
  async register(@Body() libraryDto: Library) {
    return await this.libraryService.register(libraryDto);
  }

  @Post('registerToSystem')
  async registerToSystem(@Body() systemDto: System) {
    return await this.systemService.registerBooks(systemDto);
  }

  @Get('student')
  async getDetails(@Query('name') name: string) {
    return await this.libraryService.getDetails(name);
  }

  @Post('return')
  async returnBook(@Body() libraryDto: Library) {
    return await this.libraryService.returnBook(libraryDto);
  }

  @Get('history')
  async history(@Query('name') name: string) {
    return await this.libraryService.history(name);
  }
}
