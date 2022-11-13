import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { handleErrorDbLog } from 'src/common/helpers/error-db-log.helper';
import { FilesService } from 'src/files/files.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private fileService: FilesService,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>
  ) {}

  async create(createPostDto: CreatePostDto, image: Express.Multer.File, user: User) {
    try {
      const [resultImage, tagsIds] = await Promise.all([
        this.fileService.uploadImage(image),
        this.tagsRepository.findBy({ id: In(createPostDto.tags) })
      ])
      const post = this.postRepository.create(createPostDto)
      post.image = resultImage.secure_url
      post.tags = tagsIds
      post.user = user

      const new_post = await this.postRepository.save(post)
      const {tags, ...body} = new_post

      return { ...body }
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit = 10, offset = 0 } = paginationDto
    const { id } = user

    const query_builder = this.postRepository.createQueryBuilder('post')

    const posts = await query_builder.where('post.user = :user', {
      user: id
    })
    .limit(limit)
    .offset(offset)
    .getMany()

    return { data: posts }
  }

  async findOne(query: string) {
    let post: Post;

    if(isUUID(query)){
      post = await this.postRepository.findOneBy({ id: query })
    }else{
      const query_builder = this.postRepository.createQueryBuilder('post')
      post = await query_builder.where('UPPER(post.title) = :title or post.slug =:slug', {
        title: query.toUpperCase(),
        slug: query.toLowerCase()
      })
      .leftJoinAndSelect('post.category', 'category')
      .getOne()
    }

    if(!post) throw new NotFoundException(`Post not found with term ${query}`)

    return post
  }

  async update(id: string, updatePostDto: UpdatePostDto, image: Express.Multer.File, user: User) {
    try {
      const post = await this.postRepository.preload({id, ...updatePostDto, user});

      if(!post) throw new NotFoundException(`Post not found with id: ${id}`)

      if(image){
        const [upload, remove] = await Promise.all([
          this.fileService.uploadImage(image),
          this.fileService.deleteImage(post.image)
        ])
        post.image = upload.secure_url
        if(!remove) throw new BadRequestException("Hubo un error al remover la imagen del almacenamiento");
      }

      return await this.postRepository.save(post)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  private async getPostUser(id: string, user: User){
    const query_builder = await this.postRepository.createQueryBuilder('post')

    const post = await query_builder.where('post.id = :id AND post.user = :user', {
      id,
      user: user.id
    }).getOne()

    if(!post) throw new NotFoundException(`Post not found with id ${id} and user ${user.id}`);

    return post
  }

  async changeStatus(id: string, user: User) {
    try {
      const post = await this.getPostUser(id, user)
      post.status = !post.status
      await this.postRepository.update(id, post)
      return {
        id: post.id,
        status: post.status
      }
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async deletePost(id: string, user: User){
    try {
      const post = await this.getPostUser(id, user)
      const [remove] = await Promise.all([
        this.fileService.deleteImage(post.image),
        this.postRepository.remove(post)
      ])
      if(!remove) throw new BadRequestException("Hubo un error al remover la imagen del almacenamiento");
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
