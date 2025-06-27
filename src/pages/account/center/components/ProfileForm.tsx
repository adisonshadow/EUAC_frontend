import React from 'react';
import { Form, Input, Button, message, Select } from '@oceanbase/design';
import { useModel } from '@umijs/max';
import api from '@/services/UAC/api';
import AvatarUpload from '@/components/AvatarUpload';
import { genderEnum } from '@/enums';
import { getImageUrl } from '@/utils/image';

interface ProfileFormProps {
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { initialState, refresh } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialState?.currentUser) {
      form.setFieldsValue({
        name: initialState.currentUser.name,
        email: initialState.currentUser.email,
        phone: initialState.currentUser.phone,
        gender: initialState.currentUser.gender,
        avatar: initialState.currentUser.avatar,
      });
    }
  }, [initialState?.currentUser, form]);

  const handleSubmit = async (values: any) => {
    if (!initialState?.currentUser?.user_id) {
      message.error('用户信息不存在');
      return;
    }

    try {
      setLoading(true);
      const response = await api.users.putUsersUserId(
        { user_id: initialState.currentUser.user_id },
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          avatar: values.avatar,
        },
      );

      if (response.code === 200) {
        message.success('个人资料更新成功');
        await refresh();
        onSuccess();
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error: any) {
      message.error(error.message || '更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Form.Item
        label="头像"
        name="avatar"
        extra="支持 jpg、png、gif 格式，大小不超过 2MB"
      >
        <AvatarUpload
          value={initialState?.currentUser?.avatar || undefined}
          onChange={(value) => {
            form.setFieldValue('avatar', value);
          }}
        />
      </Form.Item>
      <Form.Item
        name="name"
        label="姓名"
        rules={[{ required: true, message: '请输入姓名' }]}
      >
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="手机号"
        rules={[
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
        ]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item
        name="gender"
        label="性别"
        rules={[{ required: true, message: '请选择性别' }]}
      >
        <Select
          placeholder="请选择性别"
          options={Object.entries(genderEnum).map(([value, { text }]) => ({
            value,
            label: text,
          }))}
          allowClear
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          保存修改
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm; 