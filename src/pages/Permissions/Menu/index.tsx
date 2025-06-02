import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProTable,
  type ProColumns,
} from "@ant-design/pro-components";
import { Button, message, Space, Modal } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState } from "react";
import { getPermissions, postPermissions } from "@/services/UAC/api/permissions";
import { tableColumns, formFields } from "./schema";
import { buildMenuTree } from "./utils";
import type { PermissionResponse, MenuPermission } from "./types";
import { useSetState } from "ahooks";
import { highlightTableRow } from '@/utils/highlight';

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const highlightTimerRef = useRef<number>();

  const searchFormRef = useRef();

  // 递归获取所有权限的 ID
  const getAllPermissionIds = (permissions: MenuPermission[]): string[] => {
    return permissions.reduce((acc: string[], permission: MenuPermission) => {
      if (permission.permission_id) {
        acc.push(permission.permission_id);
      }
      if (permission.children && permission.children.length > 0) {
        acc.push(...getAllPermissionIds(permission.children));
      }
      return acc;
    }, []);
  };

  // 递归处理数据，添加搜索文本
  const processDataWithSearch = (data: MenuPermission[], searchText: string): MenuPermission[] => {
    return data.map(item => {
      const processedItem = {
        ...item,
        _searchText: searchText,
      };
      if (item.children && item.children.length > 0) {
        processedItem.children = processDataWithSearch(item.children, searchText);
      }
      return processedItem;
    });
  };

  const [state, setState] = useSetState({
    isCreateModalOpen: false,
    createValue: {},
  });

  const {
    isCreateModalOpen,
    createValue,
  } = state;

  // 添加操作列
  const columns: ProColumns<MenuPermission>[] = [
    {
      title: "权限名称",
      dataIndex: "name",
      width: 220,
      render: (dom: React.ReactNode, record: MenuPermission) => {
        const text = String(dom || '');
        const searchText = record._searchText || '';
        if (!searchText) return text;
        
        const index = text.toLowerCase().indexOf(searchText.toLowerCase());
        if (index === -1) return text;
        
        const beforeStr = text.substring(0, index);
        const matchStr = text.substring(index, index + searchText.length);
        const afterStr = text.substring(index + searchText.length);
        
        return (
          <span>
            {beforeStr}
            <span style={{ color: '#f50', backgroundColor: '#ffd591' }}>{matchStr}</span>
            {afterStr}
          </span>
        );
      },
      search: {
        transform: (value: string) => {
          setSearchText(value);
          return {};
        },
      },
    },
    {
      title: "权限编码",
      dataIndex: "code",
      width: 120,
      render: (dom: React.ReactNode, record: MenuPermission) => {
        const text = String(dom || '');
        const searchText = record._searchText || '';
        if (!searchText) return text;
        
        const index = text.toLowerCase().indexOf(searchText.toLowerCase());
        if (index === -1) return text;
        
        const beforeStr = text.substring(0, index);
        const matchStr = text.substring(index, index + searchText.length);
        const afterStr = text.substring(index + searchText.length);
        
        return (
          <span>
            {beforeStr}
            <span style={{ color: '#f50', backgroundColor: '#ffd591' }}>{matchStr}</span>
            {afterStr}
          </span>
        );
      },
      search: {
        transform: (value: string) => {
          setSearchText(value);
          return {};
        },
      },
    },
    ...tableColumns.filter((col: any) => !['name', 'code'].includes(col.dataIndex)),
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option' as const,
      width: 120,
      render: (_: unknown, record: MenuPermission) => {
        // 虚拟节点不显示操作按钮
        if (record.permission_id.startsWith('virtual-')) {
          return null;
        }
        return [
          <Button
            title="查看"
            key="view"
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => {
              // TODO: 实现查看详情功能
              message.info('查看详情功能待实现');
            }}
          />,
        ];
      },
    },
  ];

  const handleReset = () => {
    console.log('筛选条件已重置');
    // 重置后的操作
  };

  return (
    <>
      {contextHolder}
      <PageContainer
        pageHeaderRender={() => {
          return <></>;
        }}
      >
        <ProTable
          defaultSize="small"
          actionRef={actionRef}
          formRef={searchFormRef}
          rowKey="permission_id"
          onRow={(record) => ({
            id: `permission-row-${record.permission_id}`,
            style: {
              backgroundColor: highlightedRowId === record.permission_id && isHighlighted ? '#fffbe6' : undefined,
              transition: 'background-color 0.3s',
            },
          })}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          toolBarRender={() => [
            <Space>
              <Button
                type="primary"
                key="create"
                icon={<PlusOutlined />}
                loading={createLoading}
                onClick={() => {
                  setState({
                    isCreateModalOpen: true,
                    createValue: {},
                  });
                }}
              >
                新建
              </Button>
            </Space>
          ]}
          request={async () => {
            try {
              console.log('开始请求权限数据...');
              setLoading(true);
              const response = await getPermissions({
                resource_type: 'MENU',
              });

              console.log('API 原始响应:', response);
              console.log('API 响应状态码:', response.code);
              console.log('API 响应数据:', response.data);
              console.log('API 响应消息:', response.message);

              if (response.code === 200 && response.data?.items) {
                console.log('API 返回的 items 数组:', response.data.items);
                console.log('items 数组长度:', response.data.items.length);
                console.log('items 数组类型:', Array.isArray(response.data.items));
                
                if (response.data.items.length === 0) {
                  console.log('警告: API 返回的 items 数组为空');
                }

                // 检查每个 item 的结构
                response.data.items.forEach((item, index) => {
                  console.log(`Item ${index} 结构:`, {
                    permission_id: item.permission_id,
                    name: item.name,
                    code: item.code,
                    actions: item.actions,
                    parent_id: item.parent_id,
                    resource_type: item.resource_type,
                    created_at: item.created_at,
                  });
                });

                // 构建树形数据
                console.log('开始构建树形数据...');
                const treeData = buildMenuTree(response.data.items);
                console.log('树形数据构建完成:', treeData);
                console.log('树形数据长度:', treeData.length);
                
                if (treeData.length === 0) {
                  console.log('警告: 构建的树形数据为空');
                }

                // 设置所有权限的 ID 为展开状态
                const allIds = getAllPermissionIds(treeData);
                setExpandedRowKeys(allIds);

                // 处理数据，添加搜索文本
                const processedData = processDataWithSearch(treeData, searchText);

                return {
                  data: processedData,
                  success: true,
                  total: processedData.length,
                };
              }
              
              console.log('API 响应异常:', {
                code: response.code,
                message: response.message,
                hasData: !!response.data,
                hasItems: !!response.data?.items,
              });
              
              messageApi.error(response.message || '获取菜单权限列表失败');
              return {
                data: [],
                success: false,
                total: 0,
              };
            } catch (error) {
              console.error('获取权限数据时发生错误:', error);
              if (error instanceof Error) {
                console.error('错误详情:', {
                  name: error.name,
                  message: error.message,
                  stack: error.stack,
                });
              }
              messageApi.error('获取菜单权限列表失败');
              return {
                data: [],
                success: false,
                total: 0,
              };
            } finally {
              setLoading(false);
              console.log('请求完成，loading 状态已重置');
            }
          }}
          columns={columns}
          pagination={false}
          options={{
            density: false,
            fullScreen: true,
          }}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (expandedRows) => {
              setExpandedRowKeys(expandedRows as string[]);
            },
            childrenColumnName: 'children',
            indentSize: 20,
          }}
          loading={loading}
        />

        {/* 新建权限 */}
        <Modal
          title="新建权限"
          open={isCreateModalOpen}
          onCancel={() => {
            setState({ 
              isCreateModalOpen: false,
              createValue: {},
            });
          }}
          footer={null}
          width={800}
        >
          <BetaSchemaForm
            layoutType="Form"
            columns={formFields}
            initialValues={createValue}
            grid={true}
            rowProps={{
              gutter: [16, 16],
            }}
            colProps={{
              span: 12,
            }}
            submitter={{
              searchConfig: {
                submitText: '创建',
              },
              submitButtonProps: {
                loading: createLoading,
              },
            }}
            onFinish={async (values: any) => {
              try {
                setCreateLoading(true);
                console.log('提交的表单数据:', values);
                const response = await postPermissions({
                  name: values.name,
                  code: values.code,
                  description: values.description,
                  resource_type: 'MENU',
                  actions: values.actions,
                });
                
                console.log('提交到 API 的数据:', {
                  name: values.name,
                  code: values.code,
                  description: values.description,
                  resource_type: 'MENU',
                  actions: values.actions,
                });
                
                if (response.code && response.code >= 200 && response.code < 300) {
                  messageApi.success('创建成功');
                  setState({
                    isCreateModalOpen: false,
                    createValue: {},
                  });
                  if (actionRef.current) {
                    // 设置要高亮的行 ID
                    setHighlightedRowId(response.data?.permission_id || null);
                    setIsHighlighted(true);
                    // 重新加载表格
                    actionRef.current.reload();
                    // 3秒后清除高亮状态
                    if (highlightTimerRef.current) {
                      window.clearTimeout(highlightTimerRef.current);
                    }
                    highlightTimerRef.current = window.setTimeout(() => {
                      setIsHighlighted(false);
                      setHighlightedRowId(null);
                    }, 3000);
                  }
                  return true;
                } else {
                  messageApi.error(response.message || '创建失败');
                  return false;
                }
              } catch (error: any) {
                messageApi.error(error.message || '创建失败');
                return false;
              } finally {
                setCreateLoading(false);
              }
            }}
          />
        </Modal>
      </PageContainer>
    </>
  );
};

export default Page; 