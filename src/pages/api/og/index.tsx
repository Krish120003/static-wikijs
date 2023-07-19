import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { title } from "process";
import { client } from "~/util/wikiClient";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const hasTitle = searchParams.has("title");

  if (!hasTitle) {
    return new Response("Missing required query params", {
      status: 400,
    });
  }

  const title = searchParams.get("title")?.slice(0, 100);
  const description = searchParams.get("description")?.slice(0, 300);
  const lastUpdated = searchParams.get("lastUpdated")?.slice(0, 100);
  const author = searchParams.get("author")?.slice(0, 100);

  return new ImageResponse(
    (
      // Modified based on https://tailwindui.com/components/marketing/sections/cta-sections
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
        tw="p-16"
      >
        <div tw="flex flex-col">
          <h1 tw="text-6xl font-black">{title}</h1>
          <p tw="text-lg">{description}</p>
        </div>
        <footer tw="flex flex-col text-xl">
          {lastUpdated || author ? (
            <p tw="text-gray-500 m-0">
              Last Updated {lastUpdated + " "}
              {author && "by " + author}
            </p>
          ) : null}
          <p tw="m-0">McMaster CS Wiki</p>
        </footer>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
