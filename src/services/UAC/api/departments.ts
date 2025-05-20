// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取部门列表 GET /api/v1/departments */
export async function getDepartments(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepartmentsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/departments', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 创建部门 POST /api/v1/departments */
export async function postDepartments(
  body: API.Department,
  options?: { [key: string]: any },
) {
  return request<any>('/api/v1/departments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取部门详情 GET /api/v1/departments/${param0} */
export async function getDepartmentsDepartmentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDepartmentsDepartmentIdParams,
  options?: { [key: string]: any },
) {
  const { department_id: param0, ...queryParams } = params;
  return request<any>(`/api/v1/departments/${param0}`, {
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

/** 获取部门树结构 GET /api/v1/departments/tree */
export async function getDepartmentsTree(options?: { [key: string]: any }) {
  return request<API.Department[]>('/api/v1/departments/tree', {
    method: 'GET',
    ...(options || {}),
  });
}
