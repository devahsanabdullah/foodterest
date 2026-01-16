import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Pin } from "@/models/Pin";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = 4;
    const skip = (page - 1) * limit;

    const [pins, total] = await Promise.all([
      Pin.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Pin.countDocuments(),
    ]);

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
      pins,
    });
  } catch (err) {
    console.error("Feed error:", err);
    return NextResponse.json(
      { message: "Failed to load feed" },
      { status: 500 }
    );
  }
}
