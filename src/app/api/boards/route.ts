import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import { Board } from "@/models/Board";
import { auth } from "@/lib/auth";

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
            name = "",
            description = "",
            category = "",
            collaborators = "",
            isSecret = false,
            hasMap = false,
        } = body;

        if (!name.trim()) {
            return NextResponse.json({ message: "Board name is required" }, { status: 400 });
        }
        if (!category.trim()) {
            return NextResponse.json({ message: "Category is required" }, { status: 400 });
        }

        // Optional: avoid duplicate board names per user
        const exists = await Board.findOne({ userId, name: name.trim() });
        if (exists) {
            return NextResponse.json(
                { message: "You already have a board with this name" },
                { status: 409 }
            );
        }

        const board = await Board.create({
            userId,
            name: name.trim(),
            description: description.trim() || undefined,
            category: category.trim(),
            collaborators: collaborators
                ? collaborators.split(",").map((v: string) => v.trim()).filter(Boolean)
                : [],
            isSecret: Boolean(isSecret),
            hasMap: Boolean(hasMap),
        });

        return NextResponse.json(
            {
                message: "Board created",
                board: {
                    id: board._id,
                    name: board.name,
                    category: board.category,
                    isSecret: board.isSecret,
                    createdAt: board.createdAt,
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Create board error:", err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    await connectDB();

    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const boards = await Board.find({ userId })
        .sort({ createdAt: -1 })
        .select("_id name isSecret");

    return NextResponse.json({ boards });
}
