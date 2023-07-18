import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { env } from "~/env.mjs";

const client = new ApolloClient({
  uri: env.WIKIJS_URL + "/graphql",
  cache: new InMemoryCache(),
  headers: {
    Authorization: "Bearer " + env.WIKIJS_KEY,
  },
});

export default client;
