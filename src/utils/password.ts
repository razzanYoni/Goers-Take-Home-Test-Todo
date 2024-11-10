import * as argon2 from "argon2";
import { ErrorType, StandardError } from "../errors/standard-error";

const hashPassword = async (plainPassword: string): Promise<string> => {
  try {
    return await argon2.hash(plainPassword);
  } catch (error) {
    throw new StandardError(ErrorType.PASSWORD_HASH_FAILURE);
  }
};

const isPasswordValid = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  try {
    return argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    throw new StandardError(ErrorType.PASSWORD_VERIFICATION_FAILURE);
  }
};

export { hashPassword, isPasswordValid };
