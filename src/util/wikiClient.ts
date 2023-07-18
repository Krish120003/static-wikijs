import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { env } from "~/env.mjs";
import { PageResponse, pageSchema } from "./queryTypes";
import { z } from "zod";

export const client = new ApolloClient({
  uri: env.WIKIJS_URL + "/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: "Bearer " + env.WIKIJS_KEY,
  },
});

export const getAllPaths = async () => {
  const req = await client.query({
    query: gql`
      query QueryPages {
        pages {
          list {
            id
            path
            title
          }
        }
      }
    `,
  });

  if (req.errors) {
    console.error(req.errors);
    throw new Error("Failed to fetch API");
  }

  const data = req.data as PageResponse<z.infer<typeof pageSchema>>;
  if (!data) {
    throw new Error("Failed to fetch API");
  }

  const paths = data.pages.list
    .map((page) => {
      const parsed = pageSchema.safeParse(page);
      if (parsed.success) {
        return parsed.data;
      }

      return null;
    })
    .filter((page) => page !== null);

  return paths;
};
