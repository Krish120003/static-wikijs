/* eslint-disable @typescript-eslint/no-explicit-any  */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

import { gql } from "@apollo/client";
import { InferGetStaticPropsType } from "next";
import Sidebar from "~/components/Sidebar";
import { notNull } from "~/util/helpers";
import { client, getAllPaths } from "~/util/wikiClient";
import Head from "next/head";

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});
const markdownItClass = require("@toycode/markdown-it-class");

const mk = require("markdown-it-katex");
md.use(mk);
md.use(require("markdown-it-replace-link"), {
  processHTML: true, // defaults to false for backwards compatibility
  replaceLink: function (link: string, env: any, token: any, htmlToken: any) {
    if (link.startsWith("/images/")) {
      const newL = `https://wiki.egirls.dev${link}`;
      // console.log(newL);
      return newL;
    }
    return link;
  },
});

md.use(markdownItClass, {
  blockquote: "bg-blue-100 border-l-4 border-blue-500 rounded-xl px-4 py-1",
});

const WikiPage: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const content = md.render(props.content);

  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <div className="grid min-h-screen w-full grid-cols-12 bg-red-400">
        <div className="col-span-3 bg-neutral-200">
          <Sidebar paths={props.allPaths} />
        </div>
        <div className="col-span-9 max-h-screen overflow-scroll bg-neutral-100">
          <div className="prose col-span-full m-auto  py-8">
            <h1>{props.title}</h1>
            <p>{props.description}</p>
            <br className="h-2 w-full border border-b-2 border-black bg-black" />
            <article
              className="prose m-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            ></article>
          </div>
        </div>
      </div>
    </>
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

  const allPaths: { path: string; id: number; title: string }[] = (
    await getAllPaths()
  ).filter(notNull);

  return {
    props: {
      ...res.data.pages.singleByPath,
      path,
      allPaths,
    },
  };
}

export async function getStaticPaths() {
  const res = await getAllPaths();

  const paths = res.map((page) => ({
    params: {
      path: page?.path.split("/").filter((p) => p !== ""),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}
