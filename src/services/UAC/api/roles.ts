// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取角色列表 获取所有角色列表，支持分页和状态筛选 GET /api/v1/roles */
export async function getRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesParams,
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      total?: number;
      items?: {
        role_id?: string;
        role_name?: string;
        code?: string;
        description?: string;
        status?: string;
        permissions?: {
          permission_id?: string;
          name?: string;
          code?: string;
        }[];
      }[];
      page?: number;
      size?: number;
    };
  }>('/api/v1/roles', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建角色 创建新角色 POST /api/v1/roles */
export async function postRoles(
  body: {
    /** 角色名称 */
    name: string;
    /** 角色编码 */
    code: string;
    /** 角色描述 */
    description?: string;
    /** 角色状态 */
    status?: 'ACTIVE' | 'INACTIVE';
    /** 权限ID列表 */
    permissions?: string[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      role_id?: string;
      name?: string;
      code?: string;
      description?: string;
      status?: string;
      created_at?: string;
    };
  }>('/api/v1/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取角色详情 获取指定角色的详细信息 GET /api/v1/roles/${param0} */
export async function getRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesRoleIdParams,
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      role_id?: string;
      role_name?: string;
      code?: string;
      description?: string;
      status?: string;
      permissions?: { permission_id?: string; name?: string; code?: string }[];
    };
  }>(`/api/v1/roles/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新角色信息 更新指定角色的信息 PUT /api/v1/roles/${param0} */
export async function putRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putRolesRoleIdParams,
  body: {
    /** 角色名称 */
    role_name?: string;
    /** 角色描述 */
    description?: string;
    /** 角色状态 */
    status?: 'ACTIVE' | 'ARCHIVED';
  },
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      role_id?: string;
      role_name?: string;
      code?: string;
      description?: string;
      status?: string;
    };
  }>(`/api/v1/roles/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 软删除指定角色 DELETE /api/v1/roles/${param0} */
export async function deleteRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRolesRoleIdParams,
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<{ code?: number; message?: string }>(
    `/api/v1/roles/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
}

/** 更新角色权限 更新角色的权限列表，可以添加或删除权限 PUT /api/v1/roles/${param0}/permissions */
export async function putRolesRoleIdPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putRolesRoleIdPermissionsParams,
  body: {
    /** 要添加的权限ID列表 */
    add_permissions: string[];
    /** 要移除的权限ID列表 */
    remove_permissions: string[];
  },
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<{ code?: number; message?: string }>(
    `/api/v1/roles/${param0}/permissions`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 给角色分配权限 完全替换角色的现有权限，设置新的权限列表 POST /api/v1/roles/${param0}/permissions */
export async function postRolesRoleIdPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postRolesRoleIdPermissionsParams,
  body: {
    /** 权限ID列表 */
    permission_ids: string[];
  },
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<{ code?: number; message?: string }>(
    `/api/v1/roles/${param0}/permissions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 检查用户权限 检查当前用户是否拥有指定权限 POST /api/v1/roles/check-permission */
export async function postRolesCheckPermission(
  body: {
    /** 权限编码 */
    permission_code: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: { has_permission?: boolean };
  }>('/api/v1/roles/check-permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
