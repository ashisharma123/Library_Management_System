import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Console } from 'console';
import { Model } from 'mongoose';
import { LibraryDocument } from 'src/library/library.model';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Library')
    private readonly libraryModel: Model<LibraryDocument>,
  ) {}

  async register(userDto: User) {
    const check = await this.userModel.findById(userDto._id).exec();

    if (check) {
      throw new HttpException(
        'Student is there with this ID',
        HttpStatus.CONFLICT,
      );
    }

    userDto.renew = false;

    const created = new this.userModel(userDto);
    return created.save();
  }

  async getBooks(name: string) {
    const book_arr = await this.userModel
      .find({ student_name: name })
      .select(['-student_id', '-student_name', '-_id', '-__v'])
      .exec();

    const date = book_arr[0].createdAt;
    console.log(date);
    console.log(date.getDate() + 30);

    return book_arr;
  }

  async renew(isbn: number, name: string) {
    const student = await this.userModel
      .findOne({ ISBN: isbn, student_name: name })
      .exec();
    if (!student) {
      throw new HttpException('Student is not there', HttpStatus.CONFLICT);
    }
    //console.log(student);
    if (student.renew === true) {
      return 'The student has already renewed this book';
    }

    const re_date = student.createdAt;
    console.log(re_date, 'createdat');
    re_date.setDate(re_date.getDate() + 60);
    console.log(re_date, 'recreatedat');
    const update = await this.userModel.findOneAndUpdate(
      { ISBN: isbn, student_name: name },
      { $set: { renew: true, deadline: re_date.toDateString() } },
      { new: true },
    );

    const update1 = await this.libraryModel.findOneAndUpdate(
      {
        ISBN: isbn,
        student_name: name,
        returned: false,
      },
      {
        $set: {
          renewed: true,
          return_time: re_date.toDateString(),
        },
      },
      {
        new: true,
      },
    );
    console.log(update1);
    return update.save();
  }

  async history(name: string) {
    //need to make this history function
    const data = await this.libraryModel
      .find({ student_name: name })
      .select(['-__v', '-_id', '-createdAt', '-updatedAt'])
      .exec();

    if (!data) {
      return 'Student does not have history of borrowing';
    }

    return data;
  }
}
