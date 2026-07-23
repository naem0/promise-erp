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
import { Textarea } from "@/components/ui/textarea";
import BranchSearchSelect from "@/components/common/BranchSearchSelect";

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
    is_store: string;
    description: string;
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
            is_store: "0",
            description: "",
        },
    });

    const roomId = room?.id;
    useEffect(() => {
        if (room) {
            reset({
                name: room.name || "",
                room_no: room.room_no || "",
                branch_id: room.branch?.id?.toString() || "",
                status: room.status?.toString() || "1",
                is_store: room.is_store !== undefined ? room.is_store.toString() : "0",
                description: room.description || "",
            });
        }
        
    }, [roomId, reset]);

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
                            {...register("name")} 
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Room No. */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Room No.<span className="text-red-500">*</span></label>
                        <Input 
                            placeholder="Enter room number" 
                            {...register("room_no")} 
                        />
                        {errors.room_no && <p className="text-sm text-red-500 mt-1">{errors.room_no.message}</p>}
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch<span className="text-red-500">*</span></label>
                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <BranchSearchSelect
                                    value={field.value}
                                    onValueChange={(val) => field.onChange(val ?? "")}
                                    placeholder="Select Branch"
                                />
                            )}
                        />
                        {errors.branch_id && <p className="text-sm text-red-500 mt-1">{errors.branch_id.message}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1" >Status<span className="text-red-500">*</span></label>
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

                    {/* Room Type (Is Store) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Room Type<span className="text-red-500">*</span></label>
                        <Controller
                            name="is_store"
                            control={control}
                            render={({ field }) => (
                                <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Room Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Not Store (Room)</SelectItem>
                                        <SelectItem value="1">Store</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.is_store && <p className="text-sm text-red-500 mt-1">{errors.is_store.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea 
                            placeholder="Enter description (optional)" 
                            {...register("description")} 
                            className="min-h-[100px] resize-none"
                        />
                        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
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
