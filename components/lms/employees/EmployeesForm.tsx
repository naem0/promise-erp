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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { createEmployee, updateEmployee, Employee, EmployeeBranch, EmployeeDepartment, EmployeeDesignation, EmployeeSalaryScale } from "@/apiServices/employeeService";
import { Tool } from "@/apiServices/toolsService";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Role } from "@/apiServices/rolePermissionService";

interface EmployeeFormProps {
    title: string;
    employee?: Employee;
    roles?: Role[];
    branches?: EmployeeBranch[];
    departments?: EmployeeDepartment[];
    designations?: EmployeeDesignation[];
    salaryScales?: EmployeeSalaryScale[];
    allTools?: Tool[];
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    nid_no: string;
    employee_id: string;
    address: string;
    role: string;
    blood_group: string;
    designation_id: string;
    department_id: string;
    branch_id: string;
    join_date: string;
    experience: string;
    display_order: string;
    employment_type: string;
    probation_period: string;
    salary_scale_id: string;
    release_date: string;
    note: string;
    tool_ids: string[];
    profile_image?: FileList;
}

export default function EmployeesForm({
    title,
    employee,
    roles = [],
    branches = [],
    departments = [],
    designations = [],
    salaryScales = [],
    allTools = []
}: EmployeeFormProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(
        employee?.profile_image || null
    );
    const [isImageRemoved, setIsImageRemoved] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        control,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            name: employee?.name || "",
            email: employee?.email || "",
            phone: employee?.phone || "",
            nid_no: employee?.nid_no || "",
            employee_id: employee?.employee_id || "",
            address: employee?.address || "",
            role: employee?.role?.name || "",
            blood_group: employee?.blood_group || "",
            designation_id: employee?.designation?.id?.toString() || "",
            department_id: employee?.department?.id?.toString() || "",
            branch_id: employee?.branch?.id?.toString() || "",
            join_date: employee?.joining_date || "",
            experience: employee?.experience || "",
            display_order: employee?.display_order?.toString() || "1",
            employment_type: employee?.employment_type?.toString() || "1",
            probation_period: employee?.probation_period?.toString() || "6",
            salary_scale_id: employee?.salary_scale?.id?.toString() || "",
            release_date: employee?.release_date || "",
            note: employee?.note || "",
            tool_ids: employee?.tools?.map(t => t.id.toString()) || [],
            profile_image: undefined,
        },
    });

    const imageFile = watch("profile_image");
    const selectedRoleId = watch("role");
    const isTeacherRole =
        selectedRoleId?.toLowerCase().includes("teacher") ||
        selectedRoleId?.toLowerCase().includes("trainer");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            setIsImageRemoved(false);
            const file = imageFile[0];
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => setPreviewImage(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        }
    }, [imageFile]);

    const submitHandler = async (values: FormValues) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (key !== "profile_image" && value !== undefined && value !== null) {
                if (key === "address") {
                    formData.append("present_address", value as string);
                } else if (key === "tool_ids" && Array.isArray(value)) {
                    value.forEach(id => formData.append("tool_ids[]", id));
                } else {
                    formData.append(key, value as string);
                }
            }
        });

        if (values.profile_image && values.profile_image.length > 0) {
            formData.append("profile_image", values.profile_image[0]);
        } else if (isImageRemoved && employee) {
            formData.append("profile_image", "");
        }

        try {
            const res = employee
                ? await updateEmployee(Number(employee.id), formData)
                : await createEmployee(formData);
            if (res.success) {
                reset();
                setPreviewImage(null);
                toast.success(res.message || "Employee saved successfully!");
                router.push("/lms/employees");
            } else {
                if (res.errors) {
                    toast.error(res.message || "Failed to save employee");
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
                    toast.error(res.message || "Failed to save employee");
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
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto">
                    <span className="text-xl">{"<"}</span>
                </Button>
                {title}
            </h2>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                {/* Profile Image Preview & Upload */}
                <div className="flex justify-start">
                    <div className="relative">
                        <div className="w-32 h-32 relative  rounded-full overflow-hidden  border-2 border-dashed flex items-center justify-center">
                            <Image
                                src={previewImage || "/images/profile_avatar.png"}
                                alt="Profile preview"
                                fill
                                className="object-scale-down"
                            />
                        </div>
                        <label
                            htmlFor="profile-image"
                            className="absolute bottom-1 right-1 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition"
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </label>
                        <input
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register("profile_image")}
                        />

                        {previewImage && (
                            <Button
                                type="button"
                                className="absolute top-1 left-1 bg-red-600 p-2 rounded-full cursor-pointer hover:bg-red-700 transition"
                                onClick={() => {
                                    setPreviewImage(null);
                                    setIsImageRemoved(true);
                                    setValue("profile_image", undefined);
                                    toast.success("Profile image removed");
                                }}
                            >
                                <X className="w-4 h-4 text-white" />

                            </Button>
                        )}
                    </div>
                    {errors.profile_image && <p className="text-sm text-red-500 mt-1">{errors.profile_image.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter full name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Phone & Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter phone number" {...register("phone")} />
                        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <Input type="email" placeholder="Enter email address" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* NID & Employee ID */}
                    <div>
                        <label className="block text-sm font-medium mb-1">NID</label>
                        <Input placeholder="Enter NID number" {...register("nid_no")} />
                        {errors.nid_no && <p className="text-sm text-red-500 mt-1">{errors.nid_no.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Employee ID<span className="text-red-500">*</span></label>
                        <Input placeholder="Enter employee ID" {...register("employee_id")} />
                        {errors.employee_id && <p className="text-sm text-red-500 mt-1">{errors.employee_id.message}</p>}
                    </div>

                    {/* Display Order */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Display Order</label>
                        <Input type="number" placeholder="1" {...register("display_order")} />
                        {errors.display_order && <p className="text-sm text-red-500 mt-1">{errors.display_order.message}</p>}
                    </div>

                    {/* Address */}
                    <div >
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <Input placeholder="Enter full address" {...register("address")} />
                        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
                    </div>

                    {/* Role & Blood Group */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role <span><span className="text-red-500">*</span></span> </label>
                        <Controller
                            name="role"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Blood Group</label>
                        <Controller
                            name="blood_group"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.blood_group && <p className="text-sm text-red-500 mt-1">{errors.blood_group.message}</p>}
                    </div>

                    {/* Designation & Department */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Designation</label>
                        <Controller
                            name="designation_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designations.map(d => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.designation_id && <p className="text-sm text-red-500 mt-1">{errors.designation_id.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <Controller
                            name="department_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(d => (
                                            <SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.department_id && <p className="text-sm text-red-500 mt-1">{errors.department_id.message}</p>}
                    </div>

                    {/* Branch & Joining Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Branch <span className="text-red-500">*</span></label>
                        <Controller
                            name="branch_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a branch" />
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Joining Date</label>
                        <div className="relative">
                            <Input type="date" {...register("join_date")} />
                        </div>
                        {errors.join_date && <p className="text-sm text-red-500 mt-1">{errors.join_date.message}</p>}
                    </div>

                    {/* Years of Experience */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Years of Experience</label>
                        <Input placeholder="Enter years of experience" {...register("experience")} />
                        {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience.message}</p>}
                    </div>

                    {/* Employment Type */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Employment Type</label>
                        <Controller
                            name="employment_type"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Probation</SelectItem>
                                        <SelectItem value="1">Full-time</SelectItem>
                                        <SelectItem value="2">Part-time</SelectItem>
                                        <SelectItem value="3">Contractual</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.employment_type && <p className="text-sm text-red-500 mt-1">{errors.employment_type.message}</p>}
                    </div>

                    {/* Probation Period */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Probation Period (Months)</label>
                        <Input type="number" placeholder="6" {...register("probation_period")} />
                        {errors.probation_period && <p className="text-sm text-red-500 mt-1">{errors.probation_period.message}</p>}
                    </div>

                    {/* Salary Scale & Release Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Salary Scale</label>
                        <Controller
                            name="salary_scale_id"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Salary Scale" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salaryScales.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.salary_scale_id && <p className="text-sm text-red-500 mt-1">{errors.salary_scale_id.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Release Date</label>
                        <div className="relative">
                            <Input type="date" {...register("release_date")} />
                        </div>
                        {errors.release_date && <p className="text-sm text-red-500 mt-1">{errors.release_date.message}</p>}
                    </div>

                    {/* Tools Selection Section */}
                    {isTeacherRole && (
                        <div className="md:col-span-2">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Select Tools</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {allTools.map((tool) => (
                                    <Controller
                                        key={tool.id}
                                        name="tool_ids"
                                        control={control}
                                        render={({ field }) => {
                                            const isChecked = field.value?.includes(tool.id.toString());
                                            return (
                                                <div
                                                    onClick={() => {
                                                        const current = field.value || [];
                                                        const updated = isChecked
                                                            ? current.filter((id) => id !== tool.id.toString())
                                                            : [...current, tool.id.toString()];
                                                        field.onChange(updated);
                                                    }}
                                                    className={`
                                                        group relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200
                                                        ${isChecked
                                                            ? "border-green-500 bg-green-50/40"
                                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                                        }
                                                    `}
                                                >
                                                    {/* Checkbox Indicator */}
                                                    <div className={`
                                                        w-5 h-5 rounded border flex items-center justify-center transition-colors mr-3
                                                        ${isChecked ? "bg-green-600 border-green-600" : "bg-white border-gray-300 group-hover:border-gray-400"}
                                                    `}>
                                                        {isChecked && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Tool Icon */}
                                                    <div className="mr-3 p-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                                                        <Image
                                                            src={tool.image && tool.image !== "" ? tool.image : "/images/placeholder.png"}
                                                            alt={tool.title || "Tool Image"}
                                                            width={32}
                                                            height={32}
                                                            className="object-contain w-8 h-8"
                                                        />
                                                    </div>


                                                    {/* Tool Label */}
                                                    <span className={`text-sm font-medium truncate ${isChecked ? "text-green-900" : "text-gray-700"}`}>
                                                        {tool.title}
                                                    </span>
                                                </div>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            {errors.tool_ids && <p className="text-sm text-red-500 mt-1">{errors.tool_ids.message}</p>}
                        </div>
                    )}

                    {/* Notes */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <Textarea placeholder="Enter any additional notes" {...register("note")} rows={4} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-lg border-green-600 text-green-600 ">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-lg">
                        {isSubmitting ? "Submitting..." : employee ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
}