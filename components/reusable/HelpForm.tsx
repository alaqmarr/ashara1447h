'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { z } from "zod"

const formSchema = z.object({
    number: z.string().min(10).max(10).regex(/^\d+$/, "Must be a valid number"),
    team: z.string().min(2).max(50),
    comment: z.string().max(500).optional(),
})
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const HelpForm = ({ id, qr, teams }: { id: string, qr: any, teams: any }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            number: "",
            team: "",
            comment: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const endpoint = await axios.post(`/api/endpoint/message/${id}`, values)
        if (endpoint.status === 200) {
            setSuccess(true)
            setLoading(false)
            form.reset()
        }
        else {
            setError("Failed to send message")
            setLoading(false)
        }
        console.log(values)
    }


    return (
        <div
            className='flex flex-col items-center justify-center p-4'
        >
            <div className='flex flex-col items-center justify-center gap-y-4 p-4 border rounded-xl bg-gray-50 shadow-md w-[350px]'>
                <p className='text-lg font-semibold text-center'>
                    {qr.name} <br /> <span className="text-sm text-gray-500">{qr.centre.name}</span>
                </p>

                <div
                    className='w-[300px] flex flex-col items-center justify-center gap-y-4 p-4 rounded-xl'
                >
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Mobile Number (Indian Number)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="9874563210" inputMode='numeric' {...field} className='w-full' maxLength={10} minLength={10} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="team"
                                render={({ field }) => (
                                    <FormItem
                                        className='w-full'
                                    >
                                        <FormLabel>Please select relevant query</FormLabel>
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
                                                        {team.assignedHelpline}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comments</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Please leave a comment if any" {...field} className='w-full' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {
                                loading ? (
                                    <Button disabled className="w-full" variant="outline">
                                        processing...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full">
                                        REQUEST HELP
                                    </Button>
                                )
                            }

                            {

                                success && (
                                    <p className='text-green-600 text-sm font-semibold text-center'>
                                        Help request sent successfully!
                                    </p>
                                )
                            }

                            {
                                error && (
                                    <p className='text-red-600 text-sm font-semibold text-center'>
                                        {error}
                                    </p>
                                )
                            }
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    )
}

export default HelpForm
