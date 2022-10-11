import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/users.model';
import { System, SystemDocument } from './system.model';

@Injectable()
export class SystemService {
  constructor(
    @InjectModel('System') private readonly systemModel: Model<SystemDocument>,
    @InjectModel('User') private readonly usersModel: Model<UserDocument>,
  ) {}

  async registerBooks(data: System): Promise<System> {
    data._id = data.ISBN;

    const check = await this.systemModel.findById(data._id).exec();

    if (check) {
      throw new HttpException(
        'Book Already Exists, try login',
        HttpStatus.CONFLICT,
      );
    }

    data.available = true;
    const created = new this.systemModel(data);
    return created.save();
  }

  async getAllBooks() {
    return await this.systemModel
      .find()
      .select(['-_id', '-available', '-__v', '-copies'])
      .exec();
  }

  async getBook(Book_name: string) {
    const tep = await this.systemModel.findOne({ book_name: Book_name });
    if (!tep) {
      return 'Book is not there in system';
    }

    const isAvail = await this.available(Book_name);
    const book = await this.systemModel.findOne({ book_name: Book_name });

    //console.log(isAvail, 'avail');
    let data;
    if (isAvail) {
      data = {
        Availablity: 'Available for borrowing',
        copies: `${book.copies} copies are available for borrowing`,
      };
    } else {
      const some = await this.usersModel.find({ book_name: Book_name }).exec();
      //console.log(some, 'books');
      const when = await this.when_returned(some);
      //console.log(when, 'when');
      if (!when) {
        return 'There are no copies with user and there is no copy in system too, please check';
      }
      data = {
        Availablity: 'Not available for borrowing',
        will_be_Returned: `This book will be available after ${when}`,
      };
    }
    return data;
  }

  async available(Book_name: string): Promise<boolean> {
    const book = await this.systemModel
      .findOne({ book_name: Book_name })
      .exec();
    let available = false;
    if (book.copies > 0) {
      await this.systemModel.updateOne(
        { book_name: Book_name },
        { available: true },
      );
      available = true;
      await book.save();
    } else {
      await this.systemModel.updateOne(
        { book_name: Book_name },
        { available: false },
      );
    }

    return available;
  }

  async when_returned(data_arr: any): Promise<string> {
    if (!data_arr) {
      return 'null';
    }

    let op;
    let prev;
    data_arr.forEach((element) => {
      if (!element.deadline) {
        return 'student should have deadline, please check';
      }
      const date1 = element.deadline;

      if (!prev) {
        op = date1;
      } else {
        if (prev <= date1) {
          op = prev;
        } else {
          op = date1;
        }
      }

      prev = element.deadline;
    });

    return op;
  }
}
