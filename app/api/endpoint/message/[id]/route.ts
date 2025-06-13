import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Remove Promise wrapper
) {
  const { id } = await params;
  const { team, number, comment } = await req.json();

  const incharge = await prisma.team.findUnique({
    where: { id: team },
    include: { members: true },
  });

  if (!incharge) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const qrCode = await prisma.qr.findUnique({
    where: { id },
    include: { centre: true },
  });

  if (!qrCode) {
    return NextResponse.json({ error: "QR Code not found" }, { status: 404 });
  }

  const message =
    `*🚨 Assistance Requested for ${team.name}*\n\n` +
    `🔹 *Location:* ${qrCode.name}\n` +
    `🏢 *Centre:* ${qrCode.centre.name}\n` +
    `📞 *Raised by:* ${number}\n\n` +
    `*Comment:* ${comment ? comment : "No Comments"}` +
    `⚠️ Please reach out to them *immediately* for help.\n\n` +
    `— IT Office\n` +
    `Secunderabad Relay Centre`;

  try {
    const endpoint = "https://server.gallabox.com/devapi/messages/whatsapp";

    const responses = await Promise.all(
      incharge.members.map(async (item) => {
        const json = {
          channelId: "684bc389339286e555c4dfc5",
          channelType: "whatsapp",
          recipient: {
            name: item.name,
            phone: item.number,
          },
          whatsapp: {
            type: "template",
            template: {
              templateName: "helpline",
              bodyValues: {
                location: qrCode.name,
                centre: qrCode.centre.name,
                number: number,
                comments: comment ? comment : "No Comments",
              },
            },
          },
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            apiKey: "684bc8d50d363eced41f7b23",
            apiSecret: "bcb244a04a904daca63ff05efc84c1f4",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });

        const data = await response.json();
        return {
          status: response.status,
          data,
        };
      })
    );

    console.log("Responses:", responses);
    return NextResponse.json({
      message: "Messages processed",
      results: responses,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
