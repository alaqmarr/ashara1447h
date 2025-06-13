import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const list = [
    {
      id: 1,
      name: "AL AQMAR",
      phone: "919618443558",
      channelId: "684a91c04491bfb38c42c7bd",
      channelType: "whatsapp",
    },
    {
      id: 2,
      name: "Aziz",
      phone: "919032795775",
      channelId: "684a91c04491bfb38c42c7bd",
      channelType: "whatsapp",
    },
    {
      id: 3,
      name: "Moiz",
      phone: "916304460780",
      channelId: "684a91c04491bfb38c42c7bd",
      channelType: "whatsapp",
    },
    {
      id: 4,
      name: "Moiz",
      phone: "917981189649",
      channelId: "684a91c04491bfb38c42c7bd",
      channelType: "whatsapp",
    },
  ];
  try {
    const { teamId, number } = await req.json();

    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
    });
    const endpoint = "https://server.gallabox.com/devapi/messages/whatsapp";
    const responses = await Promise.all(
      list.map(async (item) => {
        const json = {
          channelId: "684a91c04491bfb38c42c7bd",
          channelType: "whatsapp",
          recipient: {
            name: item.name,
            phone: item.phone,
          },
          whatsapp: {
            type: "text",
            text: {
              body: "Message from Developer API POST",
            },
          },
        };
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            apiKey: "684a92a4caf874eb4ec1b521",
            apiSecret: "741ccae699ac4d3f82cbc5e18e878239",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });
        let data = null;
        if (!response.ok) {
          data = await response.json();
          console.error("Error response from API:", data);
        } else {
          data = await response.json();
        }
        return {
          status: response.status,
          data,
        };
      })
    );

    return NextResponse.json({
      message: "Messages processed",
      results: responses,
    });
  } catch (error: any) {
    // Optionally log or handle the error
    return NextResponse.json(
      { message: "Failed to process messages", error: error.message },
      { status: 500 }
    );
  }
}
