declare namespace API {
  type deleteDepartmentsDepartmentIdParams = {
    /** 部门ID */
    department_id: string;
  };

  type deletePermissionsPermissionIdParams = {
    /** 权限ID */
    permission_id: string;
  };

  type deleteRolesRoleIdParams = {
    /** 角色ID */
    role_id: string;
  };

  type deleteRolesRoleIdPermissionsPermissionIdParams = {
    /** 角色ID */
    role_id: string;
    /** 权限ID */
    permission_id: string;
  };

  type deleteUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Department = {
    /** 部门ID */
    id?: string;
    /** 部门名称 */
    name: string;
    /** 父部门ID */
    parent_id?: string;
  };

  type getDataPermissionsRulesParams = {
    /** 角色ID */
    role_id?: string;
    /** 资源类型 */
    resource_type?: string;
  };

  type getDepartmentsDepartmentIdMembersParams = {
    /** 部门ID */
    department_id: string;
    /** 是否包含子部门成员 */
    include_children?: boolean;
  };

  type getDepartmentsDepartmentIdParams = {
    /** 部门ID */
    department_id: string;
  };

  type getDepartmentsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
  };

  type getPermissionsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
  };

  type getPermissionsUserUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type getRolesParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
  };

  type getRolesRoleIdParams = {
    /** 角色ID */
    role_id: string;
  };

  type getUsersParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
  };

  type getUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Permission = {
    /** 权限ID */
    id?: string;
    /** 资源类型 */
    resource_type: string;
    /** 操作类型 */
    action: string;
    /** 权限条件 */
    conditions?: Record<string, any>;
  };

  type postRolesRoleIdPermissionsParams = {
    /** 角色ID */
    role_id: string;
  };

  type postUsersUserIdRestoreParams = {
    /** 用户ID */
    user_id: string;
  };

  type putDepartmentsDepartmentIdParams = {
    /** 部门ID */
    department_id: string;
  };

  type putPermissionsPermissionIdParams = {
    /** 权限ID */
    permission_id: string;
  };

  type putRolesRoleIdParams = {
    /** 角色ID */
    role_id: string;
  };

  type putUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Role = {
    /** 角色ID */
    id?: string;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description?: string;
  };

  type User = {
    /** 用户ID */
    id?: string;
    /** 用户名 */
    username: string;
    /** 电子邮箱 */
    email: string;
    /** 密码 */
    password: string;
    /** 用户状态 */
    status?: 'active' | 'inactive';
  };
}
