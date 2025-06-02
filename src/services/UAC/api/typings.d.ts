declare namespace API {
  type Captcha = {
    captcha_id?: string;
    target_position?: { x?: number; y?: number };
    image?: string;
    created_at?: string;
    expires_at?: string;
  };

  type deleteDepartmentsDepartmentIdParams = {
    /** 部门ID */
    department_id: string;
  };

  type deletePermissionsPermissionIdParams = {
    /** 权限ID */
    permission_id: any;
  };

  type deleteRolesRoleIdParams = {
    /** 角色ID */
    role_id: any;
  };

  type deleteUploadsFileIdParams = {
    /** 文件ID */
    file_id: string;
  };

  type deleteUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Department = {
    /** 部门ID */
    department_id?: string;
    /** 部门名称 */
    name?: string;
    /** 部门编码 */
    code?: string;
    /** 父部门ID */
    parent_id?: string;
    /** 部门状态 */
    status?: 'ACTIVE' | 'INACTIVE';
    /** 部门描述 */
    description?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 部门主管ID */
    manager_id?: string;
    /** 删除时间（软删除） */
    deleted_at?: string;
    manager?: User;
    parent?: Department;
    /** 子部门列表 */
    children?: Department[];
  };

  type DepartmentTreeItem = {
    /** 部门ID */
    department_id?: string;
    /** 部门名称 */
    name?: string;
    /** 部门描述 */
    description?: string;
    /** 父部门ID */
    parent_id?: string;
    /** 部门状态 */
    status?: 'ACTIVE' | 'INACTIVE';
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 子部门列表 */
    children?: DepartmentTreeItem[];
  };

  type Error = {
    code?: number;
    message?: string;
    data?: Record<string, any>;
  };

  type File = {
    id?: string;
    filename?: string;
    originalname?: string;
    mimetype?: string;
    size?: number;
    path?: string;
    created_at?: string;
    updated_at?: string;
  };

  type getDepartmentsDepartmentIdParams = {
    /** 部门ID */
    department_id: string;
  };

  type getDepartmentsDepartmentIdUsersParams = {
    /** 部门ID */
    department_id: string;
    /** 是否包含子部门的用户 */
    include_children?: boolean;
  };

  type getDepartmentsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
    /** 部门名称（模糊搜索） */
    name?: string;
    /** 部门状态 */
    status?: 'ACTIVE' | 'INACTIVE';
  };

  type getPermissionsCheckParams = {
    /** 用户ID */
    user_id: any;
    /** 资源类型 */
    resource_type: any;
    /** 操作类型 */
    action: any;
  };

  type getPermissionsParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    limit?: number;
    /** 搜索关键词 */
    search?: string;
    /** 资源类型 */
    resource_type?: 'MENU' | 'BUTTON' | 'API';
  };

  type getPermissionsPermissionIdParams = {
    /** 权限ID */
    permission_id: string;
  };

  type getPermissionsUsersUserIdParams = {
    /** 用户ID */
    user_id: any;
  };

  type getRolesParams = {
    /** 页码 */
    page?: any;
    /** 每页数量 */
    size?: any;
    /** 角色状态 */
    status?: any;
  };

  type getRolesRoleIdParams = {
    /** 角色ID */
    role_id: any;
  };

  type getUploadsFileIdParams = {
    /** 文件ID */
    file_id: string;
  };

  type getUploadsImagesFileIdParams = {
    /** 文件ID */
    file_id: string;
    /** 图片宽度 */
    width?: number;
    /** 图片高度 */
    height?: number;
    /** 图片质量（1-100） */
    quality?: number;
    /** 输出格式 */
    format?: 'jpeg' | 'jpg' | 'png' | 'webp' | 'gif';
  };

  type getUsersParams = {
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
    /** 用户名（支持模糊匹配） */
    username?: string;
    /** 姓名（支持模糊匹配） */
    name?: string;
    /** 邮箱（支持模糊匹配） */
    email?: string;
    /** 电话（支持模糊匹配） */
    phone?: string;
    /** 用户状态 */
    status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
    /** 性别 */
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    /** 部门ID */
    department_id?: string;
    /** 用户ID（精确匹配） */
    user_id?: string;
  };

  type getUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type Permission = {
    /** 权限ID */
    permission_id?: string;
    /** 权限名称 */
    name?: string;
    /** 权限编码 */
    code?: string;
    /** 权限描述 */
    description?: string;
    /** 资源类型 */
    resource_type?: 'MENU' | 'BUTTON' | 'API';
    /** 操作类型列表 */
    actions?: ('create' | 'read' | 'update' | 'delete')[];
    /** 父权限ID */
    parent_id?: string;
    /** 权限状态 */
    status?: 'ACTIVE' | 'INACTIVE';
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 权限名称 */
    permission_name?: string;
    /** 权限类型 */
    type?: 'MENU' | 'BUTTON' | 'API';
  };

  type postPermissionsPermissionIdRolesParams = {
    /** 权限ID */
    permission_id: any;
  };

  type postRolesRoleIdPermissionsParams = {
    /** 角色ID */
    role_id: any;
  };

  type postUploadsParams = {
    /** 文件类型，默认为配置中的默认类型 */
    type?: 'image' | 'document' | 'video' | 'audio';
  };

  type postUsersUserIdAvatarParams = {
    /** 用户ID */
    user_id: any;
  };

  type postUsersUserIdRestoreParams = {
    /** 用户ID */
    user_id: any;
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
    role_id: any;
  };

  type putRolesRoleIdPermissionsParams = {
    /** 角色ID */
    role_id: any;
  };

  type putUsersUserIdParams = {
    /** 用户ID */
    user_id: string;
  };

  type putUsersUserIdRolesParams = {
    /** 用户ID */
    user_id: string;
  };

  type putUsersUserIdStatusParams = {
    /** 用户ID */
    user_id: any;
  };

  type Role = {
    /** 角色ID */
    role_id?: string;
    /** 角色名称 */
    role_name?: string;
    /** 角色编码 */
    code?: string;
    /** 角色描述 */
    description?: string;
    /** 角色状态 */
    status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    created_at?: string;
    updated_at?: string;
    /** 角色权限列表 */
    permissions?: Permission[];
  };

  type User = {
    /** 用户ID */
    user_id?: string;
    /** 用户名 */
    username?: string;
    /** 邮箱 */
    email?: string;
    /** 电话 */
    phone?: string;
    /** 用户状态 */
    status?: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 密码（仅在创建时使用） */
    password?: string;
    /** 姓名 */
    name?: string;
    /** 性别 */
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    /** 头像URL */
    avatar?: string;
    /** 部门ID */
    department_id?: string;
    /** 最后登录时间 */
    last_login_at?: string;
    /** 删除时间（软删除） */
    deleted_at?: string;
    /** 用户角色列表 */
    roles?: Role[];
  };
}
