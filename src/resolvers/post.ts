import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql';

import { Post } from '../entities/Post';
import { Context } from '../types';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { em }: Context): Promise<Post[]> {
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id', () => Int) id: number, @Ctx() { em }: Context): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() { em }: Context
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String) title: string,
    @Ctx() { em }: Context
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number, @Ctx() { em }: Context): Promise<boolean> {
    const post = await em.findOne(Post, { id });
    if (!post) return false;
    await em.removeAndFlush(post);
    return true;
  }
}
