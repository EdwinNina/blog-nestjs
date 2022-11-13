import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FilesModule } from 'src/files/files.module';
import { TagsModule } from 'src/tags/tags.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([
      Post
    ]),
    TagsModule,
    FilesModule,
    AuthModule,
    RolesModule
  ]
})
export class PostModule {}
