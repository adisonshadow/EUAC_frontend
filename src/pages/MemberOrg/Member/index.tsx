import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from "@ant-design/pro-components";
import { useSetState } from "ahooks";
import { Button, Drawer, Modal, message, Spin } from "antd";
import React, { useRef, useState, useEffect } from "react";
import { history, useLocation } from '@umijs/max';
import { columns, formSchema } from "./Schemas";
import { getUsers, postUsers, putUsersUserId, deleteUsersUserId, getUsersUserId } from "@/services/UAC/api/users";

const PAGE_SIZE: number = 30;

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
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
                    message.success('删除成功');
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  } catch (error) {
                    message.error('删除失败');
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
                  });
                } else {
                  message.error('获取用户详情失败');
                }
              } catch (error) {
                message.error('获取用户详情失败');
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
    updateValue: {},
    detailsValue: {},
  });

  const {
    tableColumns,
    pageFormSchema,
    isUpdate,
    isUpdateModalOpen,
    isDetailsViewOpen,
    updateValue,
    detailsValue,
  } = state;

  const detailColumns: ProDescriptionsItemProps[] = [
    {
      title: "用户ID",
      dataIndex: "user_id",
      copyable: true,
    },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "头像",
      dataIndex: "avatar",
      valueType: 'image',
    },
    {
      title: "性别",
      dataIndex: "gender",
      valueEnum: {
        MALE: { text: '男' },
        FEMALE: { text: '女' },
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "电话",
      dataIndex: "phone",
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
    },
    {
      title: "部门ID",
      dataIndex: "department_id",
      copyable: true,
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
                message.success('同步成功');
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
            message.error('获取成员列表失败');
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
                message.success('更新成功');
              } else {
                await postUsers(value);
                message.success('创建成功');
              }
              setState({ isUpdateModalOpen: false });
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } catch (error) {
              message.error(isUpdate ? '更新失败' : '创建失败');
            }
          }}
        />
      </Modal>
      
      <Drawer
        width={800}
        open={isDetailsViewOpen}
        onClose={() => {
          setState({ isDetailsViewOpen: false });
        }}
        title="用户详情"
      >
        <Spin spinning={loading}>
          {detailsValue?.user_id && (
            <ProDescriptions
              column={2}
              dataSource={detailsValue}
              columns={detailColumns}
            />
          )}
        </Spin>
      </Drawer>
    </PageContainer>
  );
};

export default Page;
