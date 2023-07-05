/* eslint-disable @typescript-eslint/no-explicit-any  */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { InferGetStaticPropsType } from "next";
import { z } from "zod";
import { env } from "~/env.mjs";
import { PageResponse, pageSchema } from "~/util/queryTypes";

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});

const mk = require("markdown-it-katex");
md.use(mk);

const client = new ApolloClient({
  uri: env.WIKIJS_URL,
  cache: new InMemoryCache(),
  headers: {
    Authorization: "Bearer " + env.WIKIJS_KEY,
  },
});
0;

const WikiPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const content = md.render(props.content);

  return (
    <div className="prose">
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      <br className="h-2 w-full border border-b-2 border-black bg-black" />
      <article
        className="prose m-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
    </div>
  );
};

export default WikiPage;

interface GetStaticParams {
  params: {
    path: string[];
  };
}

export async function getStaticProps({ params }: GetStaticParams) {
  const path = params.path.join("/");

  const query = gql`
    query GetPage($path: String!) {
      pages {
        singleByPath(path: $path, locale: "en") {
          id
          title
          description
          content
        }
      }
    }
  `;

  const res = await client.query<{
    pages: {
      singleByPath: {
        id: string;
        title: string;
        description: string;
        content: string;
      };
    };
  }>({
    query,
    variables: {
      path,
    },
  });

  if (res.errors) {
    throw new Error(JSON.stringify(res.errors));
  }

  return {
    props: {
      ...res.data.pages.singleByPath,
      path,
    },
  };
}

export async function getStaticPaths() {
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
    .filter((page) => page !== null)
    .map((page) => ({
      params: {
        path: page?.path.split("/").filter((p) => p !== ""),
      },
    }));

  return {
    paths,
    fallback: false,
  };
}
