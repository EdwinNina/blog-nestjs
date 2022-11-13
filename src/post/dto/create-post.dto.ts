import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Category } from '../../category/entities/category.entity';


export class CreatePostDto {

   @IsNotEmpty()
   @IsString()
   title: string;

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsNotEmpty()
   @IsString()
   extract: string;

   @IsNotEmpty()
   @IsUUID()
   category: Category;

   @IsUUID(4, { each: true})
   @IsArray()
   tags: Tag[]
}
