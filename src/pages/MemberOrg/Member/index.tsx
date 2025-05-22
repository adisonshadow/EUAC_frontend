import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RedoOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  ProForm,
  ProFormCascader,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";
import { useSetState } from "ahooks";
import { Button, Drawer, Modal, Spin, Space, App } from "antd";
import React, { useRef, useState, useEffect } from "react";
import { history, useLocation, useModel } from '@umijs/max';
import { columns, formSchema } from "./Schemas";
import { getUsers, postUsers, putUsersUserId, deleteUsersUserId, getUsersUserId } from "@/services/UAC/api/users";
import { getDepartmentPath } from '@/utils/department';
import DepartmentPath from '@/components/DepartmentPath';
import AvatarUpload from '@/components/AvatarUpload';
import { Avatar } from "antd";

const PAGE_SIZE: number = 30;

const Page: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const { message: messageApi } = App.useApp();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page') || '1', 10);

  const [state, setState] = useSetState<any>({
    tableColumns: columns.concat([
      {
        title: "操作",
        dataIndex: "option",
        valueType: "option",
        render: (_: any, record: any) => [
          <Button
            title="编辑"
            key="edit"
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => {
              setState({
                updateValue: record,
                isUpdate: true,
                isUpdateModalOpen: true,
              });
            }}
          />,
          <Button
            title="删除"
            key="delete"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除该成员吗？',
                onOk: async () => {
                  try {
                    await deleteUsersUserId({
                      user_id: record.user_id,
                    });
                    messageApi.success('删除成功');
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  } catch (error) {
                    messageApi.error('删除失败');
                  }
                },
              });
            }}
          />,
          <Button
            title="详情"
            key="view"
            icon={<EyeOutlined />}
            onClick={async () => {
              try {
                setLoading(true);
                const response = await getUsersUserId({
                  user_id: record.user_id,
                });
                if (response.code === 200 && response.data) {
                  setState({
                    detailsValue: response.data,
                    isDetailsViewOpen: true,
                    isDetailsEditable: false,
                  });
                } else {
                  messageApi.error('获取用户详情失败');
                }
              } catch (error) {
                messageApi.error('获取用户详情失败');
              } finally {
                setLoading(false);
              }
            }}
          />,
        ],
      },
    ]),
    pageFormSchema: formSchema,
    isUpdate: false,
    isUpdateModalOpen: false,
    isDetailsViewOpen: false,
    isDetailsEditable: false,
    updateValue: {},
    detailsValue: {},
  });

  const {
    tableColumns,
    pageFormSchema,
    isUpdate,
    isUpdateModalOpen,
    isDetailsViewOpen,
    isDetailsEditable,
    updateValue,
    detailsValue,
  } = state;

  const handleSaveDetails = async (values: any) => {
    try {
      await putUsersUserId({
        user_id: detailsValue.user_id,
      }, {
        ...values,
        department_id: Array.isArray(values.department_id) ? values.department_id[values.department_id.length - 1] : values.department_id,
      });
      messageApi.success('更新成功');
      setState({ 
        isDetailsEditable: false,
        detailsValue: { 
          ...detailsValue, 
          ...values,
          department_id: Array.isArray(values.department_id) ? values.department_id[values.department_id.length - 1] : values.department_id,
        },
      });
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      messageApi.error('更新失败');
    }
  };

  const detailColumns: ProDescriptionsItemProps[] = [
    {
      title: "用户ID",
      dataIndex: "user_id",
      copyable: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
      editable: isDetailsEditable,
    },
    {
      title: "头像",
      dataIndex: "avatar",
      render: (_, record) => {
        return <Avatar src={record.avatar || undefined} size={64} />;
      },
    },
    {
      title: "性别",
      dataIndex: "gender",
      valueEnum: {
        MALE: { text: '男' },
        FEMALE: { text: '女' },
      },
      editable: isDetailsEditable,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      editable: isDetailsEditable,
    },
    {
      title: "电话",
      dataIndex: "phone",
      editable: isDetailsEditable,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: {
        ACTIVE: { text: '在职', status: 'success' },
        DISABLED: { text: '离职', status: 'error' },
        LOCKED: { text: '已锁定', status: 'warning' },
        ARCHIVED: { text: '已归档', status: 'default' },
      },
      editable: isDetailsEditable,
    },
    {
      title: "所属部门",
      dataIndex: "department_id",
      render: (_, record) => {
        return <DepartmentPath departmentId={record.department_id} />;
      },
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      valueType: 'dateTime',
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer
      pageHeaderRender={() => {
        return <></>;
      }}
    >
      <ProTable
        defaultSize="small"
        actionRef={actionRef}
        rowKey="user_id"
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            icon={<PlusOutlined />}
            onClick={() => {
              setState({
                isUpdate: false,
                isUpdateModalOpen: true,
              });
            }}
          >
            新建
          </Button>,
          <Button
            type="primary"
            key="sync"
            ghost
            icon={<RedoOutlined />}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.reload();
                messageApi.success('同步成功');
              }
            }}
          >
            批量导入
          </Button>,
        ]}
        request={async (params) => {
          try {
            // 更新 URL 参数
            const newQuery = new URLSearchParams(location.search);
            newQuery.set('page', params.current?.toString() || '1');
            history.push(`${location.pathname}?${newQuery.toString()}`);

            const response = await getUsers({
              size: PAGE_SIZE,
              page: params.current,
            });
            if (response.code === 200 && response.data) {
              return {
                data: response.data.items || [],
                success: true,
                total: response.data.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            messageApi.error('获取成员列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={tableColumns}
        pagination={{
          pageSize: PAGE_SIZE,
          showQuickJumper: false,
          showSizeChanger: false,
          current: currentPage,
        }}
        options={{
          density: false,
          fullScreen: true,
        }}
      />
      <Modal
        title={isUpdate ? "编辑" : "新建"}
        open={isUpdateModalOpen}
        onCancel={() => {
          setState({ isUpdateModalOpen: false });
        }}
        footer={null}
        width={800}
      >
        <BetaSchemaForm<any>
          {...pageFormSchema}
          defaultValue={updateValue}
          onFinish={async (value) => {
            try {
              if (isUpdate) {
                await putUsersUserId({
                  user_id: updateValue.user_id,
                }, {
                  status: value.status,
                });
                messageApi.success('更新成功');
              } else {
                await postUsers(value);
                messageApi.success('创建成功');
              }
              setState({ isUpdateModalOpen: false });
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } catch (error) {
              messageApi.error(isUpdate ? '更新失败' : '创建失败');
            }
          }}
        />
      </Modal>
      
      <Drawer
        width={800}
        open={isDetailsViewOpen}
        onClose={() => {
          setState({ 
            isDetailsViewOpen: false,
            isDetailsEditable: false,
          });
        }}
        title="用户详情"
        extra={
          <Space>
            {isDetailsEditable ? (
              <>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form) {
                      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }}
                >
                  保存
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setState({ isDetailsEditable: false });
                  }}
                >
                  取消
                </Button>
              </>
            ) : (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setState({ isDetailsEditable: true });
                }}
              >
                编辑
              </Button>
            )}
          </Space>
        }
      >
        <Spin spinning={loading}>
          {detailsValue?.user_id && (
            isDetailsEditable ? (
              <ProForm
                initialValues={{
                  ...detailsValue,
                  department_id: detailsValue.department_id ? getDepartmentPath(detailsValue.department_id, initialState?.departments || []) : [],
                }}
                onFinish={handleSaveDetails}
                submitter={false}
              >
                <ProForm.Group>
                  <ProFormText
                    name="name"
                    label="姓名"
                    width="md"
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProForm.Item
                    label="头像"
                    name="avatar"
                  >
                    <AvatarUpload 
                      value={detailsValue.avatar || undefined} 
                      onChange={(url) => {
                        const form = document.querySelector('form');
                        if (form) {
                          const input = form.querySelector('input[name="avatar"]') as HTMLInputElement;
                          if (input) {
                            input.value = url;
                          }
                        }
                      }}
                    />
                  </ProForm.Item>
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormSelect
                    name="gender"
                    label="性别"
                    width="md"
                    valueEnum={{
                      MALE: '男',
                      FEMALE: '女',
                    }}
                  />
                  <ProFormText
                    name="email"
                    label="邮箱"
                    width="md"
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormText
                    name="phone"
                    label="电话"
                    width="md"
                  />
                  <ProFormSelect
                    name="status"
                    label="状态"
                    width="md"
                    valueEnum={{
                      ACTIVE: { text: '在职', status: 'success' },
                      DISABLED: { text: '离职', status: 'error' },
                      LOCKED: { text: '已锁定', status: 'warning' },
                      ARCHIVED: { text: '已归档', status: 'default' },
                    }}
                  />
                </ProForm.Group>
                <ProForm.Group>
                  <ProFormCascader
                    name="department_id"
                    label="所属部门"
                    width="md"
                    fieldProps={{
                      options: initialState?.departmentsTreeData || [],
                      changeOnSelect: false,
                      expandTrigger: 'hover',
                      showSearch: {
                        filter: (inputValue, path) => {
                          return path.some(option => 
                            String(option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                          );
                        },
                      },
                    }}
                  />
                </ProForm.Group>
              </ProForm>
            ) : (
              <ProDescriptions
                column={2}
                dataSource={detailsValue}
                columns={detailColumns}
              />
            )
          )}
        </Spin>
      </Drawer>
    </PageContainer>
  );
};

export default Page;
