"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-hot-toast"
const formSchema = z.object({
    name: z.string().min(2).max(50),
    helpline: z.string().min(2).max(50)
})

export function AddTeam() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            helpline: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const endpoint = await axios.post('/api/createTeam', {
            name: values.name,
            assignedHelpline: values.helpline,
        })
        if (endpoint.status === 200) {
            toast.success("Team created successfully")
            form.reset()
        } else {
            toast.error("Failed to create team")
        }
        console.log(values)
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline" className="w-fit">
                    <Plus className="h-4 w-4" />
                    Add Team
                </Button>
            </DrawerTrigger>
            <DrawerContent
                className="flex flex-col items-center justify-center"
            >
                <DrawerHeader>
                    <DrawerTitle>Create a Team</DrawerTitle>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel>Name</FormLabel>
                                    <FormControl
                                        className="w-full"
                                    >
                                        <Input placeholder="Relay Team" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="helpline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Help (Visible to mumin in the dropdown)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Help Offered" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Create</Button>
                    </form>
                </Form>
                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
