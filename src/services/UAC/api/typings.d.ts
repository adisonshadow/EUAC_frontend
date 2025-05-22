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

  type deleteUsersIdParams = {
    /** 用户ID */
    id: string;
  };

  type deleteUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Department = {
    /** 部门ID */
    department_id?: string;
    /** 部门名称 */
    name: string;
    /** 部门编码 */
    code: string;
    /** 父部门ID */
    parent_id?: string;
    /** 部门状态 */
    status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
    /** 部门描述 */
    description?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 删除时间 */
    deleted_at?: string;
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
    size?: number;
    /** 部门名称 */
    name?: string;
    /** 部门编码 */
    code?: string;
    /** 状态 */
    status?: 'active' | 'inactive';
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

  type getUploadsFileIdParams = {
    /** 文件ID */
    file_id: string;
    /** 缩略图参数 */
    thumb?: string;
  };

  type getUploadsFilesFileIdParams = {
    /** 文件ID */
    file_id: string;
  };

  type getUploadsImagesFileIdParams = {
    /** 文件ID */
    file_id: string;
    /** 是否返回缩略图 */
    thumb?: boolean;
    /** 缩略图宽度（默认300） */
    width?: number;
    /** 缩略图高度（默认300） */
    height?: number;
    /** 缩略图模式（cover-裁剪, contain-包含） */
    mode?: 'cover' | 'contain';
  };

  type getUsersIdParams = {
    /** 用户ID */
    id: string;
  };

  type getUsersParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
    /** 用户名 */
    username?: string;
    /** 状态 */
    status?: 'active' | 'inactive';
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

  type putUsersIdParams = {
    /** 用户ID */
    id: string;
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
    /** 用户姓名 */
    name?: string;
    /** 电子邮箱 */
    email: string;
    /** 密码 */
    password: string;
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
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 删除时间 */
    deleted_at?: string;
  };
}
