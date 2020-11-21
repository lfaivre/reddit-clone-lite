import { EntityManager } from '@mikro-orm/postgresql';
import argon2 from 'argon2';
import isEmpty from 'lodash/isEmpty';
import toLower from 'lodash/toLower';
import trim from 'lodash/trim';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { COOKIE_NAME } from '../constants';
import { User } from '../entities/User';
import { UserResponse } from '../graphql-types/UserResponse';
import { Context } from '../types';

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
    let newUser;

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: cleanedUsername,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning(`*`);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, prefer-destructuring
      newUser = result[0];
    } catch (error) {
      console.error(error);
    }

    // await em.persistAndFlush(newUser);

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

    /** @todo Fix TS Errors */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, no-param-reassign
    req.session.userID = newUser.id;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
            field: `password`,
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
            field: `password`,
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

    /** @todo Fix TS Error */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    req.session.userID = user.id;

    return { user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: Context): Promise<User | null> {
    /** @todo Fix TS Error */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!req.session || !req.session.userID) {
      return null;
    }

    /** @todo Fix TS Error */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = req.session.userID as number;
    const user = await em.findOne(User, { id });
    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        res.clearCookie(COOKIE_NAME);

        if (error) {
          console.error(error);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
