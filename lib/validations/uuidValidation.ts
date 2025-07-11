import z from "zod";

export const isValidUUID = (value: string) => {
  return z.string().uuid().safeParse(value).success;
};
