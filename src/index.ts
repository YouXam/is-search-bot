import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { toArpa } from "./ip";

type DnsResult = {
    Status: number,
    TC: boolean,
    RD: boolean,
    RA: boolean,
    AD: boolean,
    CD: boolean,
    Question: {
        name: string,
        type: number
    }[],
    Answer: {
        name: string,
        type: number,
        TTL: number,
        data: string
    }[],
}

async function reverseDns(ip: string): Promise<DnsResult> {
    const res = await fetch("https://1.1.1.1/dns-query?" + new URLSearchParams({
        name: toArpa(ip),
        type: "PTR"
    }), {
        headers: {
            accept: "application/dns-json"
        }
    })
    return await res.json();
}

const bots = [
    {
        name: "google",
        suffix: [
            ".googlebot.com",
            ".google.com",
            ".googleusercontent.com"
        ]
    },
    {
        name: "apple",
        suffix: [
            ".applebot.apple.com"
        ]
    },
    {
        name: "baidu",
        suffix: [
            ".baidu.com",
            ".baidu.jp"
        ]
    },
    {
        name: "bing",
        suffix: [
            ".search.msn.com"
        ]
    }
]

export default new Hono<{ Bindings: CloudflareBindings }>().get(
  "/",
  zValidator(
    "query",
    z.object({
      ip: z.string().ip()
    })
  ),
  async (c) => {
    const { ip } = c.req.valid("query")
    const dns = await reverseDns(ip)
    if (!dns?.Answer?.length || dns.Answer.length === 0) {
        return c.json({
            success: true,
            isBot: false,
            name: null,
            comment: "No PTR record found"
        })
    }
    const answer = dns.Answer[0].data
    const bot = bots.find(bot => bot.suffix.some(suffix => answer.endsWith(suffix) || answer.endsWith(suffix + ".")))
    if (bot) {
        return c.json({
            success: true,
            isBot: true,
            name: bot.name,
            comment: "This IP belongs to a known bot"
        })
    }
    return c.json({
        success: true,
        isBot: false,
        name: null,
        comment: "This IP does not belong to a known bot"
    })
  }
);
