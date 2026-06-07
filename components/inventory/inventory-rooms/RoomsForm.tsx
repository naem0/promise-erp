"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { createRoom, updateRoom, Room } from "@/apiServices/inventoryRoomsService";
import { Branch } from "@/apiServices/branchService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RoomsFormProps {
    title: string;
    room?: Room;
    branches?: Branch[];
}

interface FormValues {
    name: string;
    room_no: string;
    branch_id: string;
    status: string;
}

export default function RoomsForm({
    title,
    room,
    branches = [],
}: RoomsFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            room_no: "",
            branch_id: "",
            status: "1",
        },
    });

    useEffect(() => {
        if (room) {
            reset({
                name: room.name || "",
                room_no: room.room_no || "",
                branch_id: room.branch?.id?.toString() || "",
                status: room.status?.toString() || "1",
            });
        }
    }, [room, reset]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        try {
            const res = room
                ? await updateRoom(Number(room.id), formData)
                : await createRoom(formData);
                
            if (res.success) {
                reset();
                toast.success(res.message || "Room saved successfully!");
                router.push("/inventory/inventory-rooms");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save room");
                    Object.entries(res.errors).forEach(([field, messages]) => {
                        const errorMessage = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                        setError(field as keyof FormValues, {
                            type: "server",
                            message: errorMessage as string,
                        });
                    });
                } else {
                    toast.error(res.message || "Failed to save room");
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error(error);
        }
    };

    return (
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => router.back()} 
                    className="cursor-pointer"
                >
                    Go Back
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input 
                            placeholder="Enter room name" 
                            {...register("name", { required: "Room name is required" })} 
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Room No. */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Room No.<span className="text-red-500">*</span></label>
                        <Input 
                            placeholder="Enter room number" 
                            {...register("room_no", { required: "Room number is required" })} 
                        />
                        {errors.room_no && <p className="text-sm text-red-500 mt-1">{errors.room_no.message}</p>}
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch<span className="text-red-500">*</span></label>
                        <Controller
                            name="branch_id"
                            control={control}
                            rules={{ required: "Branch is required" }}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {branches.map(b => (
                                            <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.branch_id && <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Active</SelectItem>
                                        <SelectItem value="0">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg cursor-pointer">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="text-white px-8 rounded-lg cursor-pointer">
                        {isSubmitting ? "Submitting..." : room ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
