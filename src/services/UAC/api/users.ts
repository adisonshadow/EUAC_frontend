// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户列表 GET /api/v1/users */
export async function getUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/users', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建新用户 POST /api/v1/users */
export async function postUsers(
  body: API.User,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取用户详情 GET /api/v1/users/${param0} */
export async function getUsersUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersUserIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      user_id?: string;
      username?: string;
      name?: string;
      avatar?: string;
      gender?: 'MALE' | 'FEMALE' | 'OTHER';
      email?: string;
      phone?: string;
      status?: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
      department_id?: string;
      created_at?: string;
      updated_at?: string;
    };
  }>(`/api/v1/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新用户信息 PUT /api/v1/users/${param0} */
export async function putUsersUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUsersUserIdParams,
  body: {
    status?: 'active' | 'inactive';
  },
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/users/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/v1/users/${param0} */
export async function deleteUsersUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsersUserIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 恢复已删除的用户 POST /api/v1/users/${param0}/restore */
export async function postUsersUserIdRestore(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUsersUserIdRestoreParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/users/${param0}/restore`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}
