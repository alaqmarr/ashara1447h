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
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });
        if (!team) {
            return NextResponse.json(
                { message: "Team not found" },
                { status: 404 }
            );
        }
        const endpoint = 'https://server.gallabox.com/devapi/messages/whatsapp'

        const json = {
            "channelId": "684fc682a8649a3161213268",
            "channelType": "whatsapp",
            "recipient": {
                "name": name,
                "phone": number
            },
            "whatsapp": {
                "type": "template",
                "template": {
                    "templateName": "helpline_registration",
                    "bodyValues": {
                        "name": name,
                        "number": number,
                        "team": team.assignedHelpline
                    },
                }
            }
        }

        const res = await fetch(endpoint, {
            method: "POST",
            headers: {
                apiKey: "685163b483fa2876fe4495fe",
                apiSecret: "5540208648a74a22a631d784809d7e52",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Failed to send message:", errorData);
            throw new Error(errorData.message || 'Failed to send message');
        }

        const data = await res.json();
        console.log("Message sent successfully:", data);
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
