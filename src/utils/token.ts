import jwt from "jsonwebtoken";
import { ErrorType, StandardError } from "../errors/standard-error";
import * as crypto from "crypto";

const generateFingerprint = async (numberOfBytes: number): Promise<string> => {
  const randomBytes: Buffer = crypto.randomBytes(numberOfBytes);
  return randomBytes.toString("hex");
};

const hashFingerprint = async (fgp: string): Promise<string> => {
  const hash: crypto.Hash = crypto.createHash("sha256");
  hash.update(fgp, "utf8");
  return hash.digest("hex");
};

const generateAccessTokenAndFingerprint = async (data: {
  userId: number,
  username: string,
}) => {
  try {
    const fingerprint: string = await generateFingerprint(64);
    const hashedFingerprint: string = await hashFingerprint(fingerprint);

    return {
      accessToken: jwt.sign(
        {
          uid: data.userId,
          usr: data.username,
          fgp: hashedFingerprint, // User hashed fingerprint
        },
        process.env.JWT_SHARED_SECRET as string,
        {
          algorithm: "HS256", // Only use HS256 to generate JWTs
          expiresIn: "60m", // The token expires 60 minutes
          notBefore: "0ms", // The token is valid right away
          issuer: "Blog REST Service",
        },
      ),
      fingerprint: fingerprint,
    };
  } catch (error) {
    throw new StandardError(ErrorType.ACCESS_TOKEN_GENERATION_FAILURE);
  }
};

export { generateAccessTokenAndFingerprint, hashFingerprint };
