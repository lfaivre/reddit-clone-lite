import { Resolver, Ctx, Arg, Mutation, Query } from 'type-graphql';
import argon2 from 'argon2';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import toLower from 'lodash/toLower';

import { User } from '../entities/User';
import { Context } from '../types';
import { UserResponse } from '../graphql-types/UserResponse';

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('username', () => String) username: string,
    @Arg('password', () => String) password: string,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const cleanedUsername = toLower(trim(username));
    if (isEmpty(cleanedUsername)) {
      return {
        errors: [
          {
            field: `username`,
            message: `Invalid username provided`,
          },
        ],
      };
    }

    if (isEmpty(password)) {
      return {
        errors: [
          {
            field: `password`,
            message: `Invalid password provided`,
          },
        ],
      };
    }

    const duplicateUser = await em.findOne(User, { username: cleanedUsername });
    if (duplicateUser) {
      return {
        errors: [
          {
            field: `username`,
            message: `The username "${cleanedUsername}" is unavailable`,
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = em.create(User, { username: cleanedUsername, password: hashedPassword });
    await em.persistAndFlush(newUser);

    if (!req.session) {
      return {
        errors: [
          {
            field: `session`,
            message: `Failed to log in newly created user`,
          },
        ],
      };
    }

    req.session.userID = newUser.id;

    return { user: newUser };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username', () => String) username: string,
    @Arg('password', () => String) password: string,
    @Ctx() { em, req }: Context
  ): Promise<UserResponse> {
    const cleanedUsername = toLower(trim(username));
    if (isEmpty(cleanedUsername)) {
      return {
        errors: [
          {
            field: `username`,
            message: `Invalid username provided`,
          },
        ],
      };
    }

    const user = await em.findOne(User, { username: cleanedUsername });
    if (!user) {
      return {
        errors: [
          {
            field: `username`,
            message: `A user with username "${cleanedUsername}" does not exist`,
          },
        ],
      };
    }

    if (isEmpty(password)) {
      return {
        errors: [
          {
            field: `login`,
            message: `Invalid login credentials provided`,
          },
        ],
      };
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return {
        errors: [
          {
            field: `login`,
            message: `Invalid login credentials provided`,
          },
        ],
      };
    }

    if (!req.session) {
      return {
        errors: [
          {
            field: `session`,
            message: `Failed to access request session information`,
          },
        ],
      };
    }

    req.session.userID = user.id;

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: Context): Promise<User | null> {
    if (!req.session || !req.session.userID) {
      return null;
    }

    const id = req.session.userID as number;
    const user = await em.findOne(User, { id });
    return user;
  }
}
