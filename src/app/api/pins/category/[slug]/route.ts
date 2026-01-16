import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Pin } from "@/models/Pin";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = 50;
    const skip = (page - 1) * limit;

    if (!slug) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    const query = { category: slug };

    const [pins, total] = await Promise.all([
      Pin.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Pin.countDocuments(query),
    ]);

    return NextResponse.json({
      category: slug,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
      pins,
    });
  } catch (err) {
    console.error("Category pins error:", err);
    return NextResponse.json({ message: "Failed to load category pins" }, { status: 500 });
  }
}
