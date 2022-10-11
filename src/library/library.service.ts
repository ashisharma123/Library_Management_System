import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemDocument } from 'src/system/system/system.model';
import { SystemModule } from 'src/system/system/system.module';
import { SystemService } from 'src/system/system/system.service';
import { User, UserDocument } from 'src/users/users.model';
import { Library, LibraryDocument } from './library.model';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel('Library')
    private readonly libraryModel: Model<LibraryDocument>,
    @InjectModel('System')
    private readonly systemModel: Model<SystemDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  async register(libraryDto: Library) {
    const isbn = libraryDto.ISBN;
    const data = await this.systemModel.findOne({ ISBN: isbn }).exec();

    if (!data) {
      throw new HttpException(
        'book is not there in system',
        HttpStatus.CONFLICT,
      );
    }

    const op = await this.checkIfAllowed(libraryDto.student_name);
    if (op.status == 400) {
      return {
        status: 504,
        message: 'Student already have 10 Books with him',
      };
    }

    if (data.copies <= 0) {
      return {
        message: 'copies are not left',
        returned: `It will be free on this date :  ${data.when_free}`,
      };
    }

    data.copies = data.copies - 1;
    if (data.copies == 0) {
      await this.systemModel.updateOne(
        { ISBN: isbn },
        { $set: { copies: data.copies, available: false } },
      );
    } else {
      await this.systemModel.updateOne(
        { ISBN: isbn },
        { $set: { copies: data.copies } },
      );
    }
    const ret = await data.save();
    console.log(ret, 'return');

    const id = uuidv4();

    const time = new Date();
    const borrowed = time.toDateString();
    time.setDate(time.getDate() + 30);
    const returned = time.toDateString();

    libraryDto._id = id;
    libraryDto.book_name = data.book_name;
    libraryDto.ISBN = data.ISBN;
    libraryDto.borrowed = true;
    libraryDto.borrowed_time = `${borrowed}`;
    libraryDto.return_time = `${returned}`;
    libraryDto.returned = false;
    libraryDto.renewed = false;

    const saveToStudent = await this.saveToStudentData(data, libraryDto);
    console.log(saveToStudent, 'saveToStudent');

    const create = await new this.libraryModel(libraryDto);
    return await create.save();
  }

  async getDetails(name: string) {
    const current_books = await this.libraryModel
      .find({ student_name: name, returned: false })
      .select(['-returned', '-returned_time', '-__v', '-_id', '-student_name'])
      .exec();

    //
    //const deadline = new Date(Number())
    const data = {
      'Student Name': name,
      'Borrowed books': current_books,
    };

    return data;
  }

  async saveToStudentData(data: any, libraryDto: Library) {
    //console.log('enter');

    const user = new User();
    user._id = libraryDto._id;
    user.book_name = data.book_name;
    user.ISBN = libraryDto.ISBN;
    user.student_name = libraryDto.student_name;
    user.renew = true;
    user.deadline = libraryDto.return_time;

    const create = await this.usersService.register(user);

    //console.log('exit');
    return await create.save();
  }

  async checkIfAllowed(name: string) {
    const data = await this.userModel.find({ student_name: name }).exec();

    if (data.length >= 10) {
      return {
        status: 500,
        message: 'Student already have 10 Books',
      };
    }

    return {
      status: 200,
      message: 'student can have the book',
    };
  }

  async returnBook(libraryDto: Library) {
    const isbn = libraryDto.ISBN;
    const data = await this.systemModel.findOne({ ISBN: isbn }).exec();

    if (!data) {
      throw new HttpException(
        'book is not there in system',
        HttpStatus.CONFLICT,
      );
    }

    data.copies = data.copies + 1;

    await this.systemModel.updateOne(
      { ISBN: isbn },
      { $set: { copies: data.copies, available: true } },
    );

    const ret = await data.save();
    console.log(ret, 'return');

    const create = await this.libraryModel.findOneAndUpdate(
      {
        ISBN: isbn,
        student_name: libraryDto.student_name,
      },
      { $set: { returned: true, returned_time: new Date().toDateString() } },
    );

    if (!create) {
      return 'student is not registered with library, please check';
    }

    const del = await this.userModel.findOneAndDelete({
      ISBN: isbn,
      student_name: libraryDto.student_name,
    });
    return await create.save();
    //console.log(op);
  }

  async history(name: string) {
    const data = await this.libraryModel
      .find({ student_name: name })
      .select(['-__v', '-_id'])
      .exec();

    if (!data) {
      return 'Student does not have history of borrowing';
    }

    return data;
  }
}
