// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 上传文件 POST /api/v1/uploads */
export async function postUploads(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUploadsParams,
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
      id?: string;
      type?: 'image' | 'video' | 'document';
      url?: string;
      original_name?: string;
      size?: number;
      mime_type?: string;
      extension?: string;
    };
  }>('/api/v1/uploads', {
    method: 'POST',
    params: {
      // type has a default value: image
      type: 'image',
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** 获取文件 根据文件ID获取文件，如果配置了 needAuth=false，则无需认证 GET /api/v1/uploads/files/${param0} */
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

/** 获取图片 根据文件ID获取图片，如果配置了 needAuth=false，则无需认证 GET /api/v1/uploads/images/${param0} */
export async function getUploadsImagesFileId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUploadsImagesFileIdParams,
  options?: { [key: string]: any },
) {
  const { file_id: param0, ...queryParams } = params;
  return request<string>(`/api/v1/uploads/images/${param0}`, {
    method: 'GET',
    params: {
      // width has a default value: 300
      width: '300',
      // height has a default value: 300
      height: '300',
      // mode has a default value: cover
      mode: 'cover',
      ...queryParams,
    },
    ...(options || {}),
  });
}
