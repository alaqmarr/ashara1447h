import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, number, teamId, email } = await req.json();
        const createLocation = await prisma.member.create({
            data: {
                name,
                number,
                email,
                teamId, // Assuming teamId is the ID of the team to which this member belongs
            },
        });
        return NextResponse.json({
            message: "Member created successfully",
            data: createLocation,
        });
    } catch (error: any) {
        console.error("Error creating member:", error);
        return NextResponse.json(
            { message: "Failed to create member", error: error.message },
            { status: 500 }
        );
    }
}
