# 认证和权限管理

本文档描述了 UAC Admin 的认证和权限管理机制，包括路由守卫和 API 请求拦截的处理逻辑。

## 目录

- [认证相关页面](#认证相关页面)
- [Token 管理](#token-管理)
- [路由守卫](#路由守卫)
- [API 请求拦截](#api-请求拦截)
- [错误处理](#错误处理)

## 认证相关页面

系统定义了以下认证相关页面，这些页面有特殊的访问规则：

```typescript
const authPages = ['/auth/login', '/auth/reset-password'];
```

这些页面的访问规则：
1. 未登录用户可以访问，但需要 `app` 参数
2. 已登录用户访问这些页面会被重定向到首页

## Token 管理

Token 管理相关的功能集中在 `src/utils/auth.ts` 中：

### 基本操作

```typescript
// 保存 token
saveAuth(token: string, refreshToken?: string)

// 获取 token
getAuth(): { token: string | null, refreshToken: string | null }

// 清除 token
clearAuth()
```

### Token 验证

```typescript
// 验证 token 是否有效
checkTokenValid(): Promise<boolean>
```

## 路由守卫

路由守卫逻辑在 `src/utils/auth.ts` 中的 `checkAuth` 函数实现：

```typescript
checkAuth(setInitialState?: (callback: (state: any) => any) => void): Promise<boolean>
```

### 处理流程

1. **认证页面访问规则**：
   - 如果是认证页面（登录/重置密码）且有 `app` 参数，允许访问
   - 如果是认证页面但没有 `app` 参数，且用户已登录，重定向到首页

2. **非认证页面访问规则**：
   - 如果没有 token，重定向到登录页
   - 如果有 token，验证其有效性：
     - 验证成功：更新用户信息，允许访问
     - 验证失败：清除 token，重定向到登录页

3. **重定向处理**：
   - 保存当前页面 URL 作为重定向目标
   - 保留 `app` 参数（如果存在）

### 触发时机

路由守卫在以下情况触发：
1. 页面切换时（通过 `app.tsx` 中的 `onPageChange`）
2. 登录成功后（验证权限并跳转）
3. 手动调用 `checkAuth` 函数

## API 请求拦截

API 请求拦截在 `src/utils/requestInterceptors.ts` 中实现：

### 请求拦截器

```typescript
requestInterceptors: RequestConfig['requestInterceptors']
```

处理流程：
1. 检查是否是无需 token 的 API：
   ```typescript
   const noTokenApis = [
     '/auth/login',           // 登录
     '/auth/register',        // 注册
     '/auth/captcha',         // 验证码
     '/auth/health',          // 健康检查
     '其他'
   ];
   ```
2. 对于需要 token 的 API：
   - 从 localStorage 获取 token
   - 添加到请求头的 `Authorization` 字段
   - 格式：`Bearer ${token}`

### 响应拦截器

```typescript
responseInterceptors: RequestConfig['responseInterceptors']
```

处理流程：
1. **401 未授权处理**：
   - 清除 token
   - 清除用户状态
   - 重定向到登录页

2. **业务错误处理**：
   - 检查 `data.success === false`
   - 根据 `showType` 显示不同类型的错误提示
   - 支持的错误类型：
     ```typescript
     enum ErrorShowType {
       SILENT = 0,        // 静默处理
       WARN_MESSAGE = 1,  // 警告提示
       ERROR_MESSAGE = 2, // 错误提示
       NOTIFICATION = 3,  // 通知提示
       REDIRECT = 9,      // 重定向
     }
     ```

## 错误处理

### 401 未授权

统一通过 `handleUnauthorized` 函数处理：
```typescript
handleUnauthorized(setInitialState?: (callback: (state: any) => any) => void)
```

处理流程：
1. 清除 token 和用户状态
2. 根据当前页面决定是否重定向：
   - 非认证页面：重定向到登录页
   - 认证页面且有 `app` 参数：保持当前页面
   - 认证页面但无 `app` 参数：重定向到登录页

### 业务错误

通过 `errorConfig` 统一处理：
```typescript
errorConfig: RequestConfig['errorConfig']
```

处理流程：
1. 根据 `showType` 显示对应类型的错误提示
2. 对于需要重定向的错误，跳转到错误页面
3. 对于需要显示错误码的情况，额外显示错误码信息

## 使用示例

### 路由守卫

```typescript
// 在页面切换时触发
onPageChange: () => {
  checkAuth(setInitialState);
}

// 登录成功后验证
await checkAuth(setInitialState);
```

### API 请求

```typescript
// 无需特殊处理，拦截器会自动添加 token
const response = await api.someEndpoint();
```

### 错误处理

```typescript
// 401 错误会自动处理
// 业务错误会自动根据 showType 显示对应提示
try {
  await api.someEndpoint();
} catch (error) {
  // 错误已经被拦截器处理
  // 这里可以添加额外的错误处理逻辑
}
``` 