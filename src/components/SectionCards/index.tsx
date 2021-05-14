import { Post } from '@/types'
import React from 'react'
import Link from 'next/link'
import { Media } from '@/components'
import styles from './SectionCards.module.scss'

type Props = {
  className?: string
  posts: Post[]
  contentLength?: number
  emptyMessage?: string
  perRow?: number
  title?: string
  path?: string
  readMore?: boolean
  clickableMedia?: boolean

  // Section hooks
  beforeTitle?: Function
  afterTitle?: Function
  beforePostList?: Function
  afterPostList?: Function
  beforePosts?: Function
  afterPosts?: Function

  // Post hooks
  beforePostTitle?: Function
  afterPostTitle?: Function
  beforePostMedia?: Function
  afterPostMedia?: Function
  beforePostContent?: Function
  afterPostContent?: Function
  beforePostLink?: Function
  afterPostLink?: Function
}

const SectionCards: React.FC<Props> = (props) => {
  const {
    className,
    posts,
    contentLength,
    emptyMessage,
    perRow,
    title,
    path,
    readMore,
    clickableMedia,

    // Section hooks
    beforeTitle = () => null,
    afterTitle = () => null,
    beforePostList = () => null,
    afterPostList = () => null,
    beforePosts = () => null,
    afterPosts = () => null,

    // Post hooks
    beforePostTitle = () => null,
    afterPostTitle = () => null,
    beforePostMedia = () => null,
    afterPostMedia = () => null,
    beforePostContent = () => null,
    afterPostContent = () => null,
    beforePostLink = () => null,
    afterPostLink = () => null,
  } = props

  const renderReadMore = (post: Post) => {
    if (readMore) {
      const readMorePath = path ? path : 'posts'

      return (
        <Link
          href={`/${readMorePath || 'posts'}/[id]`}
          as={`/${readMorePath || 'posts'}/${post.slug || post.id}`}
        >
          <a className={styles.link}>Read More</a>
        </Link>
      )
    }
  }

  const renderPublishSection = (published: boolean) => {
    if (!published) {
      return (
        <p>
          <em>Not published</em>
        </p>
      )
    }
  }

  const renderMediaSection = (post: Post) => {
    if (post.media) {
      return (
        <div className={styles.imageWrapper}>
          <Media
            className={styles.image}
            src={post.media}
            alt={post.title}
            clickable={clickableMedia}
          />
        </div>
      )
    }
  }

  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <div className={styles.empty}>
          <h3 className="heading-tertiary">
            {emptyMessage ? emptyMessage : ''}
          </h3>
        </div>
      )
    }

    // Set defaults for characterCount
    const characterCount = contentLength || 300

    return posts.map((post) => {
      let postContent =
        post.content && post.content.length >= characterCount
          ? `${post.content
              .substring(0, characterCount)
              .trim()} . . .`
          : post.content

      return (
        <li key={post.id} className={styles.card}>
          {beforePostTitle(post)}
          <h3 className="heading-tertiary">{post.title}</h3>
          {afterPostTitle(post)}

          {renderPublishSection(post.isPublished)}

          {beforePostMedia(post)}
          {renderMediaSection(post)}
          {afterPostMedia(post)}

          {beforePostContent(post)}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: postContent }}
          />
          {afterPostContent(post)}

          {beforePostLink(post)}
          {renderReadMore(post)}
          {afterPostLink(post)}
        </li>
      )
    })
  }

  const listCountClass = perRow
    ? styles[`list${perRow}`]
    : styles.list3

  return (
    <section className={`${className || ''} ${styles.section}`}>
      {beforeTitle()}
      <h2 className={`heading-secondary ${styles.header}`}>
        {title}
      </h2>
      {afterTitle()}

      {beforePostList()}
      <ul className={`${styles.list} ${listCountClass}`}>
        {beforePosts()}
        {renderPosts()}
        {afterPosts()}
      </ul>
      {afterPostList()}
    </section>
  )
}

export default SectionCards
