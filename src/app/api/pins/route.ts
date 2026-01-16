import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Pin } from "@/models/Pin";
import { auth } from "@/lib/auth"; // your Better Auth server helper

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
        }

        const {
            image = "",
            description = "",
            category = "",
            board = "",
            tags = "",
        } = body;

        if (!image || !description || !category || !board) {
            return NextResponse.json(
                { message: "Image, description, category and board are required" },
                { status: 400 }
            );
        }

        const pin = await Pin.create({
            userId,
            image,
            description,
            category,
            board,
            tags: tags
                ? String(tags)
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
        });

        return NextResponse.json(
            {
                message: "Pin created",
                pin: {
                    id: pin._id,
                    image: pin.image,
                    description: pin.description,
                    board: pin.board,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Create pin error:", err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
