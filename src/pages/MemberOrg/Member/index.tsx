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
import { Button, Drawer, Modal, message } from "antd";
import React, { useRef } from "react";
import { columns, formSchema, formSchema1 } from "./Schemas";
import { getUsers, postUsers, putUsersUserId, deleteUsersUserId } from "@/services/UAC/api/users";

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [state, setState] = useSetState<any>({
    tableColumns: columns.concat([
      {
        title: "操作",
        dataIndex: "option",
        valueType: "option",
        // width:'300px',
        render: (_: any, record: any) => [
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setState({
                isDateModalOpen: true,
                updateValue: record,
              });
            }}
          >
            请假
          </Button>,
          <Button
            ghost
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setState({
                updateValue: record,
                isUpdate: true,
                isUpdateModalOpen: true,
              });
            }}
          >
            修改
          </Button>,
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除该成员吗？',
                onOk: async () => {
                  try {
                    await deleteUsersUserId({
                      user_id: record.id,
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
          >
            删除
          </Button>,
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setState({
                detailsValue: record,
                isDetailsViewOpen: true,
              });
            }}
          >
            详情
          </Button>,
        ],
      },
    ]),
    pageFormSchema: formSchema,
    isUpdate: false,
    isUpdateModalOpen: false,
    isDetailsViewOpen: false,
    updateValue: {},
    detailsValue: {},
    isDateModalOpen: false,
  });

  const {
    tableColumns,
    pageFormSchema,
    isUpdate,
    isUpdateModalOpen,
    isDetailsViewOpen,
    updateValue,
    detailsValue,
    isDateModalOpen
  } = state;

  return (
    <PageContainer
      pageHeaderRender={() => {
        return <></>;
      }}
    >
      <ProTable
        defaultSize="small"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={() => [
          // <>上次同步时间：20分钟前</>,
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
            icon={<RedoOutlined />}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.reload();
                message.success('同步成功');
              }
            }}
          >
            立即同步
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getUsers({
              page: params.current,
              limit: params.pageSize,
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
                  user_id: updateValue.id,
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
      <Modal
        title='请假时间'
        open={isDateModalOpen}
        onCancel={() => {
          setState({ isDateModalOpen: false });
        }}
        footer={null}
        width={800}
      >
        <BetaSchemaForm<any>
          {...formSchema1}
          defaultValue={updateValue}
          onFinish={async (value) => {
            try {
              // TODO: 调用请假 API
              message.success('请假申请提交成功');
              setState({ isDateModalOpen: false });
              if (actionRef.current) {
                actionRef.current.reload();
              }
            } catch (error) {
              message.error('请假申请提交失败');
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
      >
        {detailsValue?.id && (
          <ProDescriptions
            column={2}
            title={detailsValue?.id}
            request={async () => ({
              data: detailsValue || {},
            })}
            params={{
              id: detailsValue?.id,
            }}
            columns={columns as ProDescriptionsItemProps[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Page;
