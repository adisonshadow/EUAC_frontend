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
import { message, Tabs, Modal } from 'antd';
import Settings from '@/../config/defaultSettings';
import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import SliderCaptchaComponent, { SliderCaptchaRef } from '@/components/SliderCaptcha';

import './login.less';

interface LoginParams {
  username: string;
  password: string;
  type?: string;
}

interface UserInfo {
  id?: string;
  username: string;
  email: string;
  status?: 'active' | 'inactive';
}

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [loginParams, setLoginParams] = useState<LoginParams | null>(null);
  const [captchaId, setCaptchaId] = useState<string>('');
  const captchaRef = useRef<SliderCaptchaRef>(null);
  const { setInitialState } = useModel('@@initialState');

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
      
      if (msg.data?.need_captcha) {
        setLoginParams(values);
        const response = await auth.auth.postCaptchaGenerate();
        if (!response.data?.captcha_id) {
          message.error('获取验证码失败，请重试！');
        } else {
          setCaptchaId(response.data.captcha_id);
          setShowCaptcha(true);
        }
        return;
      }

      if (msg.data?.token) {
        message.success('登录成功！');

        // 保存 token 到 localStorage
        localStorage.setItem('token', msg.data.token);
        if (msg.data.refresh_token) {
          localStorage.setItem('refresh_token', msg.data.refresh_token);
        }

        // 设置用户信息
        const userInfo: UserInfo = {
          username: values.username,
          email: '', // 这里需要从后端获取
          status: 'active',
        };

        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: userInfo,
          }));
        });

        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      message.error('登录失败，请重试！');
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  const handleCaptchaSuccess = async () => {
    if (!loginParams || !captchaId) return;

    try {
      // 验证通过后重新登录
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

        const userInfo: UserInfo = {
          username: loginParams.username,
          email: '',
          status: 'active',
        };

        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser: userInfo,
          }));
        });

        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
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
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {type === 'account' && (
            <>
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
            </>
          )}

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
