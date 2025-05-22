import KoaBody from 'koa-body';
import path from 'path';
import fs from 'fs';

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 koa-body
const upload = KoaBody({
  multipart: true,
  formidable: {
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 限制 5MB
    onFileBegin: (name, file) => {
      // 生成文件名：时间戳 + 随机数 + 原始扩展名
      const ext = path.extname(file.originalFilename || '');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      file.newFilename = uniqueSuffix + ext;
    },
  },
});

export default upload; 