import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, centreId } = await req.json();
    const createLocation = await prisma.qr.create({
      data: {
        name,
        centreId,
      },
    });
    return NextResponse.json({
      message: "Location created successfully",
      data: createLocation,
    });
  } catch (error: any) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { message: "Failed to create location", error: error.message },
      { status: 500 }
    );
  }
}
