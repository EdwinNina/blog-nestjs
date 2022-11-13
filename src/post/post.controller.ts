import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, ParseUUIDPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ActiveRoles } from '../auth/interfaces/active-roles.interface';

@Controller('post')
export class PostController {

  constructor(private readonly postService: PostService) {}

  @UseGuards( AuthGuard() )
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        exceptionFactory(error) {
          throw new BadRequestException("The image's post is required");
        },
        validators: [
          new FileTypeValidator({
            fileType: 'png|jpg|jpeg',
          })
        ]
      })
    ) image: Express.Multer.File,
  ) {
    return this.postService.create(createPostDto, image, user);
  }

  @Auth(ActiveRoles.user, ActiveRoles.blogger )
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.postService.findAll(paginationDto, user);
  }

  @Get(':query')
  findOne(@Param('query') query: string) {
    return this.postService.findOne(query);
  }

  @UseGuards( AuthGuard() )
  @Patch(':id')
  @UseInterceptors( FileInterceptor('image'))
  update(
    @Param('id') id: string, 
    @Body() updatePostDto: UpdatePostDto,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new FileTypeValidator({ fileType: 'jpg|jpeg|png'})
        ]
      })
    ) image: Express.Multer.File
  ) {
    return this.postService.update(id, updatePostDto, image, user);
  }

  @UseGuards( AuthGuard() )
  @Patch('/changeStatus/:id')
  changeStatus(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return this.postService.changeStatus(id, user);
  }

  @UseGuards( AuthGuard() )
  @Delete(':id')
  deletePost(
    @Param() id: string,
    @GetUser() user: User,
  ){
    this.postService.deletePost(id, user)
  }
}
