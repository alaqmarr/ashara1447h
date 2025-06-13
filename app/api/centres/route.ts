import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const centres = await prisma.centres.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      centres: centres,
    });
  } catch (error: any) {
    console.error("Error fetching centres:", error);
    return NextResponse.json(
      { message: "Failed to fetch centres", error: error.message },
      { status: 500 }
    );
  }
}
