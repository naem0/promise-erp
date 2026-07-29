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
  branches: EmployeeBranch[];
  department: EmployeeDepartment;
  role?: EmployeeRole;
  nid_no?: string;
  address?: string;
  experience?: string;
  note?: string;
  tools?: EmployeeTool[];
  salary_scale?: EmployeeSalaryScale;
  main_branch_id?: number;
  is_blocked?: number;
}

export interface ToggleEmployeeStatusResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    is_blocked: number;
    blocked_text: string;
  };
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
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
  params: Record<string, unknown> = {},
): Promise<EmployeesResponse | null> {
  "use cache";
  cacheTag("employees-list");

  try {
    // NOTE: Do NOT throw inside "use cache" — errors become {} in console.
    const urlParams = new URLSearchParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        urlParams.append(key, String(params[key]));
      }
    }

    const res = await fetch(`${API_BASE}/employees?${urlParams.toString()}`, {
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
    if (error instanceof Error) {
      console.error("Service error:", error.message);
      return null;
    } else {
      console.error("Service error:", "Error fetching employees");
      return null;
    }
  }
}

// =======================
// GET EMPLOYEES WRAPPER
// =======================

export async function getEmployees(
  params: Record<string, unknown> = {},
): Promise<EmployeesResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) throw new Error("No valid session/token");

  const _cachedResult = await getEmployeesCached(token, params);

  if (!_cachedResult) throw new Error("Failed to fetch data from cache.");

  return _cachedResult;
}

// =======================
// GET SINGLE EMPLOYEE
// =======================

export async function getEmployeeById(
  id: number,
): Promise<SingleEmployeeResponse> {
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
  formData: FormData,
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

    if (res.ok && result?.success) {
      updateTag("employees-list");
    }
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
  formData: FormData,
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

    if (res.ok && result?.success) {
      updateTag("employees-list");
    }
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

export async function getDesignations(
  params: Record<string, unknown> = {},
): Promise<DesignationsResponse> {
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
    const url = queryString
      ? `${API_BASE}/designations?${queryString}`
      : `${API_BASE}/designations`;

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

export async function getDepartments(
  params: Record<string, unknown> = {},
): Promise<DepartmentsResponse> {
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
    const url = queryString
      ? `${API_BASE}/departments?${queryString}`
      : `${API_BASE}/departments`;

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

export async function getSalaryScales(
  params: Record<string, unknown> = {},
): Promise<SalaryScalesResponse> {
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
    const url = queryString
      ? `${API_BASE}/salary-scales?${queryString}`
      : `${API_BASE}/salary-scales`;

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

export async function deleteEmployee(
  id: number,
): Promise<SingleEmployeeResponse> {
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

    if (res.ok && result?.success) {
      updateTag("employees-list");
    }
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

// =======================
// TOGGLE EMPLOYEE STATUS
// =======================

export async function toggleEmployeeStatus(
  id: number,
): Promise<ToggleEmployeeStatusResponse> {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    if (!token) throw new Error("No valid session/token");

    const res = await fetch(`${API_BASE}/employees/${id}/toggle-status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (res.ok && result?.success) {
      updateTag("employees-list");
    }
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in toggleEmployeeStatus:", error);
      throw new Error(error.message || "Failed to toggle employee status");
    } else {
      throw new Error("Failed to toggle employee status");
    }
  }
}

// *********Start public employees api End Point******* //

export interface AllOfficeEmployee {
  id: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  profile_image?: string;
  display_order: number;
  experience: string;
  note?: string;
}
export interface AllOfficeDepartment {
  department_id: number | null;
  department_name: string;
  employees: AllOfficeEmployee[];
}

export interface AllOfficeEmployeesApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: AllOfficeDepartment[];
  errors?: Record<string, string[]>;
}

export async function getPublicAllEmployees(): Promise<AllOfficeEmployeesApiResponse | null> {
  try {
    const url = `${API_BASE}/public/employees`;
    const res = await fetch(url);

    if (res.status === 404) {
      console.warn("No employees found.");
      return null;
    }
    if (res.status === 400) {
      console.warn("Bad request.");
      return null;
    }
    if (res.status === 403) {
      console.warn("Access denied.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch public employees — HTTP ${res.status}`);
    }
    const result: AllOfficeEmployeesApiResponse = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn("Error fetching public employees:", error.message);
    } else {
      console.warn("Error fetching public employees");
    }
    return null;
  }
}
// *********End public employees api End Point******* //

// *********Start public chairman message api End Point******* //
export interface ChairmanMessage {
  id: number;
  name: string;
  designation: string;
  message_title: string;
  message_content: string;
  chairman_image?: string;
  status: number;
  type: number;
}
export interface ChairmanMessageResponse {
  success: boolean;
  message: string;
  code: number;
  data: ChairmanMessage[];
  errors?: Record<string, string[]>;
}
export async function getPublicAllExecutives(): Promise<ChairmanMessageResponse | null> {
  try {
    const url = `${API_BASE}/public/chairman-message`;
    const res = await fetch(url);

    if (res.status === 404) {
      console.warn("No Management messages found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch public employees — HTTP ${res.status}`);
    }
    const result: ChairmanMessageResponse = await res.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn("Error fetching public executives:", error.message);
    } else {
      console.warn("Error fetching public executives");
    }
    return null;
  }
}
// *********End public chairman message api End Point******* //

export interface EmployeeStatsResponse {
  success: boolean;
  message?: string;
  code?: number;
  data: {
    card_name: string;
    metrics: {
      value: number;
    };
  }[];
  errors?: Record<string, string[]>;
}

export async function getEmployeeStatsCached(
  token: string,
): Promise<EmployeeStatsResponse | null> {
  "use cache: private";
  cacheTag("employees-list");

  try {
    const res = await fetch(`${API_BASE}/employees/list-overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Employee list-overview not found (404). Returning null.");
      return null;
    }
    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(`Status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    console.error("getEmployeeStatsCached error:", error);
    return null;
  }
}

export async function getEmployeeStats(): Promise<EmployeeStatsResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) return null;
  try {
    const cachedResult = await getEmployeeStatsCached(token);
    return cachedResult;
  } catch (error: unknown) {
    console.error("getEmployeeStats error:", error);
    return null;
  }
}
