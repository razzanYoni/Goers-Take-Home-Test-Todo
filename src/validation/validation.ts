import { z } from "zod";
import { ErrorType, StandardError } from "../errors/standard-error";

export const validate = <T extends z.ZodRawShape>(schema: z.ZodObject<T>, data: unknown) => {
	const { error } = schema.safeParse(data);
	if (error) {
		throw new StandardError(ErrorType.INPUT_DATA_NOT_VALID);
	}
}
