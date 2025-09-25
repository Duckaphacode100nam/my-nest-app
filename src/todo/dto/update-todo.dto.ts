import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'])
  status?: string;
}
