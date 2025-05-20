// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取数据权限规则 GET /api/v1/data-permissions/rules */
export async function getDataPermissionsRules(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDataPermissionsRulesParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/data-permissions/rules', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建数据权限规则 POST /api/v1/data-permissions/rules */
export async function postDataPermissionsRules(
  body: {
    role_id: string;
    resource_type: string;
    conditions: { field?: string; operator?: string; value?: string };
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/data-permissions/rules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取权限列表 GET /api/v1/permissions */
export async function getPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/permissions', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建权限 POST /api/v1/permissions */
export async function postPermissions(
  body: API.Permission,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/permissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新权限信息 PUT /api/v1/permissions/${param0} */
export async function putPermissionsPermissionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPermissionsPermissionIdParams,
  body: API.Permission,
  options?: { [key: string]: any },
) {
  const { permission_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/permissions/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除权限 DELETE /api/v1/permissions/${param0} */
export async function deletePermissionsPermissionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePermissionsPermissionIdParams,
  options?: { [key: string]: any },
) {
  const { permission_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/permissions/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 检查用户权限 POST /api/v1/permissions/check */
export async function postPermissionsCheck(
  body: {
    user_id: string;
    resource_type: string;
    action: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/permissions/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户权限 GET /api/v1/permissions/user/${param0} */
export async function getPermissionsUserUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPermissionsUserUserIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/permissions/user/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 为角色分配权限 POST /api/v1/roles/${param0}/permissions */
export async function postRolesRoleIdPermissions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postRolesRoleIdPermissionsParams,
  body: {
    permission_ids: string[];
  },
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/roles/${param0}/permissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 移除角色的权限 DELETE /api/v1/roles/${param0}/permissions/${param1} */
export async function deleteRolesRoleIdPermissionsPermissionId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRolesRoleIdPermissionsPermissionIdParams,
  options?: { [key: string]: any },
) {
  const { role_id: param0, permission_id: param1, ...queryParams } = params;
  return request<any>(`/api/v1/roles/${param0}/permissions/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
