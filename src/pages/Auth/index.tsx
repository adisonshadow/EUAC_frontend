import { Footer } from '@/components';
import auth from '@/services/UAC/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel, Helmet } from '@umijs/max';
import { message, Modal } from 'antd';
import Settings from '@/../config/defaultSettings';
import React, { useState, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import SliderCaptchaComponent, { SliderCaptchaRef } from '@/components/SliderCaptcha';

import './login.less';

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

const Login: React.FC = () => {
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginParams, setLoginParams] = useState<LoginParams | null>(null);
  const [captchaId, setCaptchaId] = useState<string>('');
  const captchaRef = useRef<SliderCaptchaRef>(null);
  const { setInitialState } = useModel('@@initialState');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await auth.health.getHealth();
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

    checkHealth();
  }, []);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('/images/loginbg.png')",
      backgroundSize: '100% 100%',
    };
  });

  const handleSubmit = async (values: LoginParams) => {
    try {
      // 登录
      const msg = await auth.auth.postAuthLogin({ 
        username: values.username,
        password: values.password,
      });

      const data:any = msg.data;
      
      if (data && data.need_captcha) {
        setLoginParams(values);
        const response = await auth.captcha.getCaptcha();
        if (!response.data?.captcha_id) {
          message.error('获取验证码失败，请重试！');
        } else {
          setCaptchaId(response.data.captcha_id);
          setShowCaptcha(true);
        }
        return;
      }

      if (data && data.token) {
        message.success('登录成功！');

        // 保存 token 到 localStorage
        localStorage.setItem('token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        // 获取用户信息
        const userResponse = await auth.auth.getAuthCheck();
        if (userResponse.code === 200 && userResponse.data) {
          const userData = userResponse.data;
          const userInfo: UserInfo = {
            user_id: userData.user_id || '',
            username: values.username,
            name: userData.name || values.username,
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
              currentUser: userInfo,
            }));
          });

          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
          return;
        }
      }
      message.error('登录失败，请重试！');
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  const handleCaptchaSuccess = async (duration: number, trail: { x?: number; y?: number; timestamp?: number }[]) => {
    if (!loginParams || !captchaId) return;

    try {
      // 验证通过后直接登录
      const msg = await auth.auth.postAuthLogin({ 
        username: loginParams.username,
        password: loginParams.password,
        captcha_data: {
          captcha_id: captchaId,
        },
      });

      if (msg.data?.token) {
        message.success('登录成功！');
        setShowCaptcha(false);

        // 保存 token 到 localStorage
        localStorage.setItem('token', msg.data.token);
        if (msg.data.refresh_token) {
          localStorage.setItem('refresh_token', msg.data.refresh_token);
        }

        // 获取用户信息
        const userResponse = await auth.auth.getAuthCheck();
        if (userResponse.code === 200 && userResponse.data) {
          const userData = userResponse.data;
          const userInfo: UserInfo = {
            user_id: userData.user_id || '',
            username: loginParams.username,
            name: userData.name || loginParams.username,
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
              currentUser: userInfo,
            }));
          });

          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/');
          return;
        }
      }
      setShowCaptcha(false);
      captchaRef.current?.reset();
      message.error(msg.message || '登录失败', 20);
    } catch (error: any) {
      console.log(error);
      setShowCaptcha(false);
      captchaRef.current?.reset();
      message.error(error.response?.data?.message || '登录失败', 20);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          登录- {Settings.title}
        </title>
      </Helmet>
      
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '80vw',
          }}
          logo={<img style={{width: '48px'}} alt="UAC" src="/images/logo.svg" />}
          title={<div className='ps-2 py-4 my-0 fs-8 fw-semibold'>IAM</div>}
          initialValues={{
            autoLogin: true,
            username: 'admin',
            password: '123456',
          }}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParams);
          }}
        >
          <p className='text-center text-muted mb-5'> 请使用用户名和密码登录 </p>
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder= '用户名'
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder= '密码'
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer />

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
    </div>
  );
};

export default Login;
