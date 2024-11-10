import { Prisma } from '@prisma/client';

import prismaClient from '../cores/db';
import { ErrorType, StandardError } from '../errors/standard-error';
import { hashPassword, isPasswordValid } from '../utils/password';
import { generateAccessTokenAndFingerprint } from '../utils/token';
import { loginSchema, signupSchema } from '../validation/auth-validation';
import { validate } from '../validation/validation';

const signup = async (
  data: Prisma.UserCreateInput,
): Promise<{ userId: number; username: string }> => {
  validate(signupSchema, data);

  const user = await prismaClient.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (user) {
    throw new StandardError(ErrorType.USERNAME_ALREADY_EXISTS);
  }

  const hashedPassword: string = await hashPassword(data.password);

  const userCreated = await prismaClient.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
    },
  });

  return {
    userId: userCreated.id,
    username: userCreated.username,
  };
};

const login = async (data: { username: string; password: string }) => {
  validate(loginSchema, data);

  const user = await prismaClient.user.findUnique({
    where: {
      username: data.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    }
  });

  if (!user || !(await isPasswordValid(user.password, data.password))) {
    throw new StandardError(ErrorType.INCORRECT_USERNAME_OR_PASSWORD);
  }

  return await generateAccessTokenAndFingerprint({
    userId: user.id,
    username: user.username,
  });
};



export { signup, login };
