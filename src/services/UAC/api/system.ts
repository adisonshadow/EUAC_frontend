// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 健康检查 GET /api/v1/health */
export async function getHealth(options?: { [key: string]: any }) {
  return request<{
    code?: number;
    message?: string;
    data?: {
      status?: string;
      timestamp?: string;
      version?: string;
      uptime?: number;
    };
  }>('/api/v1/health', {
    method: 'GET',
    ...(options || {}),
  });
}
