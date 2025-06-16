import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";
import Whatsapp from "@/components/Whatsapp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
export const metadata: Metadata = {
  title: "Ashara 1447H Helpline",
  description: "Official Secunderabad Relay Centre Helpline for Ashara Mubaraka 1447H",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster/>
        <SidebarProvider>
          <AppSidebar />
          <main
            className="w-full"
          >
            <NavBar />
            {children}
          </main>
        </SidebarProvider>
        <Whatsapp/>
      </body>
    </html>
  );
}
