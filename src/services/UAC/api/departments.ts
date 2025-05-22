// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取部门列表 获取部门列表，支持分页和筛选。如果不提供分页参数，则返回所有记录。 GET /api/v1/departments */
export async function getDepartments(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepartmentsParams,
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      total?: number;
      items?: {
        department_id?: string;
        name?: string;
        code?: string;
        parent_id?: string;
        status?: 'active' | 'inactive';
        created_at?: string;
      }[];
      current?: number;
      size?: number;
    };
  }>('/api/v1/departments', {
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

/** 获取部门详情 获取指定部门的详细信息。需要在请求头中携带 Bearer Token。

请求头格式：
```
Authorization: Bearer <your_token>
```
 GET /api/v1/departments/${param0} */
export async function getDepartmentsDepartmentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepartmentsDepartmentIdParams,
  options?: { [key: string]: any },
) {
  const { department_id: param0, ...queryParams } = params;
  return request<{
    code?: number;
    message?: string;
    data?: {
      department_id?: string;
      name?: string;
      code?: string;
      parent_id?: string;
      status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
      description?: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string;
    };
  }>(`/api/v1/departments/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新部门信息 PUT /api/v1/departments/${param0} */
export async function putDepartmentsDepartmentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putDepartmentsDepartmentIdParams,
  body: API.Department,
  options?: { [key: string]: any },
) {
  const { department_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/departments/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除部门 DELETE /api/v1/departments/${param0} */
export async function deleteDepartmentsDepartmentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDepartmentsDepartmentIdParams,
  options?: { [key: string]: any },
) {
  const { department_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/departments/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取部门成员 GET /api/v1/departments/${param0}/members */
export async function getDepartmentsDepartmentIdMembers(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepartmentsDepartmentIdMembersParams,
  options?: { [key: string]: any },
) {
  const { department_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/departments/${param0}/members`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取部门树结构 获取完整的部门树结构，包含所有子部门。需要在请求头中携带 Bearer Token。

请求头格式：
```
Authorization: Bearer <your_token>
```
 GET /api/v1/departments/tree */
export async function getDepartmentsTree(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      items?: {
        department_id?: string;
        name?: string;
        code?: string;
        parent_id?: string;
        status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
        description?: string;
        children?: API.Department[];
      }[];
    };
  }>('/api/v1/departments/tree', {
    method: 'GET',
    ...(options || {}),
  });
}
