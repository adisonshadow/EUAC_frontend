import React, { useState } from 'react';
import { Upload, Avatar, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface AvatarUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>(
    value ? [
      {
        uid: '-1',
        name: 'avatar.png',
        status: 'done',
        url: value,
      },
    ] : []
  );

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    
    if (file.status === 'done') {
      if (file.response?.code === 200) {
        message.success('上传成功');
        onChange?.(file.response.data.url);
      } else {
        message.error('上传失败');
      }
    } else if (file.status === 'error') {
      message.error('上传失败');
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <div>
      {!disabled && (
        <ImgCrop rotationSlider>
          <Upload
            name="file"
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={onPreview}
            action="/api/v1/upload"
            headers={{
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('只能上传图片文件！');
              }
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error('图片大小不能超过 2MB！');
              }
              return isImage && isLt2M;
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      )}
      {value && (
        <Avatar
          src={value}
          size={64}
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default AvatarUpload; 