import { type AnnictWorks } from "@/app/types/annict"
import { GET_ANIME_DETAILS } from "@/gql"
import { Hono } from "hono"
import { handle } from "hono/vercel"

export const runtime = "edge"

const app = new Hono().basePath("/api")

const route = app
  .get("/server/misskey", async (c) => {
    const res = await fetch("https://instanceapp.misskey.page/instances.json", {
      next: { revalidate: 60 * 60 * 24 },
    })
    const data = (await res.json()) as { instancesInfos: { url: string }[] }
    const urls = data.instancesInfos.map((instance: { url: string }) => {
      return instance.url
    })
    return c.json(urls)
  })
  .get("annict/:season", async (c) => {
    const res = await fetch("https://api.annict.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${process.env.ANNICT_TOKEN}`,
      },
      body: JSON.stringify(GET_ANIME_DETAILS(c.req.param('season'))),
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const { data } = await res.json()
    return c.json(data.searchWorks.nodes as AnnictWorks)
  })

export const GET = handle(route)
export const POST = handle(route)

export type AppType = typeof route
