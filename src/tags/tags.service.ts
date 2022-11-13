import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { handleErrorDbLog } from 'src/common/helpers/error-db-log.helper';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const category = this.tagRepository.create(createTagDto);
      return await this.tagRepository.save(category)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const tags = await this.tagRepository.find({
      take: limit,
      skip: offset,
    })
    return {
      data: tags
    }
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOneBy({ id })

    if(!tag) throw new NotFoundException('Category not found')

    return tag
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const category = await this.tagRepository.preload({id, ...updateTagDto})

      if(!category) throw new NotFoundException(`Category with id ${id} not found`);

      await this.tagRepository.save(category)

    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async changeStatus(id: string) {
    try {
      const tag = await this.findOne(id)
      tag.status = !tag.status
      await this.tagRepository.update(id, tag)
      return tag
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
