import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, assignedHelpline } = await req.json();
    const createLocation = await prisma.team.create({
      data: {
        name,
        assignedHelpline,
      },
    });
    return NextResponse.json({
      message: "Team created successfully",
      data: createLocation,
    });
  } catch (error: any) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { message: "Failed to create team", error: error.message },
      { status: 500 }
    );
  }
}
