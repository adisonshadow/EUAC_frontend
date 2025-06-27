import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ActionType,
  BetaSchemaForm,
  PageContainer,
  ProTable,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormSwitch,
  ProFormGroup,
  ProFormDependency,
} from "@oceanbase/ui";
import { useSetState } from "ahooks";
import { Button, Drawer, Modal, Spin, Space, message, Form, Tabs } from "@oceanbase/design";
import React, { useRef, useState, useEffect } from "react";
import { useLocation } from '@umijs/max';
import { tableColumns, applicationEditFormColumns } from "./Schemas";
import { getApplications, postApplications, putApplicationsId, deleteApplicationsId, getApplicationsId, postApplicationsIdGenerateSecret, postApplicationsToken } from "@/services/UAC/api/applications";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "@oceanbase/design";

const PAGE_SIZE: number = 30;

interface ApplicationRecord extends API.Application {
  application_id: string;
  api_connect_config?: API.APIConnectConfig;
  api_data_scope?: API.APIDataScope;
}

const Page: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [apiConfigModalVisible, setApiConfigModalVisible] = useState(false);
  const [ssoConfigModalVisible, setSsoConfigModalVisible] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<ApplicationRecord | null>(null);
  const [apiConfigForm] = Form.useForm();
  const [ssoConfigForm] = Form.useForm();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get('page') || '1', 10);
  const [basicForm] = Form.useForm();


  useEffect(() => {
    // 

  }, []);

  const [state, setState] = useSetState<any>({
    tableColumns: [...tableColumns, {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      width: 120,
      render: (_: unknown, record: ApplicationRecord) => [
        <Button
          title="详情"
          key="view"
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={async () => {
            try {
              setLoading(true);
              setState({
                isDetailsViewOpen: false,
                detailsValue: {},
                isDetailsEditable: false,
              });
              
              const response = await getApplicationsId({
                id: record.application_id || '',
              });
              
              if (response.code === 200 && response.data) {
                setTimeout(() => {
                  setState({
                    detailsValue: response.data,
                    isDetailsViewOpen: true,
                    isDetailsEditable: false,
                  });
                }, 0);
                basicForm.setFieldsValue(response.data);
              } else {
                messageApi.error('获取应用详情失败');
              }
            } catch (error) {
              messageApi.error('获取应用详情失败');
            } finally {
              setLoading(false);
            }
          }}
        />,
        <Button
          title="API 配置"
          key="api-config"
          type="primary"
          ghost
          onClick={() => {
            setCurrentApplication(record);
            apiConfigForm.setFieldsValue({
              api_enabled: record.api_enabled,
              api_connect_config: record.api_connect_config,
              api_data_scope: record.api_data_scope,
            });
            setApiConfigModalVisible(true);
          }}
        >
          API
        </Button>,
        <Button
          title="SSO 配置"
          key="sso-config"
          type="primary"
          ghost
          onClick={() => {
            setCurrentApplication(record);
            ssoConfigForm.setFieldsValue({
              sso_enabled: record.sso_enabled,
              sso_config: record.sso_config,
            });
            setSsoConfigModalVisible(true);
          }}
        >
          SSO
        </Button>,
        <Button
          title="删除"
          key="delete"
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确定要删除该应用吗？',
              onOk: async () => {
                try {
                  await deleteApplicationsId({
                    id: record.application_id || '',
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
      ],
    }],
    isUpdate: false,
    isUpdateModalOpen: false,
    isDetailsViewOpen: false,
    isDetailsEditable: false,
    updateValue: {},
    detailsValue: {},
  });

  const {
    tableColumns: columns,
    isUpdate,
    isUpdateModalOpen,
    isDetailsViewOpen,
    isDetailsEditable,
    updateValue,
    detailsValue,
  } = state;

  const handleSaveDetails = async () => {
    try {
      setLoading(true);
      setSaving(true);
      
      // 获取表单的值
      const values = await basicForm.validateFields();
      
      const response = await putApplicationsId(
        { id: detailsValue.application_id },
        values
      );

      if (response.code === 200) {
        messageApi.success('更新成功');
        setState({ 
          isDetailsEditable: false,
          detailsValue: { 
            ...detailsValue, 
            ...values,
          },
        });
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        messageApi.error(response.message || '更新失败');
      }
    } catch (error) {
      console.error('更新应用信息失败:', error);
      messageApi.error('更新失败');
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const showHelpModal = () => {
    setHelpModalVisible(true);
  };

  const hideHelpModal = () => {
    setHelpModalVisible(false);
  };

  const handleSaveApiConfig = async () => {
    try {
      if (!currentApplication) return;
      
      const values = await apiConfigForm.validateFields();
      const currentSalt = apiConfigForm.getFieldValue(['api_connect_config', 'salt']);
      const currentAppSecret = apiConfigForm.getFieldValue(['api_connect_config', 'app_secret']);
      const originalSalt = currentApplication.api_connect_config?.salt;
      const originalAppSecret = currentApplication.api_connect_config?.app_secret;

      // 检查是否设置了 salt 但未生成 app_secret
      if (currentSalt && !currentAppSecret) {
        Modal.confirm({
          title: '提示',
          content: '您已设置 Salt 但未生成 App Secret，是否需要立即生成？',
          okText: '生成',
          cancelText: '继续保存',
          onOk: async () => {
            try {
              const res = await postApplicationsIdGenerateSecret(
                { id: currentApplication.application_id },
                { salt: currentSalt }
              );
              if (res.code === 200 && res.data?.app_secret) {
                apiConfigForm.setFieldsValue({
                  api_connect_config: {
                    ...apiConfigForm.getFieldValue('api_connect_config'),
                    app_secret: res.data.app_secret,
                  },
                });
                messageApi.success('生成 App Secret 成功');
                // 继续保存
                await saveApiConfig(values);
              } else {
                messageApi.error(res.message || '生成失败');
              }
            } catch (e) {
              messageApi.error('生成失败');
            }
          },
          onCancel: async () => {
            // 继续保存
            await saveApiConfig(values);
          },
        });
        return;
      }

      // 检查是否修改了 salt 但未重新生成 app_secret
      if (currentSalt !== originalSalt && currentAppSecret === originalAppSecret) {
        Modal.confirm({
          title: '警告',
          content: 'Salt 已改变，需要重新生成 App Secret 才能正常使用，是否立即生成？',
          okText: '生成',
          cancelText: '取消保存',
          onOk: async () => {
            try {
              const res = await postApplicationsIdGenerateSecret(
                { id: currentApplication.application_id },
                { salt: currentSalt }
              );
              if (res.code === 200 && res.data?.app_secret) {
                apiConfigForm.setFieldsValue({
                  api_connect_config: {
                    ...apiConfigForm.getFieldValue('api_connect_config'),
                    app_secret: res.data.app_secret,
                  },
                });
                messageApi.success('生成 App Secret 成功');
                // 继续保存
                await saveApiConfig(values);
              } else {
                messageApi.error(res.message || '生成失败');
              }
            } catch (e) {
              messageApi.error('生成失败');
            }
          },
        });
        return;
      }

      // 正常保存
      await saveApiConfig(values);
    } catch (error) {
      messageApi.error('保存失败');
    }
  };

  const saveApiConfig = async (values: any) => {
    try {
      const response = await putApplicationsId(
        { id: currentApplication?.application_id || '' },
        {
          api_enabled: values.api_enabled,
          api_connect_config: values.api_connect_config,
          api_data_scope: values.api_data_scope,
        }
      );

      if (response.code === 200) {
        messageApi.success('保存成功');
        setApiConfigModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        messageApi.error(response.message || '保存失败');
      }
    } catch (error) {
      messageApi.error('保存失败');
    }
  };

  const handleGenerateAppSecret = async () => {
    try {
      if (!currentApplication) return;
      
      const salt = apiConfigForm.getFieldValue(['api_connect_config', 'salt']);
      if (!salt) {
        messageApi.error('请先输入 Salt');
        return;
      }

      const res = await postApplicationsIdGenerateSecret(
        { id: currentApplication.application_id },
        { salt }
      );

      if (res.code === 200 && res.data?.app_secret) {
        apiConfigForm.setFieldsValue({
          api_connect_config: {
            ...apiConfigForm.getFieldValue('api_connect_config'),
            app_secret: res.data.app_secret,
          },
        });
        messageApi.success('生成 App Secret 成功');
      } else {
        messageApi.error(res.message || '生成失败');
      }
    } catch (e) {
      messageApi.error('生成失败');
    }
  };

  const handleSaveSsoConfig = async () => {
    try {
      if (!currentApplication) return;
      
      const values = await ssoConfigForm.validateFields();
      
      const response = await putApplicationsId(
        { id: currentApplication.application_id || '' },
        {
          sso_enabled: values.sso_enabled,
          sso_config: values.sso_config,
        }
      );

      if (response.code === 200) {
        messageApi.success('保存成功');
        setSsoConfigModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        messageApi.error(response.message || '保存失败');
      }
    } catch (error) {
      messageApi.error('保存失败');
    }
  };

  return (
    <PageContainer pageHeaderRender={() => {
      return <></>;
    }}>
      {contextHolder}
      <ProTable<ApplicationRecord, API.getApplicationsParams, API.Application>
        headerTitle="应用列表"
        actionRef={actionRef}
        rowKey="application_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setState({
                isUpdate: false,
                isUpdateModalOpen: true,
                updateValue: {},
              });
            }}
          >
            新建
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          try {
            const response = await getApplications({
              page: current,
              size: pageSize,
              ...rest,
            });
            if (response.data) {
              const items = (response.data.items || []).map((item: API.Application) => ({
                ...item,
                application_id: item.application_id || '',
                sso_config: item.sso_config ? {
                  ...item.sso_config,
                  protocol: item.sso_config.protocol,
                  redirect_uri: item.sso_config.redirect_uri,
                  additional_params: item.sso_config.additional_params,
                } : undefined,
                api_connect_config: item.api_connect_config,
                api_data_scope: item.api_data_scope,
              } as ApplicationRecord));
              return {
                data: items,
                success: response.code === 200,
                total: response.data.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          pageSize: PAGE_SIZE,
          current: currentPage,
        }}
      />

      <Drawer
        title={isDetailsEditable ? "编辑应用" : "应用详情"}
        width={800}
        open={isDetailsViewOpen}
        onClose={() => {
          setState({
            isDetailsViewOpen: false,
            isDetailsEditable: false,
          });
        }}
        extra={
          <Space>
            {!isDetailsEditable ? (
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setState({
                    isDetailsEditable: true,
                  });
                }}
              >
                编辑
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setState({
                      isDetailsEditable: false,
                    });
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  loading={saving}
                  onClick={handleSaveDetails}
                >
                  保存
                </Button>
              </>
            )}
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Form.Provider>
            <ProForm
              form={basicForm}
              submitter={false}
              initialValues={detailsValue}
              disabled={!isDetailsEditable}
              grid={true}
              rowProps={{
                gutter: [16, 16],
              }}
              colProps={{
                span: 12,
              }}
            >
              <ProFormText
                name="name"
                label="应用名称"
                rules={[
                  { required: true, message: '请输入应用名称' },
                  { min: 2, message: '应用名称至少2个字符' },
                  { max: 50, message: '应用名称最多50个字符' },
                ]}
              />
              <ProFormText
                name="code"
                label="应用代码"
                rules={[
                  { required: true, message: '请输入应用代码' },
                  { pattern: /^[a-zA-Z0-9_-]+$/, message: '应用代码只能包含字母、数字、下划线和连字符' },
                ]}
              />
              <ProFormSelect
                name="status"
                label="状态"
                valueEnum={{
                  ACTIVE: { text: "启用", status: "Success" },
                  DISABLED: { text: "禁用", status: "Error" },
                }}
              />
              <ProFormTextArea
                name="description"
                label="描述"
                colProps={{
                  span: 24,
                }}
              />
            </ProForm>
          </Form.Provider>
        </Spin>
      </Drawer>

      <Modal
        title={isUpdate ? "编辑应用" : "新建应用"}
        open={isUpdateModalOpen}
        onCancel={() => {
          setState({
            isUpdateModalOpen: false,
            updateValue: {},
          });
        }}
        footer={null}
        destroyOnClose={true}
      >
        <BetaSchemaForm
          layout="vertical"
          columns={applicationEditFormColumns}
          initialValues={updateValue}
          onFinish={async (values: {
            name: string;
            code: string;
            status?: 'ACTIVE' | 'DISABLED';
            sso_enabled?: boolean;
            sso_config?: API.SSOConfig;
            api_enabled?: boolean;
            api_connect_config?: API.APIConnectConfig;
            api_data_scope?: API.APIDataScope;
            description?: string;
          }) => {
            try {
              setLoading(true);
              const response = await postApplications(values);
              if (response.code === 200) {
                messageApi.success({
                  content: '创建成功',
                  icon: '✓',
                });
                // 先关闭 Modal
                setState({
                  isUpdateModalOpen: false,
                  updateValue: {},
                });
                // 然后刷新数据
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              } else {
                messageApi.error({
                  content: response.message || '创建失败',
                  icon: '✕',
                });
              }
            } catch (error) {
              messageApi.error({
                content: '创建失败',
                icon: '✕',
              });
            } finally {
              setLoading(false);
            }
          }}
          grid={true}
          rowProps={{
            gutter: [16, 16],
          }}
          colProps={{
            span: 24,
          }}
        />
      </Modal>

      <Modal
        title="API 配置"
        open={apiConfigModalVisible}
        onCancel={() => setApiConfigModalVisible(false)}
        width={600}
        onOk={handleSaveApiConfig}
        okText="保存"
        cancelText="取消"
      >
        <ProForm
          form={apiConfigForm}
          submitter={false}
          grid={true}
          rowProps={{
            gutter: [16, 16],
          }}
          colProps={{
            span: 24,
          }}
        >
          <ProFormSwitch
            name="api_enabled"
            label="启用 API"
            colProps={{
              span: 24,
            }}
          />
          <ProFormDependency name={['api_enabled']}>
            {({ api_enabled }) => {
              if (!api_enabled) return null;
              return (
                <>
                  <ProFormGroup
                    title="连接配置"
                    colProps={{
                      span: 24,
                    }}
                  >
                    <ProFormText
                      name={['api_connect_config', 'salt']}
                      label="Salt"
                      colProps={{
                        span: 24,
                      }}
                    />
                    <ProFormText
                      name={['api_connect_config', 'app_secret']}
                      label="App Secret"
                      readonly
                      colProps={{
                        span: 24,
                      }}
                    />
                    <Space style={{ marginBottom: 24 }}>
                      <Button
                        type="primary"
                        onClick={handleGenerateAppSecret}
                      >
                        生成 app_secret
                      </Button>
                      <Tooltip title="点击查看使用说明">
                        <QuestionCircleOutlined
                          onClick={() => {
                            Modal.info({
                              title: 'App_secret / Token 使用说明',
                              width: 600,
                              content: (
                                <div>
                                  
                                  <h4>#1 获取 Token</h4>
                                  <p>1. 调用接口获取 Token：</p>
                                  <pre>
                                    {`POST /api/v1/applications/token
Content-Type: application/json

{
  "application_id": "${currentApplication?.application_id}",
  "app_secret": "${apiConfigForm.getFieldValue(['api_connect_config', 'app_secret'])}"
}`}
                                  </pre>
                                  <Space className="mb-4" direction="vertical" style={{ width: '100%' }}>
                                    <Button
                                      onClick={async () => {
                                        const app_secret = apiConfigForm.getFieldValue(['api_connect_config', 'app_secret']);
                                        if (!app_secret) {
                                          messageApi.error('请先生成 App Secret');
                                          return;
                                        }
                                        try {
                                          const res = await postApplicationsToken({
                                            application_id: currentApplication?.application_id || '',
                                            app_secret,
                                          });
                                          if (res.code === 200 && res.data?.token) {
                                            Modal.info({
                                              title: '测试 Token',
                                              width: 600,
                                              content: (
                                                <div>
                                                  <p>获取到的 Token：</p>
                                                  <pre style={{ wordBreak: 'break-all' }}>
                                                    {res.data.token}
                                                  </pre>
                                                  <p>该Token将在 24 小时后过期。</p>
                                                </div>
                                              ),
                                            });
                                            messageApi.success('获取 Token 成功');
                                          } else {
                                            messageApi.error(res.message || '获取 Token 失败');
                                          }
                                        } catch (e) {
                                          messageApi.error('获取 Token 失败');
                                        }
                                      }}
                                    >
                                      测试获取 Token
                                    </Button>
                                  </Space>

                                  <h4>#2 使用 Token</h4>
                                  <p>在请求头中添加以下字段：</p>
                                  <pre>
                                    {`X-API-Key: ${currentApplication?.application_id}
X-API-Sign: <your_token>`}
                                  </pre>

                                  <p>Token 默认有效期为 24 小时，建议开发人员在 Token 过期前（24 小时）更新并缓存新的 Token</p>

                                  <h4>#3 安全提醒</h4>
                                  <ul>
                                    <li>请妥善保管 App Secret，不要泄露给他人</li>
                                    <li>每次生成新的 App Secret 后，旧的 App Secret 将失效</li>
                                    <li>建议定期更换 Salt 和 App Secret</li>
                                  </ul>
                                </div>
                              ),
                            });
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                      </Tooltip>
                    </Space>
                  </ProFormGroup>
                  <ProFormTextArea
                    name="api_data_scope"
                    label="数据范围"
                    colProps={{
                      span: 24,
                    }}
                  />
                </>
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Modal>

      <Modal
        title="SSO 配置"
        open={ssoConfigModalVisible}
        onCancel={() => setSsoConfigModalVisible(false)}
        width={600}
        onOk={handleSaveSsoConfig}
        okText="保存"
        cancelText="取消"
      >
        <ProForm
          form={ssoConfigForm}
          submitter={false}
          grid={true}
          rowProps={{
            gutter: [16, 16],
          }}
          colProps={{
            span: 24,
          }}
        >
          <ProFormSwitch
            name="sso_enabled"
            label="启用 SSO"
            colProps={{
              span: 24,
            }}
          />
          <ProFormDependency name={['sso_enabled']}>
            {({ sso_enabled }) => {
              if (!sso_enabled) return null;
              return (
                <>
                  <ProFormSelect
                    name={['sso_config', 'protocol']}
                    label="协议"
                    valueEnum={{
                      SAML: 'SAML',
                      CAS: 'CAS',
                      OIDC: 'OIDC',
                      OAuth: 'OAuth',
                    }}
                  />
                  <ProFormText
                    name={['sso_config', 'salt']}
                    label="Salt"
                    rules={[{ required: true, message: '请输入 Salt' }]}
                  />
                  <ProFormText
                    name={['sso_config', 'redirect_uri']}
                    label="重定向 URI"
                  />
                  <ProFormTextArea
                    name={['sso_config', 'additional_params']}
                    label="额外参数"
                    colProps={{
                      span: 24,
                    }}
                  />
                </>
              );
            }}
          </ProFormDependency>
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default Page; 