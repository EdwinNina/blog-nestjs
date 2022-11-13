import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';
import { CommonModule } from './common/common.module';
import { FilesModule } from './files/files.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CategoryModule,
    PostModule,
    CommonModule,
    FilesModule,
    TagsModule,
    AuthModule,
    RolesModule
  ],
})
export class AppModule {}
