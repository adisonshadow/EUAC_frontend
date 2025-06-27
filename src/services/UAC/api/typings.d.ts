declare namespace API {
  type APIConnectConfig = {
    /** 应用API私钥（由服务端根据 application_id 和 salt 生成） */
    app_secret?: string;
    /** 签名盐值 */
    salt: string;
  };

  type APIDataScope = true;

  type Application = {
    /** 应用ID */
    application_id?: string;
    /** 应用名称 */
    name?: string;
    /** 应用编码 */
    code?: string;
    /** 应用状态 */
    status?: 'ACTIVE' | 'DISABLED';
    /** 是否启用SSO */
    sso_enabled?: boolean;
    sso_config?: SSOConfig;
    /** 是否启用API服务 */
    api_enabled?: boolean;
    api_connect_config?: APIConnectConfig;
    api_data_scope?: APIDataScope;
    /** 应用描述 */
    description?: string;
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 删除时间 */
    deleted_at?: string;
  };

  type Captcha = {
    captcha_id?: string;
    target_position?: { x?: number; y?: number };
    image?: string;
    created_at?: string;
    expires_at?: string;
  };

  type deleteApplicationsIdParams = {
    /** 应用ID */
    id: string;
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
    status?: 'ACTIVE' | 'DISABLED';
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
    status?: 'ACTIVE' | 'DISABLED';
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

  type getApplicationsIdParams = {
    /** 应用ID */
    id: string;
  };

  type getApplicationsParams = {
    /** 页码（当 size 不为 -1 时有效） */
    page?: number;
    /** 每页数量，设置为 -1 时返回所有记录不分页 */
    size?: number;
    /** 应用名称（支持模糊匹配） */
    name?: string;
    /** 应用编码（支持模糊匹配） */
    code?: string;
    /** 应用状态 */
    status?: 'ACTIVE' | 'DISABLED';
  };

  type getApplicationsSsoIdParams = {
    /** 应用ID */
    id: string;
  };

  type getAuthCheckParams = {
    /** 应用ID，用于SSO模式下的token验证

**使用场景**：
- 第三方系统需要验证特定应用的token
- 使用应用特定的salt进行JWT验证

**注意事项**：
- 应用必须已启用SSO功能
- 应用必须配置有效的salt
- 不传此参数时使用默认JWT密钥验证
 */
    app?: string;
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
    /** 页码（当 size 不为 -1 时有效） */
    page?: number;
    /** 每页数量，设置为 -1 时返回所有记录不分页 */
    size?: number;
    /** 部门名称（支持模糊匹配） */
    name?: string;
    /** 部门编码（支持模糊匹配） */
    code?: string;
    /** 部门状态 */
    status?: 'ACTIVE' | 'DISABLED';
  };

  type getPermissionsCheckParams = {
    /** 用户ID */
    user_id: any;
    /** 资源类型 */
    resource_type: any;
    /** 操作类型，多个操作类型用逗号分隔，例如：create,read,update */
    action: any;
  };

  type getPermissionsParams = {
    /** 页码（当 size 不为 -1 时有效） */
    page?: number;
    /** 每页数量，设置为 -1 时返回所有记录不分页 */
    size?: number;
    /** 权限名称（支持模糊匹配） */
    name?: string;
    /** 权限编码（支持模糊匹配） */
    code?: string;
    /** 权限类型 */
    type?: 'MENU' | 'BUTTON' | 'API';
    /** 权限状态 */
    status?: 'ACTIVE' | 'DISABLED';
  };

  type getPermissionsPermissionIdParams = {
    /** 权限ID */
    permission_id: string;
  };

  type getPermissionsUsersUserIdParams = {
    /** 用户ID */
    user_id: any;
  };

  type getRolesCheckPermissionParams = {
    /** 权限编码 */
    permission_code: any;
  };

  type getRolesParams = {
    /** 页码（当 size 不为 -1 时有效） */
    page?: number;
    /** 每页数量，设置为 -1 时返回所有记录不分页 */
    size?: number;
    /** 角色名称（支持模糊匹配） */
    name?: string;
    /** 角色编码（支持模糊匹配） */
    code?: string;
    /** 角色状态 */
    status?: 'ACTIVE' | 'DISABLED';
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
    status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
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
    status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 删除时间（软删除） */
    deleted_at?: string;
  };

  type postApplicationsIdGenerateSecretParams = {
    /** 应用ID */
    id: string;
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

  type postUsersUserIdChangePasswordParams = {
    /** 用户ID */
    user_id: string;
  };

  type postUsersUserIdRestoreParams = {
    /** 用户ID */
    user_id: any;
  };

  type putApplicationsIdParams = {
    /** 应用ID */
    id: string;
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
    status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
    /** 创建时间 */
    created_at?: string;
    /** 更新时间 */
    updated_at?: string;
    /** 删除时间 */
    deleted_at?: string;
    /** 角色权限列表 */
    permissions?: Permission[];
  };

  type RoleListResponse = {
    code?: number;
    message?: string;
    data?: { total?: number; items?: Role[]; page?: number; size?: number };
  };

  type RolePermission = {
    /** 权限ID */
    permission_id?: string;
    /** 权限名称 */
    name?: string;
    /** 权限编码 */
    code?: string;
    /** 资源类型 */
    resource_type?: 'MENU' | 'BUTTON' | 'API';
    /** 操作类型列表 */
    actions?: ('create' | 'read' | 'update' | 'delete')[];
  };

  type RoleResponse = {
    code?: number;
    message?: string;
    data?: Role;
  };

  type SSOConfig = {
    /** SSO使用的协议 */
    protocol: 'SAML' | 'CAS' | 'OIDC' | 'OAuth';
    /** SSO回调地址 */
    redirect_uri: string;
    /** SSO签名盐值，用于JWT签名 */
    salt: string;
    /** 基于currenttime、salt，使用 bcrypt 生成的Hash值 */
    secret?: string;
    /** 当前时间戳， 用于生成secret */
    currentTimestample?: number;
    /** 其他SSO协议特定的参数 */
    additional_params?: Record<string, any>;
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
    status?: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
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
