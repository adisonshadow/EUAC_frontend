// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 检查用户登录状态 检查用户的登录状态是否有效。需要在请求头中携带 Bearer Token。

请求头格式：
```
Authorization: Bearer <your_token>
```

示例：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
 GET /api/v1/auth/check */
export async function getAuthCheck(options?: { [key: string]: any }) {
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
    };
  }>('/api/v1/auth/check', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户登录 POST /api/v1/auth/login */
export async function postAuthLogin(
  body: {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
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

/** 用户登出 POST /api/v1/auth/logout */
export async function postAuthLogout(
  body: {
    refresh_token: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: Record<string, any>;
  }>('/api/v1/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 刷新访问令牌 POST /api/v1/auth/refresh */
export async function postAuthRefresh(
  body: {
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

/** 生成滑块验证码 POST /api/v1/captcha/generate */
export async function postCaptchaGenerate(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    message?: string;
    data?: { captcha_id?: string; bg_url?: string; puzzle_url?: string };
  }>('/api/v1/captcha/generate', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 验证滑块位置 POST /api/v1/captcha/verify */
export async function postCaptchaVerify(
  body: {
    /** 验证码ID */
    captcha_id: string;
    /** 滑块X坐标 */
    x: number;
    /** 滑块Y坐标 */
    y: number;
    /** 滑动耗时（毫秒） */
    duration?: number;
    /** 滑动轨迹 */
    trail?: { x?: number; y?: number; timestamp?: number }[];
  },
  options?: { [key: string]: any },
) {
  return request<{
    code?: number;
    message?: string;
    data?: { verified?: boolean };
  }>('/api/v1/captcha/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
