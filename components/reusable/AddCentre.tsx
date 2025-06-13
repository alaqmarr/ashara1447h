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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Textarea } from "../ui/textarea"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    mapUrl: z.string().url("Must be a valid URL").min(5, "URL is too short"),
    embed: z.string().min(5, "Embed code is too short"),
    latitude: z.string().min(1, "Latitude is required"),
    longitude: z.string().min(1, "Longitude is required"),
})

export function AddCentre() {
    const [isGettingLocation, setIsGettingLocation] = React.useState(false)
    const [locationError, setLocationError] = React.useState("")


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            mapUrl: "",
            embed: "",
            latitude: "",
            longitude: "",
        },
    })

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser")
            return
        }

        setIsGettingLocation(true)
        setLocationError("")

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                form.setValue('latitude', latitude.toString())
                form.setValue('longitude', longitude.toString())
                setIsGettingLocation(false)
                toast.success("Location obtained successfully!")
            },
            (error) => {
                setIsGettingLocation(false)
                setLocationError("Unable to retrieve your location")
                toast.error("Failed to get location")
                console.error(error)
            }
        )
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const endpoint = await axios.post('/api/createCentre', values)
            if (endpoint.status === 200) {
                toast.success("Centre created successfully")
                form.reset()
            } else {
                toast.error("Failed to create centre")
            }
        } catch (error) {
            toast.error("An error occurred while creating the centre")
            console.error(error)
        }
    }

    return (
        <Drawer>
            <DrawerTrigger>
                <Button variant="outline" className="w-fit">
                    <Plus className="h-4 w-4" />
                    Add Centre
                </Button>
            </DrawerTrigger>
            <DrawerContent className="flex flex-col items-center justify-center">
                <DrawerHeader>
                    <DrawerTitle>Create a Centre</DrawerTitle>
                </DrawerHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col items-center w-full max-w-md">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saifee Masjid" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mapUrl"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>MAP Url</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://google.com/maps/hdfioajbd" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="embed"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Embed Code</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="<iframe>...</iframe>" {...field} className="h-fit" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4 w-full">
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Latitude</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 40.7128" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Longitude</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. -74.0060" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={getCurrentLocation}
                            disabled={isGettingLocation}
                            variant="outline"
                            className="w-full"
                        >
                            {isGettingLocation ? "Getting Location..." : "Use My Current Location"}
                        </Button>
                        {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
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