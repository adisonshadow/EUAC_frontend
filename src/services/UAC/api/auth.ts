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

/** 检查用户登录状态 检查当前用户的登录状态 GET /api/v1/auth/check */
export async function getAuthCheck(options?: { [key: string]: any }) {
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
    ...(options || {}),
  });
}

/** 用户登录 用户登录接口，支持验证码验证 POST /api/v1/auth/login */
export async function postAuthLogin(
  body: {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
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

/** 刷新访问令牌 使用刷新令牌获取新的访问令牌 POST /api/v1/auth/refresh */
export async function postAuthRefresh(
  body: {
    /** 刷新令牌 */
    refresh_token: string;
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
