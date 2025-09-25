import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto) {
    const newTodo = new this.todoModel(createTodoDto);
    const saved = await newTodo.save();
    return {
      statusCode: 201,
      message: 'Todo created successfully',
      data: saved,
    };
  }

  async findAll(
    search?: string,
    limit: number = 5,
    offset: number = 0,
  ) {
    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      this.todoModel.find(query).skip(offset).limit(limit).exec(),
      this.todoModel.countDocuments(query).exec(),
    ]);

    return {
      statusCode: 200,
      data: {
        items,
        meta: {
          limit,
          offset,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  async findOne(id: string) {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return {
      statusCode: 200,
      data: todo,
    };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const updated = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new NotFoundException('Todo not found');
    return {
      statusCode: 200,
      message: 'Todo updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const deleted = await this.todoModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Todo not found');
    return {
      statusCode: 200,
      message: 'Todo deleted successfully',
      data: deleted,
    };
  }
}
