// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 上传图片 上传图片并转换为 WebP 格式。支持 JPG、PNG、GIF 和 WebP 格式，文件大小限制为 5MB。 POST /api/v1/uploads */
export async function postUploads(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<{
    code?: number;
    message?: string;
    data?: {
      file_id?: string;
      url?: string;
      size?: number;
      mime_type?: string;
    };
  }>('/api/v1/uploads', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 获取图片 获取图片，支持生成缩略图。缩略图参数格式为：w-宽度_h-高度_m-模式，例如：w-100_h-100_m-cover。模式可选值：cover（默认，裁剪）或 contain（包含）。 GET /api/v1/uploads/${param0} */
export async function getUploadsFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUploadsFileIdParams,
  options?: { [key: string]: any },
) {
  const { file_id: param0, ...queryParams } = params;
  return request<string>(`/api/v1/uploads/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 获取文件 GET /api/v1/uploads/files/${param0} */
export async function getUploadsFilesFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUploadsFilesFileIdParams,
  options?: { [key: string]: any },
) {
  const { file_id: param0, ...queryParams } = params;
  return request<string>(`/api/v1/uploads/files/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取图片 GET /api/v1/uploads/images/${param0} */
export async function getUploadsImagesFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUploadsImagesFileIdParams,
  options?: { [key: string]: any },
) {
  const { file_id: param0, ...queryParams } = params;
  return request<string>(`/api/v1/uploads/images/${param0}`, {
    method: 'GET',
    params: {
      // mode has a default value: cover
      mode: 'cover',
      ...queryParams,
    },
    ...(options || {}),
  });
}
