import dbConnect from "@/libs/db/dbConnect";
import BanAppeal from "@/libs/db/models/BanAppeal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  await dbConnect();
  try {
    const banAppeal = await BanAppeal.insertOne(data);
    return NextResponse.json({ data: banAppeal });
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({ success: false }, { status: 500 });
}
