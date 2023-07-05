import { z } from "zod";

export const pageSchema = z.object({
  id: z.number(),
  path: z.string(),
  title: z.string(),
});

export interface PageResponse<T> {
  pages: {
    __typemame: string;
    list: T[];
  };
}
