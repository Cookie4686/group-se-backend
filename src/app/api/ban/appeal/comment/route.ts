import dbConnect from "@/libs/db/dbConnect";
import BanAppeal from "@/libs/db/models/BanAppeal";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  await dbConnect();
  try {
    console.log(data);
    const banAppeal = await BanAppeal.findByIdAndUpdate(
      data.id,
      { $push: { comment: data.comment } },
      { new: true, runValidators: true }
    );
    console.log(banAppeal);
    return NextResponse.json({ data: banAppeal });
  } catch (err) {
    console.error(err);
  }
  return NextResponse.json({ success: false }, { status: 500 });
}
