# SSO 回调接口文档

## 概述

本文档描述了 IAM 系统在进行 SSO（单点登录）回调时，通过 POST 方式传递的身份认证和用户信息。

## 接口信息

- **请求方式**: POST
- **Content-Type**: application/x-www-form-urlencoded
- **回调地址**: 由应用配置的 `redirect_uri` 决定

## 请求参数

### 1. 身份提供者（IdP）信息

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| idp | string | 是 | 身份提供者标识，固定值为 "IAM" |

### 2. 时间信息

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| timestamp | string | 是 | 当前时间戳（毫秒），用于验证请求时效性 |
| nonce | string | 是 | 随机字符串，用于防止重放攻击 |

### 3. 令牌信息

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| access_token | string | 是 | 访问令牌，用于访问受保护的资源 |
| refresh_token | string | 否 | 刷新令牌，用于获取新的访问令牌 |
| token_type | string | 是 | 令牌类型，固定值为 "Bearer" |
| expires_in | string | 是 | 访问令牌的有效期（秒），默认 3600 秒（1小时） |

### 4. 用户信息

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| user_info | string | 是 | JSON 格式的用户信息，包含以下字段： |

#### user_info 字段详情

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| user_id | string | 是 | 用户唯一标识 |
| username | string | 是 | 用户名 |
| name | string | 是 | 用户姓名 |
| email | string | 是 | 用户邮箱 |
| phone | string | 否 | 用户手机号 |
| gender | string | 否 | 用户性别，可选值：'MALE'/'FEMALE'/'OTHER' |
| status | string | 是 | 用户状态，可选值：'ACTIVE'/'DISABLED'/'LOCKED'/'ARCHIVED' |
| department_id | string | 否 | 部门ID |

### 5. SSO 配置参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| client_id | string | 是* | 应用客户端ID，来自 sso_config.additional_params |
| client_signature | string | 是* | 客户端签名，使用 timestamp + client_secret 加密生成 |
| issuer | string | 否* | 令牌颁发者，来自 sso_config.additional_params |
| [其他参数] | string | 否* | 来自 sso_config.additional_params 的其他参数 |

> 注：带 * 的参数仅在 sso_config 中配置了 additional_params 时必填

### 6. 其他信息

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| state | string | 否 | 状态参数，用于防止 CSRF 攻击 |

## 示例

### 请求示例

```http
POST /callback HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

idp=IAM&
timestamp=1677649421000&
nonce=a1b2c3d4e5f6&
access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&
refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&
token_type=Bearer&
expires_in=3600&
client_id=your_client_id&
client_signature=encrypted_signature&
issuer=https://iam.example.com&
state=xyz123&
user_info={"user_id":"123","username":"john.doe","name":"John Doe","email":"john.doe@example.com","phone":"13800138000","gender":"MALE","status":"ACTIVE","department_id":"456"}
```

### 客户端签名生成说明

1. 获取当前时间戳（毫秒）
2. 将时间戳与 client_secret 拼接
3. 使用 SHA256 进行加密
4. 将加密结果进行 Base64 编码

示例代码：
```javascript
const timestamp = Date.now();
const message = `${timestamp}${client_secret}`;
const signature = btoa(sha256(message));
```

## 安全说明

1. 所有令牌信息通过 POST 方式传输，避免在 URL 中暴露敏感信息
2. 使用 HTTPS 确保传输安全
3. 包含 state 参数防止 CSRF 攻击
4. 令牌有效期限制为 1 小时，需要时可通过 refresh_token 刷新
5. 使用时间戳和 nonce 防止重放攻击
6. client_secret 不直接传输，而是通过签名方式验证

## 错误处理

应用在接收到回调后，应当：

1. 验证所有必填参数是否存在
2. 验证时间戳是否在有效期内（建议 5 分钟内）
3. 验证 nonce 是否重复使用
4. 验证客户端签名是否正确
5. 验证令牌的有效性
6. 验证 state 参数是否匹配
7. 处理用户信息的完整性

如果验证失败，应当返回适当的错误信息，并记录日志。

## 注意事项

1. 应用应当妥善保管接收到的令牌信息
2. 建议在服务端验证令牌的有效性
3. 用户信息应当根据实际需求进行缓存
4. 定期清理过期的令牌信息
5. 注意保护 client_secret 的安全性
6. 建议实现 nonce 的存储和验证机制，防止重放攻击 