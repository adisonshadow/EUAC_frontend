import React, { useState, useRef, forwardRef } from 'react';
import { Upload, Image, message } from 'antd';
import type { GetProp, UploadFile, UploadProps, ImageProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { postUploads } from '@/services/UAC/api/uploads';
import { getImageUrl } from '@/utils/image';

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
        name: 'avatar',
        status: 'done',
        url: getImageUrl(value),
      },
    ] : []
  );

  const imageRef = useRef<HTMLDivElement>(null);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    // 只保留最新上传的文件
    const latestFile = newFileList[newFileList.length - 1];
    setFileList(latestFile ? [latestFile] : []);
    
    if (file.status === 'done') {
      if (file.response?.code === 200) {
        message.success('上传成功');
        onChange?.(file.response.data.id);
      } else {
        message.error('上传失败');
      }
    } else if (file.status === 'error') {
      message.error('上传失败');
    }
  };

  const onPreview = async (file: UploadFile) => {
    if (imageRef.current) {
      const firstImage = imageRef.current.querySelector('img');
      if (firstImage) {
        firstImage.click();
      }
    }
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
            maxCount={1}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                setLoading(true);
                const response = await postUploads({}, {}, file as File);
                onSuccess?.(response);
              } catch (error) {
                onError?.(error as Error);
              } finally {
                setLoading(false);
              }
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
        <div ref={imageRef} style={{ display: 'none' }}>
          <Image
            src={getImageUrl(value)}
            alt="avatar"
            preview
          />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload; 