import { expect } from 'chai'
import axios from 'axios'
import keys from '../../config/keys'
import { Post } from '@/types'
const { rootURL, test } = keys

const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${test.token}`,
  },
}

const post = {
  title: 'Mocha Test Post',
  content: 'This is some test post content.',
  tags: 'test, post',
  isPublished: true,
  media: 'some-picture.jpg',
}

describe('/api/posts', () => {
  it('creates and returns a post', async () => {
    const { data: created, status } = await axios.post(
      `${rootURL}/api/posts`,
      post,
      axiosConfig
    )

    expect(status).to.equal(200) &&
      expect(created.title).to.equal(post.title) &&
      expect(created.content).to.equal(post.content) &&
      expect(created.media).to.equal(post.media) &&
      expect(created.tags).to.be.an('array')
  }).timeout(10000)

  it('returns an array of all posts', async () => {
    const { data: posts, status } = await axios.get(
      `${rootURL}/api/posts`,
      axiosConfig
    )

    expect(status).to.equal(200) && expect(posts).to.be.an('array')
  }).timeout(10000)

  describe('/published', () => {
    it('returns an array of only published posts', async () => {
      const { data: posts, status } = await axios.get(
        `${rootURL}/api/posts/published`
      )
      let allArePublished = true
      posts.forEach((found: Post) => {
        if (!found.isPublished) allArePublished = false
      })

      expect(status).to.equal(200) &&
        expect(posts).to.be.an('array') &&
        expect(allArePublished).to.equal(true)
    }).timeout(10000)
  })

  describe('/[id]', () => {
    it('gets a post by its slug', async () => {
      const { data: found, status } = await axios.get(
        `${rootURL}/api/posts/mocha-test-post`
      )

      expect(status).to.equal(200) &&
        expect(found.title).to.equal(post.title) &&
        expect(found.content).to.equal(post.content) &&
        expect(found.media).to.equal(post.media) &&
        expect(found.tags).to.be.an('array')
    }).timeout(10000)

    it('returns an updated post', async () => {
      const { data: found } = await axios.get(
        `${rootURL}/api/posts/mocha-test-post`
      )
      const updatedPost = {
        ...found,
        content: 'This is updated test content.',
      }
      const { data: updated, status } = await axios.put(
        `${rootURL}/api/posts/${found.id}`,
        updatedPost,
        axiosConfig
      )

      expect(status).to.equal(200) &&
        expect(updated.title).to.equal(updatedPost.title) &&
        expect(updated.content).to.equal(updatedPost.content) &&
        expect(updated.media).to.equal(updatedPost.media) &&
        expect(updated.tags).to.be.an('array')
    }).timeout(10000)

    it('deletes a post', async () => {
      const { data: found } = await axios.get(
        `${rootURL}/api/posts/mocha-test-post`
      )
      const { status } = await axios.delete(
        `${rootURL}/api/posts/${found.id}`,
        axiosConfig
      )

      expect(status).to.equal(200)
    }).timeout(10000)
  })
})
