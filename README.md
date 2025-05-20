# README

## 安装

1. 目录权限

```bash
# 保证当前用户有目录访问权限(注意你的实际安装目录的路径)
sudo chown -R $USER ~/MOM/UAC-Admin
```

## 开发

1. 基于 OpenAPI3 生成 API 方法  
   (因 Umi 自带的插件版本安装过程中有大量问题，故弃用 Umi Open API)

- 配置文件： ./openapi2ts.config.ts
- 生成命令： npm run openapi2ts
