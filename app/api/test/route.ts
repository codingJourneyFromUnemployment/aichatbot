import { NextResponse } from "next/server";
import { chatWithDolphin } from "../../../utils/chatwith-dolphin";

export async function POST(req: Request) {
  try {
    console.log("Received headers:", Object.fromEntries(req.headers));
    let contentType = req.headers.get("content-type");
    console.log("Content-Type from header:", contentType);

    let body;
    const text = await req.text();
    console.log("Received body:", text);

    // 检查是否收到的是特殊格式的请求
    if (text.startsWith("Content-Type: application/json")) {
      // 从请求体中提取实际的 JSON 数据
      const jsonStart = text.indexOf("{");
      const jsonPart = text.slice(jsonStart);
      try {
        body = JSON.parse(jsonPart);
        contentType = "application/json";
      } catch (e) {
        console.error("Failed to parse JSON from body:", e);
      }
    } else if (contentType && contentType.includes("application/json")) {
      try {
        body = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    }

    console.log("Parsed body:", body);

    if (!body || !body.userMessage) {
      return NextResponse.json({
        reply: "Please provide a valid JSON body with a userMessage",
        status: 400,
      });
    }

    const reply = await chatWithDolphin(body.userMessage);
    console.log("Reply from chatWithDolphin:", reply);

    const response = NextResponse.json({
      reply,
      status: 200,
    });

    console.log("Sending response:", await response.clone().text());
    return response;
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({
      reply:
        "Internal Server Error, Failed to get response from OpenRouter API",
      status: 500,
    });
  }
}