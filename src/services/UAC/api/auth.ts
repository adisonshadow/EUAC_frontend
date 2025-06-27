// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取验证码 获取登录验证码图片 GET /api/v1/auth/captcha */
export async function getAuthCaptcha(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    message?: string;
    data?: { captcha_id?: string; bg_url?: string; puzzle_url?: string };
  }>('/api/v1/auth/captcha', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 检查用户登录状态 检查当前用户的登录状态，支持两种使用方式：

1. **标准模式**：不传任何参数，使用默认JWT密钥验证token
2. **SSO模式**：通过query参数app传递应用ID，使用对应应用的salt验证token

**使用场景**：
- 前端应用验证用户登录状态
- 第三方系统验证SSO token有效性
- 获取当前登录用户的详细信息

**认证方式**：Bearer Token

**响应说明**：
- 200: 用户已登录，返回用户信息
- 400: 无效的应用ID或SSO配置（仅SSO模式）
- 401: 未登录或token无效
- 500: 服务器内部错误
 GET /api/v1/auth/check */
export async function getAuthCheck(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAuthCheckParams,
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      user_id?: string;
      username?: string;
      name?: string;
      avatar?: string;
      gender?: string;
      email?: string;
      phone?: string;
      status?: string;
      department_id?: string;
    };
  }>('/api/v1/auth/check', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 用户登录 用户登录接口，支持验证码验证和SSO配置返回 POST /api/v1/auth/login */
export async function postAuthLogin(
  body: {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 应用ID，如果提供则返回该应用的SSO配置 */
    application_id?: string;
    /** 验证码数据 */
    captcha_data?: { captcha_id?: string };
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      token?: string;
      refresh_token?: string;
      expires_in?: string;
      user_id?: string;
      sso?: {
        application_id?: string;
        application_name?: string;
        application_code?: string;
        sso_config?: API.SSOConfig;
      };
    };
  }>('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登出 用户登出接口，使当前访问令牌失效 POST /api/v1/auth/logout */
export async function postAuthLogout(
  body: {
    /** 刷新令牌 */
    refresh_token?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{ code?: number; message?: string; data?: any }>(
    '/api/v1/auth/logout',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 刷新访问令牌 使用刷新令牌获取新的访问令牌，支持第三方系统通过app参数刷新token POST /api/v1/auth/refresh */
export async function postAuthRefresh(
  body: {
    /** 刷新令牌 */
    refresh_token: string;
    /** 应用ID，用于第三方系统刷新token（可选） */
    app?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: { token?: string; refresh_token?: string; expires_in?: string };
  }>('/api/v1/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
