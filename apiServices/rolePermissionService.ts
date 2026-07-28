"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { PaginationType } from "@/types/pagination";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

// ======================= Permissions =======================
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  roles_count: number;
  roles: string[];
  created_at: string;
  updated_at: string;
}
export interface PermissionsData {
  permissions: Permission[];
  pagination?: PaginationType;
}

export interface PermissionsApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: PermissionsData;
  errors?: Record<string, string[]>;
}

export async function getAllPermissionsList({
  params = {},
}: {
  params?: Record<string, unknown>;
}): Promise<PermissionsApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const url = queryString
      ? `${API_BASE}/permissions?${queryString}`
      : `${API_BASE}/permissions`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Permissions API Error: ${res.status} ${res.statusText}`);
    }

    const data: PermissionsApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getPermissions Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching permissions");
  }
}
// =======================End Permissions =======================

// ======================= Roles =======================
export interface Role {
  id: number;
  name: string;
  technical_name?: string;
  guard_name?: string;
  permissions: string[];
  users_count: number;
  created_at: string;
  updated_at: string;
  display_name?: string;
}
export interface RolesData {
  roles: Role[];
  pagination?: PaginationType;
}

export interface RolesApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: RolesData;
  errors?: Record<string, string[]>;
}

// ======================= getAll Roles =======================
export async function getAllRolesList({
  token,
  params = {},
}: {
  token?: string;
  params?: Record<string, unknown>;
} = {}): Promise<RolesApiResponse | null> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const url = `${API_BASE}/roles?${queryString}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.log("No roles found (404). Returning empty list.");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.log("Unauthorized: Access token not found");
      return null;
    }

    if (!res.ok) {
      throw new Error(`roles API Error: ${res.status} ${res.statusText}`);
    }

    const data: RolesApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllRolesList Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching permissions");
  }
}

// ======================= General Roles =======================
export async function getGeneralRolesList({
  params = {},
}: {
  params?: Record<string, unknown>;
} = {}): Promise<RolesApiResponse> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, String(value));
      }
    });

    const queryString = urlParams.toString();
    const url = `${API_BASE}/roles/general?${queryString}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`roles API Error: ${res.status} ${res.statusText}`);
    }

    const data: RolesApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllRolesList Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching permissions");
  }
}

// ======================= Role Permission List =======================
export interface RolePermission {
  id: number;
  name: string;
}

export interface RolePermissionModule {
  module_title: string;
  module_permission: RolePermission[];
}

export interface PermissionByListData {
  permissions: RolePermissionModule[];
}

export interface PermissionByApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: PermissionByListData;
  errors?: Record<string, string[]>;
}

export async function getRolePermissionslist({
  token,
}: {
  token: string;
}): Promise<PermissionByApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const url = `${API_BASE}/roles/permissions/list`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`roles API Error: ${res.status} ${res.statusText}`);
    }

    const data: PermissionByApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getRolePermissionslist Error:", error.message);
      throw error;
    }

    throw new Error(
      "Unknown error occurred while fetching getRolePermissionslist",
    );
  }
}
// =======================End Role Permission List =======================

// =======================Create and Update Roles =======================

export interface CreateUpdateRole {
  id: number;
  name: string;
  display_name?: string;
  permissions: string[];
}

export interface CreateUpdateRoleData {
  role: CreateUpdateRole;
}

export interface CreateUpdateRoleApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: CreateUpdateRoleData;
  errors?: Record<string, string[]>;
}

export interface CreateRolePayload {
  name: string;
  guard_name: string;
  display_name?: string;
  permissions: string[];
}

export async function createRole(
  token: string,
  payload: CreateRolePayload,
): Promise<CreateUpdateRoleApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  try {
    const url = `${API_BASE}/roles`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: CreateUpdateRoleApiResponse = await res.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("createRole Error:", error.message);
      throw new Error("Error creating role");
    }
    throw new Error("Unknown error occurred while creating role");
  }
}

// ======End Create Roles ==============

// =====Update Roles ===============

export async function updateRole(
  token: string,
  id: number,
  payload: CreateRolePayload,
): Promise<CreateUpdateRoleApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const url = `${API_BASE}/roles/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data: CreateUpdateRoleApiResponse = await res.json();

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("updateRole Error:", error.message);
      throw new Error("Error updating role");
    }
    throw new Error("Unknown error occurred while updating role");
  }
}
// =======================End Create and Update Roles =======================

// ======================= getRoleById =======================
export interface RoleByIdItem {
  id: number;
  name: string;
  display_name?: string;
  permissions: string[];
  users_count: number;
  created_at: string;
  updated_at: string;
}
export interface RoleByIdData {
  role: RoleByIdItem;
}
export interface RoleByIdApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: RoleByIdData;
  errors?: Record<string, string[]>;
}

export async function getRoleById({
  token,
  id,
}: {
  token: string;
  id: number;
}): Promise<RoleByIdApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const url = `${API_BASE}/roles/${id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`getRoleById API Error: ${res.status} ${res.statusText}`);
    }

    const data: RoleByIdApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getRoleById Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching role by id");
  }
}
// =======================End getRoleById =======================

// ======================= ASSIGN ROLES =======================

export interface CreateAssignedUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
export interface CreateAssignRoleResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    user: CreateAssignedUser;
  };
  errors?: Record<string, string[]>;
}

export async function assignRole(
  token: string | undefined,
  userId: number,
  roleName: string,
): Promise<CreateAssignRoleResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }
  try {
    const url = `${API_BASE}/users/${userId}/roles/assign`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: roleName }),
    });

    const data: CreateAssignRoleResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("assignRole Error:", error.message);
      throw new Error("Error assigning role");
    }
    throw new Error("Unknown error occurred while assigning role");
  }
}

// =======================End ASSIGN ROLES =======================

// ======================= GET ALL USERS LIST =======================
export interface UserListRole {
  id: number;
  name: string;
}
export interface UserList {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: UserListRole[];
}
export interface UserListData {
  total_users: number;
  users: UserList[];
}
export interface UserListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: UserListData;
  errors?: Record<string, string[]>;
}

export async function getAllUserlist(
  token: string | undefined,
  params: Record<string, unknown> = {},
): Promise<UserListApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  const urlParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      urlParams.append(key, String(params[key]));
    }
  }

  try {
    const url = `${API_BASE}/users/all-user-list`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `getAllUserlist API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: UserListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getAllUserlist Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching permissions");
  }
}
// =======================End GET ALL USERS LIST =======================

// ======================= Start  Role-Wise users list  =======================
export interface RoleWiseUserRole {
  id: number;
  name: string;
  guard_name?: string;
}

export interface RoleWiseUserList {
  id: number;
  uuid: string;
  name: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RoleWiseUserData {
  role: RoleWiseUserRole;
  users: RoleWiseUserList[];
  pagination: PaginationType;
}

export interface RoleWiseUserListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: RoleWiseUserData;
  errors?: Record<string, string[]>;
}

export async function getUserWiseByRole(
  roleId: number,
  token: string | undefined,
): Promise<RoleWiseUserListApiResponse> {
  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const url = `${API_BASE}/roles/${roleId}/users`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(
        `getUserWiseByRole API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: RoleWiseUserListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getUserWiseByRole Error:", error.message);
      throw error;
    }

    throw new Error("Unknown error occurred while fetching role users");
  }
}

// ======================= End  Role-Wise users list  =======================

// ======================= Roles Simple List =======================
export interface SimpleRole {
  id: number;
  name: string;
  display_name: string;
}

export interface RolesSimpleListData {
  roles: SimpleRole[];
  pagination?: PaginationType;
}

export interface RolesSimpleListApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: RolesSimpleListData;
  errors?: Record<string, string[]>;
}

export async function getRolesSimpleList(
  search?: string,
): Promise<RolesSimpleListApiResponse | null> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: Access token not found");
  }

  try {
    const urlParams = new URLSearchParams();
    if (search) {
      urlParams.append("search", search);
    }

    const queryString = urlParams.toString();
    const url = queryString? `${API_BASE}/roles/simple-list?${queryString}`: `${API_BASE}/roles/simple-list`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 404) {
      console.warn("Roles not found (404).");
      return null;
    }

    if (res.status === 401 || res.status === 403) {
      console.warn("Unauthorized: Access token not found.");
      return null;
    }

    if (!res.ok) {
      throw new Error(
        `getRolesSimpleList API Error: ${res.status} ${res.statusText}`,
      );
    }

    const data: RolesSimpleListApiResponse = await res.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("getRolesSimpleList Error:", error.message);
      throw error;
    }
    throw new Error("Unknown error occurred while fetching roles simple list");
  }
}
// ======================= End Roles Simple List =======================
