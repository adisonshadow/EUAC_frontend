// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取角色列表 GET /api/v1/roles */
export async function getRoles(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/roles', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建角色 POST /api/v1/roles */
export async function postRoles(
  body: API.Role,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取角色详情 GET /api/v1/roles/${param0} */
export async function getRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getRolesRoleIdParams,
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/roles/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新角色信息 PUT /api/v1/roles/${param0} */
export async function putRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putRolesRoleIdParams,
  body: API.Role,
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/roles/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /api/v1/roles/${param0} */
export async function deleteRolesRoleId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteRolesRoleIdParams,
  options?: { [key: string]: any },
) {
  const { role_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/roles/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
