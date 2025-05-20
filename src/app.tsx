// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { history, RequestConfig } from '@umijs/max';
import api from '@/services/UAC/api';
import { message } from 'antd';
import { getDepartments } from './services/UAC/api/departments';
import { getAuthCheck } from './services/UAC/api/auth';

import { Footer, AvatarDropdown, AvatarName } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '@/../config/defaultSettings';

const loginPath = '/auth/login';

// 添加请求拦截器
export const request: RequestConfig = {
  requestInterceptors: [
    (url, options) => {
      // 如果是登录接口，不需要添加 token
      if (url.includes('/auth/login')) {
        return { url, options };
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        const headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        };
        return { url, options: { ...options, headers } };
      }
      return { url, options };
    },
  ],
};

interface UserInfo {
  user_id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  email: string;
  phone: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
  department_id: string | null;
}

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  name?: string;
  avatar?: string;
  currentUser?: {
    user_id: string;
    username: string;
    name: string;
    avatar: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    email: string;
    phone: string | null;
    status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
    department_id: string | null;
  };
  departments?: {
    department_id: string;
    name: string;
    code: string;
    parent_id: string | null;
    status: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }[];
  departmentsLastUpdate?: number;
  fetchUserInfo?: () => Promise<{
    user_id: string;
    username: string;
    name: string;
    avatar: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
    email: string;
    phone: string | null;
    status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED';
    department_id: string | null;
  } | undefined>;
  fetchDepartments?: () => Promise<{
    department_id: string;
    name: string;
    code: string;
    parent_id: string | null;
    status: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }[] | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('未登录');
      }

      // 使用 auth/check 接口获取当前用户信息
      const response = await getAuthCheck();
      
      if (response.code === 200 && response.data) {
        const user = response.data;
        return {
          user_id: user.user_id || '',
          username: user.username || '',
          name: user.name || '',
          avatar: user.avatar || null,
          gender: user.gender || null,
          email: user.email || '',
          phone: user.phone || null,
          status: user.status || 'ACTIVE',
          department_id: user.department_id || null,
        };
      }
      
      throw new Error('获取用户信息失败');
    } catch (error) {
      // 清除 token
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      history.push('/user/login');
    }
    return undefined;
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments({});
      if (response.code === 200 && response.data?.items) {
        return response.data.items.map(item => ({
          department_id: item.department_id || '',
          name: item.name || '',
          code: item.code || '',
          parent_id: item.parent_id || null,
          status: item.status || 'ACTIVE',
          description: item.description || '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          deleted_at: item.deleted_at || null,
        }));
      }
      return undefined;
    } catch (error) {
      console.error('获取部门列表失败:', error);
      return undefined;
    }
  };

  const currentUser = await fetchUserInfo();
  const departments = await fetchDepartments();
  return {
    fetchUserInfo,
    fetchDepartments,
    currentUser,
    departments,
    departmentsLastUpdate: departments ? Date.now() : undefined,
    name: currentUser?.username || '未有效登录',
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { location } = history;
  // 如果没有登录，重定向到 login
  if (!initialState?.currentUser && location.pathname !== loginPath) {
    history.push(loginPath);
  }
  // 如果用户状态不是 ACTIVE，重定向到 401
  if (initialState?.currentUser?.status !== 'ACTIVE' && location.pathname !== '/401') {
    history.push('/401');
  }
  
  // 设置部门数据更新的定时器
  let departmentUpdateTimer: NodeJS.Timeout | null = null;

  const updateDepartments = async () => {
    if (initialState?.fetchDepartments) {
      const departments = await initialState.fetchDepartments();
      if (departments) {
        setInitialState((s) => ({
          ...s,
          departments,
          departmentsLastUpdate: Date.now(),
        }));
      }
    }
  };

  // 检查并更新部门数据
  const checkAndUpdateDepartments = async () => {
    if (initialState?.currentUser?.status === 'ACTIVE') {
      if (!initialState.departments) {
        // 如果没有部门数据，立即获取
        await updateDepartments();
      } else {
        // 检查最后更新时间
        const lastUpdate = initialState.departmentsLastUpdate;
        const now = Date.now();
        if (!lastUpdate || now - lastUpdate > 10 * 60 * 1000) { // 10分钟
          await updateDepartments();
        }
      }
    }
  };

  return {
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      // size: 'small',
      // shape: 'circle',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
      // 检查并更新部门数据
      checkAndUpdateDepartments();
    },
    // childrenRender: (children) => {
    //   return <>{children}</>;
    // },
    ...initialState?.settings,
  };
};