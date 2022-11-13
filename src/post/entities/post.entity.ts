import { User } from "src/auth/entities/user.entity";
import { Category } from "src/category/entities/category.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, BeforeInsert, BeforeUpdate, ManyToMany, JoinTable } from "typeorm";

@Entity('posts')
export class Post {

   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column('varchar', { length: 150, unique: true })
   title: string;

   @Column('varchar', { length: 150, unique: true })
   slug: string;
   
   @Column('text')
   extract: string;

   @Column('text')
   description: string;

   @Column('varchar', { length: 150 })
   image: string;

   @Column('boolean', { default: true })
   status: boolean;

   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
   created_at: Date;

   @ManyToOne(
      () => Category,
      (category) => category.posts,
      { eager: true }
   )
   category: Category;

   @ManyToOne(
      () => User,
      (user) => user.post,
      { eager: true }
   )
   user: User

   @JoinTable({
      name: 'posts_tags'
   })
   @ManyToMany(
      () => Tag,
      (tag) => tag.posts,
   )
   tags: Tag[]

   @BeforeInsert()
   checkInputsInsert(){
      this.title = this.title.toLowerCase()
      this.slug = this.title.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(' ', '-')
   }

   @BeforeUpdate()
   checkInputsUpdate(){
      this.checkInputsInsert()
   }
}
