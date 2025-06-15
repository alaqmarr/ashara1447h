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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-hot-toast"
const formSchema = z.object({
    name: z.string().min(2).max(50),
    center: z.string().min(2).max(50)
})

export function AddLocation({ centres }: { centres: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            center: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const endpoint = await axios.post('/api/createlocation', {
            name: values.name,
            centreId: values.center,
        })
        if (endpoint.status === 200) {
            toast.success("Location created successfully")
            form.reset()
        } else {
            toast.error("Failed to create location")
        }
        console.log(values)
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline" className="w-fit">
                    <Plus className="h-4 w-4" />
                    Add Location
                </Button>
            </DrawerTrigger>
            <DrawerContent
                className="flex flex-col items-center justify-center"
            >
                <DrawerHeader>
                    <DrawerTitle>Create a QR Code Location</DrawerTitle>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saifee Masjid" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="center"
                            render={({ field }) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel>Center</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                                        <FormControl
                                            className="w-full"
                                        >
                                            <SelectTrigger
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select a center for this location" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent
                                            className="w-full"
                                        >
                                            {centres.map((centre: any) => (
                                                <SelectItem
                                                    key={centre.id}
                                                    value={centre.id}
                                                >
                                                    {centre.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
