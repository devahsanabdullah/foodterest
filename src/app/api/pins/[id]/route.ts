import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Pin } from "@/models/Pin";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid pin id" },
        { status: 400 }
      );
    }

    const pin = await Pin.findById(id).lean();

    if (!pin) {
      return NextResponse.json(
        { message: "Pin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pin });
  } catch (err) {
    console.error("Pin detail error:", err);
    return NextResponse.json(
      { message: "Failed to load pin" },
      { status: 500 }
    );
  }
}
