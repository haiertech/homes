import {
  Column,
  CreateDateColumn,
  Entity,
  getRepository,
  Index,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm'
import { Comment } from './Comment'
import * as types from '@/types'
import { PapyrEntity } from './PapyrEntity'
import {
  DbAwareColumn,
  DbAwarePGC,
  sanitizeConditions,
} from '../utilities'

@Entity()
export class Blog extends PapyrEntity {
  @DbAwarePGC()
  id!: string

  @Column({ default: '' })
  title!: string

  @Column({ default: '' })
  @Index()
  slug!: string

  @DbAwareColumn({ type: 'text' })
  content!: string

  @Column({ default: '' })
  tags!: string

  @Column({ default: '' })
  media!: string

  @Column({ default: false })
  isPublished!: boolean

  @Column({ nullable: true })
  publishedAt?: Date

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments!: Partial<Comment[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  async toModel(): Promise<types.Blog> {
    const commentRepo = getRepository<Comment>('Comment')
    const commentEntities = await commentRepo.find({
      where: sanitizeConditions({
        blogId: this.id,
      }),
      order: { createdAt: 'DESC' },
    })
    const comments: types.Comment[] = []
    for (const comment of commentEntities) {
      comments.push(await comment.toModel())
    }

    return {
      id: this.id.toString(),
      title: this.title,
      tags: this.tags.split(',').map((tag) => tag.trim()),
      slug: this.slug,
      media: this.media,
      content: this.content,
      isPublished: this.isPublished,
      comments,
      publishedAt: this.publishedAt
        ? new Date(this.publishedAt)
        : undefined,
      updatedAt: new Date(this.updatedAt),
      createdAt: new Date(this.createdAt),
    }
  }

  static async saveFromModel(blog: types.Blog): Promise<types.Blog> {
    const blogRepo = getRepository<Blog>('Blog')
    let foundBlog

    if (blog.id) {
      foundBlog = await blogRepo.findOne({
        where: sanitizeConditions({
          id: blog.id,
        }),
      })
    }

    if (!foundBlog) {
      foundBlog = blogRepo.create()
    }

    foundBlog.title = blog.title
    foundBlog.slug = blog.slug
    foundBlog.tags = blog.tags.join(', ')
    foundBlog.media = blog.media
    foundBlog.content = blog.content || ''
    foundBlog.isPublished = blog.isPublished

    foundBlog.publishedAt =
      blog.isPublished && !blog.publishedAt
        ? new Date()
        : blog.publishedAt

    foundBlog = await foundBlog.save()

    return await foundBlog.toModel()
  }
}
