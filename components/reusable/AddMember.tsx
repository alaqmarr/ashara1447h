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
    email: z.string().min(2).max(50),
    number: z.string().min(12).max(12),
    teamId: z.string().min(1, "Please select a team"),

})

export function AddMember({ teams }: { teams: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "ashara1447h.secbad@gmail.com",
            number: "",
            teamId: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const endpoint = await axios.post('/api/createMember', values)
        if (endpoint.status === 200) {
            toast.success("Member created successfully")
            form.reset()
        } else {
            toast.error("Failed to create member")
        }
        console.log(values)
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline" className="w-fit">
                    <Plus className="h-4 w-4" />
                    Add Member
                </Button>
            </DrawerTrigger>
            <DrawerContent
                className="flex flex-col items-center justify-center"
            >
                <DrawerHeader>
                    <DrawerTitle>Create a Member</DrawerTitle>
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
                            name="email"
                            render={({ field }) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel>Email</FormLabel>
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
                            name="number"
                            render={({ field }) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel>Number | 911234567890</FormLabel>
                                    <FormControl
                                        className="w-full"
                                    >
                                        <Input placeholder="your mobile number" {...field} className="w-full" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="teamId"
                            render={({ field }) => (
                                <FormItem
                                    className='w-full'
                                >
                                    <FormLabel>Please select relevant team</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl
                                            className='w-full'
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Query Regarding" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {teams.map((team: any) => (
                                                <SelectItem key={team.id} value={team.id}>
                                                    {team.name}
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
