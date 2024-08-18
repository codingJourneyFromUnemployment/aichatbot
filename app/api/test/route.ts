export const runtime = "edge";

import { NextResponse } from "next/server";
import { dataService } from "@/services/dataService";

export async function POST(req: Request) {
  try {
    const { dolphinKey, userMessage } = await req.json();

    console.log("userMessage:", userMessage);
    console.log("start fetching role setup");
    const reply = await dataService.fetchRoleSetup(dolphinKey, userMessage);

    return NextResponse.json(reply);
  } catch (error) {
    console.error("Error fetching role setup:", error);

    // 返回一个错误响应
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
