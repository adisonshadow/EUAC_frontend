import { Footer } from '@/components';
import { getHealth } from '@/services/UAC/api/health';
import { getAuthCheck, postAuthLogin } from '@/services/UAC/api/auth';
import { getApplicationsSsoId } from '@/services/UAC/api/applicationsSso';
import { getCaptcha } from '@/services/UAC/api/captcha';
import { history, useModel, Helmet } from '@umijs/max';
import { message, Modal, Lottie, Form, Input, Button, Card, Space, Spin } from '@oceanbase/design';
import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import SliderCaptchaComponent, { SliderCaptchaRef } from '@/components/SliderCaptcha';
import './index.scss';
import { saveAuth, checkAuth, checkTokenValid } from '@/utils/auth';

interface LoginParams {
  username: string;
  password: string;
  type?: string;
  captcha_data?: {
    captcha_id: string;
  };
}

interface UserInfo {
  user_id: string;
  username: string;
  name: string;
  avatar: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  email: string;
  phone: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
  department_id: string | null;
}

interface ApplicationInfo {
  application_id?: string;
  name?: string;
  sso_enabled?: boolean;
  sso_config?: {
    redirect_uri?: string;
    protocol?: string;
    currentTimestamp?: string;
    secret?: string;
  };
}

interface LoginResponse {
  code?: number;
  message?: string;
  data?: {
    token?: string;
    refresh_token?: string;
    expires_in?: string;
    user_id?: string;
    need_captcha?: boolean;
    sso?: {
      application_id?: string;
      application_name?: string;
      application_code?: string;
      sso_config?: API.SSOConfig;
    };
  };
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginParams, setLoginParams] = useState<LoginParams | null>(null);
  const [captchaId, setCaptchaId] = useState<string>('');
  const [applicationInfo, setApplicationInfo] = useState<ApplicationInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState('');
  const [isApplicationInfoLoaded, setIsApplicationInfoLoaded] = useState(false);
  const captchaRef = useRef<SliderCaptchaRef>(null);
  const { setInitialState } = useModel('@@initialState');

  // 独立的SSO回调方法
  const submitSsoCallback = (userInfo: UserInfo, token: string, refreshToken?: string) => {
    console.log('submitSsoCallback', userInfo, token, refreshToken);
    if (!applicationInfo?.sso_enabled || !applicationInfo?.sso_config?.redirect_uri) {
      return;
    }

    const { redirect_uri, protocol, currentTimestamp, secret } = applicationInfo.sso_config;
    
    if (protocol === 'OAuth') {
      // 创建一个隐藏的表单来提交 POST 请求
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = redirect_uri;
      form.enctype = 'application/x-www-form-urlencoded';
      form.style.display = 'none';

      // 添加 IdP 信息
      const idpInput = document.createElement('input');
      idpInput.type = 'hidden';
      idpInput.name = 'idp';
      idpInput.value = 'IAM';
      form.appendChild(idpInput);

      // 添加 Access Token
      const accessTokenInput = document.createElement('input');
      accessTokenInput.type = 'hidden';
      accessTokenInput.name = 'access_token';
      accessTokenInput.value = token;
      form.appendChild(accessTokenInput);

      // 添加 Refresh Token
      const refreshTokenInput = document.createElement('input');
      refreshTokenInput.type = 'hidden';
      refreshTokenInput.name = 'refresh_token';
      refreshTokenInput.value = refreshToken || '';
      form.appendChild(refreshTokenInput);

      // 添加 Token Type
      const tokenTypeInput = document.createElement('input');
      tokenTypeInput.type = 'hidden';
      tokenTypeInput.name = 'token_type';
      tokenTypeInput.value = 'Bearer';
      form.appendChild(tokenTypeInput);

      // 添加过期时间
      const expiresInInput = document.createElement('input');
      expiresInInput.type = 'hidden';
      expiresInInput.name = 'expires_in';
      expiresInInput.value = '3600'; // 默认1小时，可以根据实际情况调整
      form.appendChild(expiresInInput);

      // 添加 state 参数
      const stateInput = document.createElement('input');
      stateInput.type = 'hidden';
      stateInput.name = 'state';
      stateInput.value = new URLSearchParams(window.location.search).get('state') || '';
      form.appendChild(stateInput);

      // 添加合法性验证信息
      const verifyInput = document.createElement('input');
      verifyInput.type = 'hidden';
      verifyInput.name = 'verify';
      verifyInput.value = JSON.stringify({
        timestamp: currentTimestamp || "null",
        public_secret: secret,
        expires_in: 600,
      });
      form.appendChild(verifyInput);

      // 添加用户信息
      const userInfoInput = document.createElement('input');
      userInfoInput.type = 'hidden';
      userInfoInput.name = 'user_info';
      userInfoInput.value = JSON.stringify({
        user_id: userInfo.user_id,
        username: userInfo.username,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        gender: userInfo.gender,
        status: userInfo.status,
        avatar: userInfo.avatar,
        department_id: userInfo.department_id
      });
      form.appendChild(userInfoInput);

      // 将表单添加到文档并提交
      document.body.appendChild(form);
      // 打印表单中的所有值
      const formData = new FormData(form);
      console.log('Form data:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      form.submit();
    }
  };

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await getHealth();
        if (response.code !== 200) {
          Modal.error({
            title: '系统异常',
            content: '系统服务暂时不可用，请稍后再试',
            okText: '确定',
          });
          return;
        }

        // 检查数据库状态
        if (response.data?.database?.status === 'error') {
          Modal.error({
            title: '数据库异常',
            content: response.data.database.message || '数据库连接异常，请稍后再试',
            okText: '确定',
          });
          return;
        }
        
      } catch (error) {
        Modal.error({
          title: '网络异常',
          content: '无法连接到服务器，请检查网络连接',
          okText: '确定',
        });
      }
    };

    const fetchApplicationInfo = async () => {
      const urlParams = new URL(window.location.href).searchParams;
      const appId = urlParams.get('app');
      if (appId && !isApplicationInfoLoaded) {
        try {
          const response = await getApplicationsSsoId({ id: appId });
          if (response.code === 200 && response.data) {
            setApplicationInfo(response.data);
            setIsApplicationInfoLoaded(true);
          }
        } catch (error) {
          message.error('获取应用信息失败');
          setIsApplicationInfoLoaded(true); // 即使失败也标记为已加载，避免重复调用
        }
      }
    };

    const checkUserLoginStatus = async () => {
      try {
        setIsCheckingAuth(true);
        const isTokenValid = await checkTokenValid();
        
        if (isTokenValid) {
          setIsLoggedIn(true);
          const urlParams = new URL(window.location.href).searchParams;
          const appId = urlParams.get('app');
          
          if (appId && applicationInfo?.name) {
            setRedirectMessage(`您已登录，正在打开 ${applicationInfo.name} 应用……`);
            // 3秒后跳转到SSO回调
            setTimeout(() => {
              // 获取当前用户信息用于SSO回调
              getAuthCheck({}).then(userResponse => {
                if (userResponse.code === 200 && userResponse.data) {
                  const userData = userResponse.data;
                  const userInfo: UserInfo = {
                    user_id: userData.user_id || '',
                    username: userData.username || '',
                    name: userData.name || '',
                    avatar: userData.avatar || null,
                    gender: userData.gender as any || null,
                    email: userData.email || '',
                    phone: userData.phone || null,
                    status: userData.status as any || 'DISABLED',
                    department_id: userData.department_id || null,
                  };
                  const token = localStorage.getItem('token') || '';
                  const refreshToken = localStorage.getItem('refresh_token') || '';
                  submitSsoCallback(userInfo, token, refreshToken);
                }
              });
            }, 3000);
          } else if (appId) {
            // 如果有app参数但没有应用信息，直接处理SSO回调
            setRedirectMessage('您已登录，正在打开应用……');
            setTimeout(() => {
              // 获取当前用户信息用于SSO回调
              getAuthCheck({}).then(userResponse => {
                if (userResponse.code === 200 && userResponse.data) {
                  const userData = userResponse.data;
                  const userInfo: UserInfo = {
                    user_id: userData.user_id || '',
                    username: userData.username || '',
                    name: userData.name || '',
                    avatar: userData.avatar || null,
                    gender: userData.gender as any || null,
                    email: userData.email || '',
                    phone: userData.phone || null,
                    status: userData.status as any || 'DISABLED',
                    department_id: userData.department_id || null,
                  };
                  const token = localStorage.getItem('token') || '';
                  const refreshToken = localStorage.getItem('refresh_token') || '';
                  submitSsoCallback(userInfo, token, refreshToken);
                }
              });
            }, 3000);
          } else {
            setRedirectMessage('您已登录，正在打开管理界面……');
            // 3秒后跳转到首页
            setTimeout(() => {
              history.push('/');
            }, 3000);
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkHealth();
    fetchApplicationInfo();
    checkUserLoginStatus();
  }, []); // 移除依赖项，避免循环调用

  const handleLoginSuccess = async (userInfo: UserInfo, token: string, refreshToken?: string) => {
    try {

      // 保存 token
      saveAuth(token, refreshToken);

      // 等待一下，确保 token 已经保存
      await new Promise(resolve => setTimeout(resolve, 100));

      // 获取用户信息
      const userResponse = await getAuthCheck({});

      if (userResponse.code === 200 && userResponse.data) {
        const userData = userResponse.data;
        const updatedUserInfo: UserInfo = {
          user_id: userData.user_id || '',
          username: userInfo.username,
          name: userData.name || userInfo.username,
          avatar: userData.avatar || null,
          gender: userData.gender as any || null,
          email: userData.email || '',
          phone: userData.phone || null,
          status: userData.status as any || 'DISABLED',
          department_id: userData.department_id || null,
        };

        flushSync(() => {
          setInitialState((s:any) => ({
            ...s,
            currentUser: updatedUserInfo,
          }));
        });

        // 处理 SSO 回调
        if (applicationInfo?.sso_enabled && applicationInfo?.sso_config?.redirect_uri) {
          submitSsoCallback(updatedUserInfo, token, refreshToken);
          return;
        }

        // 验证权限并跳转
        const urlParams = new URL(window.location.href).searchParams;
        const redirect = urlParams.get('redirect');
        if (redirect) {
          // 保留 app 参数
          const appId = urlParams.get('app');
          const redirectWithApp = appId ? `${redirect}${redirect.includes('?') ? '&' : '?'}app=${appId}` : redirect;
          history.push(redirectWithApp);
        } else {
          await checkAuth(setInitialState);
        }
      } else {
        // throw new Error('获取用户信息失败');
        message.error('登录失败，请重试');
      }
    } catch (error) {
      // 清除 token
      saveAuth('', '');
      message.error('登录失败，请重试');
    }
  };

  const handleLogin = async (loginData: LoginParams) => {
    try {
      setLoading(true);
      const msg = await postAuthLogin(loginData) as LoginResponse;

      if (msg.data?.token) {
        message.success('登录成功！');
        setShowCaptcha(false);

        // 存储token
        saveAuth(msg.data.token, msg.data.refresh_token);

        // 获取用户信息
        const userResponse = await getAuthCheck({});
        if (userResponse.code === 200 && userResponse.data) {
          const userData = userResponse.data;
          const userInfo: UserInfo = {
            user_id: userData.user_id || '',
            username: loginData.username,
            name: userData.name || loginData.username,
            avatar: userData.avatar || null,
            gender: userData.gender as any || null,
            email: userData.email || '',
            phone: userData.phone || null,
            status: userData.status as any || 'DISABLED',
            department_id: userData.department_id || null,
          };

          await handleLoginSuccess(userInfo, msg.data.token, msg.data.refresh_token);
          return true;
        }
      } else if (msg.data?.need_captcha) {
        setLoginParams(loginData);
        const response = await getCaptcha();
        if (!response.data?.captcha_id) {
          message.error('获取验证码失败，请重试！');
        } else {
          setCaptchaId(response.data.captcha_id);
          setShowCaptcha(true);
        }
      } else {
        message.error(msg.message || '登录失败');
      }
      return false;
    } catch (error) {
      message.error('登录失败，请稍后重试');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: LoginParams) => {
    await handleLogin(values);
  };

  const handleCaptchaSuccess = async (duration: number, trail: { x?: number; y?: number; timestamp?: number }[]) => {
    if (!loginParams || !captchaId) return;

    try {
      const loginData = {
        ...loginParams,
        captcha_data: {
          captcha_id: captchaId,
        },
      };
      
      const success = await handleLogin(loginData);
      if (!success) {
        setShowCaptcha(false);
        captchaRef.current?.reset();
      }
    } catch (error: any) {
      setShowCaptcha(false);
      captchaRef.current?.reset();
      message.error(error.response?.data?.message || '登录失败', 20);
    }
  };

  const pageTitle = applicationInfo?.name || 'IAM';
  const pageDescription = applicationInfo?.sso_enabled ? '请使用统一身份认证登录' : '请使用用户名和密码登录';

  // 背景组件
  const AuthBackground = () => (
    <div className="auth-bg">
      <img src="/images/bg.svg" alt="background" className="bg-image" />
      <div className="bg-text">
        {/* <div className="title">IAM</div> */}
      </div>
      <Lottie
        className="lottie-bg"
        animationData={require('/public/lotties/bigdata-2.json')}
        loop={true}
        autoplay={true}
      />
    </div>
  );

  // 页面容器组件
  const AuthPageContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="auth-page">
      <Helmet>
        <title>登录- {pageTitle}</title>
      </Helmet>
      <AuthBackground />
      <div className="auth-content">
        {children}
        <Footer />
      </div>
    </div>
  );

  // 如果正在检查认证状态，显示加载状态
  if (isCheckingAuth) {
    return (
      <AuthPageContainer>
        <Card className="auth-card" variant="borderless">
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px', color: '#666' }}>正在检查登录状态...</div>
          </div>
        </Card>
      </AuthPageContainer>
    );
  }

  // 如果已登录，显示重定向提示
  if (isLoggedIn) {
    return (
      <AuthPageContainer>
        <Card className="auth-card" variant="borderless">
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Lottie
              style={{ width: '80px', height: '80px', margin: '0 auto 20px' }}
              animationData={require('/public/lotties/loading.json')}
              loop={true}
              autoplay={true}
            />
            <div style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
              {redirectMessage}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              请稍候，正在为您跳转...
            </div>
          </div>
        </Card>
      </AuthPageContainer>
    );
  }

  return (
    <AuthPageContainer>
      <Card className="auth-card" variant="borderless">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="auth-header">
            <img src="/images/logo.svg" alt="UAC" className="logo" />
            <div className="title">{pageTitle}</div>
            <div className="description">{pageDescription}</div>
          </div>

          <Form
            form={form}
            name="login"
            initialValues={{
              autoLogin: true,
              username: 'admin',
              password: '123456',
            }}
            onFinish={async (values) => {
              await handleSubmit(values as LoginParams);
            }}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            >
              <Input
                placeholder="用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            >
              <Input.Password
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                登录
              </Button>
            </Form.Item>

            <div className="d-flex justify-content-end">
                <Button type="link" onClick={() => {
                  const urlParams = new URLSearchParams(window.location.search);
                  const appId = urlParams.get('app');
                  history.push(`/auth/reset-password${appId ? `?app=${appId}` : ''}`);
                }}>
                  忘记密码？
                </Button>
            </div>
          </Form>
        </Space>
      </Card>

      <Modal
        title="需验证您是真人操作"
        open={showCaptcha}
        footer={null}
        closable={true}
        maskClosable={false}
        onCancel={() => {
          setShowCaptcha(false);
          captchaRef.current?.reset();
        }}
      >
        <SliderCaptchaComponent
          ref={captchaRef}
          onSuccess={handleCaptchaSuccess}
          onClose={() => setShowCaptcha(false)}
          captchaId={captchaId}
        />
      </Modal>
    </AuthPageContainer>
  );
};

export default LoginPage;