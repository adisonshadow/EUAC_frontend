import React from 'react';
import { Form, Input, Space, Button } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

interface SearchFormProps {
  onSearch: (value: string) => void;
  onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values.searchText || '');
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleSearch}
      style={{ margin: 0 }}
    >
      <Form.Item
        name="searchText"
        style={{ margin: 0, marginRight: 8 }}
      >
        <Input
          placeholder="请输入权限名称或编码"
          allowClear
          onPressEnter={handleSearch}
          style={{ width: 180 }}
        />
      </Form.Item>
      <Form.Item style={{ margin: 0, marginRight: 8 }}>
        <Space>
          <Button
            type="primary"
            ghost
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            查找
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={handleReset}
          />
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchForm; 