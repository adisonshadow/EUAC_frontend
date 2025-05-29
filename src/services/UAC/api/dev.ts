// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 开发环境专用登录接口 仅限开发环境使用的登录接口，无需验证码 POST /api/v1/dev/login */
export async function postDevLogin(
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
      user?: {
        user_id?: string;
        username?: string;
        email?: string;
        roles?: {
          role_id?: string;
          role_name?: string;
          code?: string;
          permissions?: {
            permission_id?: string;
            permission_name?: string;
            code?: string;
          }[];
        }[];
      };
    };
  }>('/api/v1/dev/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
