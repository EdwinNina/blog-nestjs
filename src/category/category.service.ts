import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { PaginationDto } from '../common/dto/pagination-dto';
import { handleErrorDbLog } from 'src/common/helpers/error-db-log.helper';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category)
    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    const categories = await this.categoryRepository.find({
      take: limit,
      skip: offset,
    })
    return {
      data: categories
    }
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOneBy({ id })

    if(!category) throw new NotFoundException('Category not found')

    return category
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.preload({id, ...updateCategoryDto})

      if(!category) throw new NotFoundException(`Category with id ${id} not found`);

      await this.categoryRepository.save(category)

    } catch (error) {
      handleErrorDbLog(error)
    }
  }

  async changeStatus(id: string) {
    try {
      const category = await this.findOne(id)
      category.status = !category.status
      await this.categoryRepository.update(id, category)
      return category
    } catch (error) {
      handleErrorDbLog(error)
    }
  }
}
