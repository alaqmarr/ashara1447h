import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, mapUrl, embed, latitude, longitude } = await req.json();
    const createLocation = await prisma.centres.create({
      data: {
        name,
        mapUrl,
        embed,
        latitude : parseFloat(latitude), // Ensure latitude is a float
        longitude : parseFloat(longitude), // Ensure longitude is a float
      },
    });
    return NextResponse.json({
      message: "Cntre created successfully",
      data: createLocation,
    });
  } catch (error: any) {
    console.error("Error creating centre:", error);
    return NextResponse.json(
      { message: "Failed to create centre", error: error.message },
      { status: 500 }
    );
  }
}
