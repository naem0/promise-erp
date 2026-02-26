"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { cacheTag, updateTag } from "next/cache";
import { PaginationType } from "@/types/pagination";

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// =======================
// Interfaces
// =======================

export interface EmployeeRole {
    id: number;
    name: string;
}

export interface EmployeeBranch {
    id: number;
    name: string;
}

export interface EmployeeDepartment {
    id: number;
    name: string;
}

export interface EmployeeDesignation {
    id: number;
    name: string;
}

export interface EmployeeSalaryScale {
    id: number;
    name: string;
}

export interface EmployeeTool {
    id: number;
    title: string;
    image?: string | null;
    role: string;
}

export interface Employee {
    id: number;
    uuid: string;
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    blood_group: string;
    designation: EmployeeDesignation;
    employment_type: number;
    join_date: string;
    joining_date?: string; // From get response
    release_date: string;
    profile_image: string;
    display_order?: number;
    probation_period?: number;
    branch: EmployeeBranch;
    department: EmployeeDepartment;
    role?: EmployeeRole;
    nid_no?: string;
    address?: string;
    experience?: string;
    note?: string;
    tools?: EmployeeTool[];
    salary_scale?: EmployeeSalaryScale;
}

export interface EmployeesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        total_employees: number;
        employees: Employee[];
        pagination: PaginationType;
    };
    errors?: Record<string, string[]>;
}

export interface SingleEmployeeResponse {
    success: boolean;
    message: string;
    code: number;
    data: Employee;
    errors?: Record<string, string[] | string>;
}

export interface DesignationsResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        designations: EmployeeDesignation[];
        pagination: PaginationType;
    };
}

export interface DepartmentsResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        departments: EmployeeDepartment[];
        pagination: PaginationType;
    };
}

export interface SalaryScalesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        salary_scales: EmployeeSalaryScale[];
        pagination: PaginationType;
    };
}

// =======================
// GET EMPLOYEES (CACHED)
// =======================

export async function getEmployeesCached(
    token: string,
    params: Record<string, unknown> = {}
): Promise<EmployeesResponse> {
    "use cache";
    cacheTag("employees-list");

    try {
        const urlParams = new URLSearchParams();
        for (const key in params) {
            if (params[key] !== undefined && params[key] !== null) {
                urlParams.append(key, String(params[key]));
            }
        }

        const res = await fetch(
            `${API_BASE}/employees?${urlParams.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }
        const result = await res.json();

        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Error fetching employees");
        }
    }
}

// =======================
// GET EMPLOYEES WRAPPER
// =======================

export async function getEmployees(
    params: Record<string, unknown> = {}
): Promise<EmployeesResponse> {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    return getEmployeesCached(token, params);
}

// =======================
// GET SINGLE EMPLOYEE
// =======================

export async function getEmployeeById(id: number): Promise<SingleEmployeeResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/employees/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();

        return result;
    } catch (error: unknown) {
        console.error("Error in getEmployeeById:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Failed to fetch employee");
        } else {
            throw new Error("Failed to fetch employee");
        }
    }
}

// =======================
// CREATE EMPLOYEE
// =======================

export async function createEmployee(
    formData: FormData
): Promise<SingleEmployeeResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/employees`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });



        const result = await res.json();

        updateTag("employees-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in createEmployee:", error);
            throw new Error(error.message || "Failed to create employee");
        } else {
            throw new Error("Failed to create employee");
        }
    }
}

// =======================
// UPDATE EMPLOYEE
// =======================

export async function updateEmployee(
    id: number,
    formData: FormData
): Promise<SingleEmployeeResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) throw new Error("No valid session/token");

        const res = await fetch(`${API_BASE}/employees/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Update Employee Failed:", text);
            try {
                const json = JSON.parse(text);
                return json;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error in updateEmployee:", error);
                    throw new Error(error.message || "Failed to update employee");
                } else {
                    throw new Error("Failed to update employee");
                }
            }
        }

        const result = await res.json();

        updateTag("employees-list");
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in updateEmployee:", error);
            throw new Error(error.message || "Failed to update employee");
        } else {
            throw new Error("Failed to update employee");
        }
    }
}

// =======================
// FETCH HELPERS
// =======================

export async function getDesignations(params: Record<string, unknown> = {}): Promise<DesignationsResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        if (!token) throw new Error("No valid session/token");

        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                urlParams.append(key, String(value));
            }
        });

        const queryString = urlParams.toString();
        const url = queryString ? `${API_BASE}/designations?${queryString}` : `${API_BASE}/designations`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        return result;
    } catch (error: unknown) {
        console.error("Error fetching designations:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Error fetching designations");
        }
    }
}

export async function getDepartments(params: Record<string, unknown> = {}): Promise<DepartmentsResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        if (!token) throw new Error("No valid session/token");

        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                urlParams.append(key, String(value));
            }
        });

        const queryString = urlParams.toString();
        const url = queryString ? `${API_BASE}/departments?${queryString}` : `${API_BASE}/departments`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        return result;
    } catch (error: unknown) {
        console.error("Error fetching departments:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Error fetching departments");
        }
    }
}

export async function getSalaryScales(params: Record<string, unknown> = {}): Promise<SalaryScalesResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        if (!token) throw new Error("No valid session/token");

        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                urlParams.append(key, String(value));
            }
        });

        const queryString = urlParams.toString();
        const url = queryString ? `${API_BASE}/salary-scales?${queryString}` : `${API_BASE}/salary-scales`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        return result;
    } catch (error: unknown) {
        console.error("Error fetching salary scales:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Error fetching salary scales");
        }
    }
}

// =======================
// DELETE EMPLOYEE
// =======================

export async function deleteEmployee(id: number): Promise<SingleEmployeeResponse> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            throw new Error("No valid session/token");
        }

        const res = await fetch(`${API_BASE}/employees/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        updateTag("employees-list");
        return result;
    } catch (error: unknown) {
        console.error("Error in deleteEmployee:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("Failed to delete employee");
        }
    }
}
