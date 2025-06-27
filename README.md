# README

## UAC(User Authorization Control) Frontend 

1. 目录权限

```bash
# 保证当前用户有目录访问权限(注意你的实际安装目录的路径)
sudo chown -R $USER ~/MOM/UAC-Admin
```

2. 离线内网安装
```bash
########## 外网
# 创建并填充离线包目录
mkdir offline-packages
cd offline-packages

# 下载 package.json 中列出的所有依赖
npm pack $(cat ../package.json | jq -r '.dependencies | keys[]')

# 将以下文件复制到移动存储设备：
# 项目源码（包括 package.json 和 package-lock.json/yarn.lock）
# 生成的离线包文件（.tgz 或 .tar.gz）
# 离线依赖包目录（如果手动下载）

########## 内网
# 方案一：使用 npm 离线包
npm install --offline --production --no-audit

# 方案二：使用 yarn 离线缓存
yarn install --production --offline
```

## 开发

1. 基于 OpenAPI3 生成 API 方法  
   (因 Umi 自带的插件版本安装过程中有大量问题，故弃用 Umi Open API)

- 配置文件： ./openapi2ts.config.ts
- 生成命令： npm run openapi2ts

2. git
```bash
 # 按需：跳过校验提交到github
 git commit --no-verify -m "initial commit"

 # 提交到github
 git push -u origin main

```
