'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
    number: z.string().min(10).max(10).regex(/^\d+$/, "Must be a valid number"),
    team: z.string().min(2).max(50),
    comment: z.string().max(500).optional(),
})

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        setError("")
        try {
            const endpoint = await axios.post(`/api/endpoint/message/${id}`, values)
            if (endpoint.status === 200) {
                setSuccess(true)
                form.reset()
            }
        } catch (err) {
            setError("Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-100">
            <div className="w-full max-w-md">
                {/* Logo Section - Replace with your actual logo */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white p-3 rounded-full shadow-lg">
                        <Image
                            src="/logo.png" // Update with your logo path
                            alt="Company Logo"
                            width={80}
                            height={80}
                            className="rounded-md"
                        />
                    </div>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-200">
                    {/* Header */}
                    <div className="bg-amber-600 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white">{qr.name}</h1>
                        <p className="text-amber-100 mt-1">{qr.centre.name}</p>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
                        {success ? (
                            <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800">Request Submitted!</h3>
                                <p className="text-gray-600 mt-2">Our team will contact you shortly.</p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Mobile Number */}
                                    <FormField
                                        control={form.control}
                                        name="number"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Mobile Number</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <span className="text-gray-500">+91</span>
                                                        </div>
                                                        <Input
                                                            placeholder="9876543210"
                                                            inputMode="numeric"
                                                            {...field}
                                                            className="pl-12 rounded-lg"
                                                            maxLength={10}
                                                            minLength={10}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Query Selection */}
                                    <FormField
                                        control={form.control}
                                        name="team"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Query Regarding</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-lg">
                                                            <SelectValue placeholder="Select your query" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-lg">
                                                        {teams.map((team: any) => (
                                                            <SelectItem key={team.id} value={team.id} className="hover:bg-amber-50">
                                                                {team.assignedHelpline}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Comments */}
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Additional Comments</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Any additional details..."
                                                        {...field}
                                                        className="rounded-lg min-h-[100px]"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-amber-600 hover:bg-amber-700 rounded-lg py-6 text-lg font-medium shadow-md"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "REQUEST HELP"
                                        )}
                                    </Button>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
                                            {error}
                                        </div>
                                    )}
                                </form>
                            </Form>
                        )}
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    We'll contact you within 10 minutes
                </p>
            </div>
        </div>
    )
}

export default HelpForm