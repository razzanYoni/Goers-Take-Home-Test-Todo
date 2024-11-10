import prismaClient from '../cores/db';
import { ErrorType, StandardError } from '../errors/standard-error';

const getUserProfile = async (userId: number) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: Number(userId),
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (!user) {
    throw new StandardError(ErrorType.USER_NOT_FOUND);
  }

  return user;
}

export { getUserProfile };