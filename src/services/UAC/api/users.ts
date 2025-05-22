// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户列表 GET /api/v1/users */
export async function getUsers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersParams,
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      total?: number;
      items?: {
        user_id?: string;
        username?: string;
        email?: string;
        status?: 'active' | 'inactive';
        created_at?: string;
      }[];
      current?: number;
      size?: number;
    };
  }>('/api/v1/users', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // size has a default value: 10
      size: '10',

      ...params,
    },
    ...(options || {}),
  });
}

/** 创建用户 POST /api/v1/users */
export async function postUsers(
  body: {
    username: string;
    password: string;
    email: string;
    status?: 'active' | 'inactive';
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      user_id?: string;
      username?: string;
      email?: string;
      status?: 'active' | 'inactive';
      created_at?: string;
    };
  }>('/api/v1/users', {
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
    /** 用户姓名 */
    name?: string;
    /** 电子邮箱 */
    email?: string;
    /** 用户头像URL */
    avatar?: string;
    /** 用户性别 */
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    /** 电话号码 */
    phone?: string;
    /** 用户状态 */
    status?: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
    /** 部门ID */
    department_id?: string;
  },
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<{ code?: number; message?: string; data?: API.User }>(
    `/api/v1/users/${param0}`,
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

/** 删除用户 DELETE /api/v1/users/${param0} */
export async function deleteUsersUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsersUserIdParams,
  options?: { [key: string]: any },
) {
  const { user_id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: Record<string, any>;
  }>(`/api/v1/users/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取用户详情 GET /api/v1/users/${param0} */
export async function getUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUsersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      user_id?: string;
      username?: string;
      email?: string;
      status?: 'active' | 'inactive';
      created_at?: string;
      updated_at?: string;
    };
  }>(`/api/v1/users/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/v1/users/${param0} */
export async function putUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUsersIdParams,
  body: {
    email?: string;
    status?: 'active' | 'inactive';
  },
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      user_id?: string;
      username?: string;
      email?: string;
      status?: 'active' | 'inactive';
      updated_at?: string;
    };
  }>(`/api/v1/users/${param0}`, {
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
export async function deleteUsersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUsersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<{ code?: number; message?: string }>(
    `/api/v1/users/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    },
  );
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
