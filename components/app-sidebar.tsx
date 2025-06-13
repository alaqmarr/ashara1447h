import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const centres = [
    {
        title: "Saifee Masjid",
        url: "/saifeemasjid",
    },
    {
        title: "Jayalaxmi Gardens",
        url: "/jg",
    },
    {
        title: "MSB Educational Institue",
        url: "/msb",
    },
    {
        title: "AOC Centre",
        url: "/aoc",
    },
]
const links = [
    {
        title: "Maps",
        url: "/maps",
    },
    {
        title: "Transportation",
        url: "/transport",
    },
    {
        title: "Helpline",
        url: "/helpline",
    },
]

export function AppSidebar() {
    return (
        <Sidebar
            className="bg-prime"
        >
            <SidebarContent
                className="bg-prime"
            >
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="mb-2"
                    >
                        <p
                            className="font-bold text-2xl mt-2"
                        >
                            Important Links
                        </p>

                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {links.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="mb-2"
                    >
                        <p
                            className="font-bold text-2xl mt-2"
                        >
                            Centres
                        </p>

                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {centres.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}