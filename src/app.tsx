// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { history, RequestConfig } from '@umijs/max';
import { App } from 'antd';
import { getDepartments } from './services/UAC/api/departments';
import { getAuthCheck } from './services/UAC/api/auth';
import { useEffect } from 'react';

import { Footer, AvatarDropdown, AvatarName } from '@/components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '@/../config/defaultSettings';

// 忽略 findDOMNode 警告
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('is deprecated') || 
      args[0]?.includes('net::ERR_FILE_NOT_FOUND') ||
      args[0]?.includes('Unchecked runtime.lastError: The message port closed before a response was received.')) {
    return;
  }
  originalError.call(console, ...args);
};

// 登录path
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

interface DepartmentTreeOption {
  value: string;
  label: string;
  children?: DepartmentTreeOption[];
  disabled?: boolean;
}

interface DepartmentsResult {
  departments: {
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
  departmentsTreeData: DepartmentTreeOption[];
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
  departmentsTreeData?: DepartmentTreeOption[];
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
  fetchDepartments?: () => Promise<DepartmentsResult | undefined>;
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
          status: user.status || 'DISABLED',
          department_id: user.department_id || null,
        };
      }
      
      throw new Error('获取用户信息失败');
    } catch (error) {
      // 清除 token
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      history.push(loginPath);
      return undefined;
    }
  };

  const fetchDepartments = async (): Promise<DepartmentsResult | undefined> => {
    try {
      // 检查是否有 token
      const token = localStorage.getItem('token');
      if (!token) {
        return undefined;
      }

      const response = await getDepartments({});
      if (response.code === 200 && response.data?.items) {
        const departments = response.data.items.map(item => ({
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

        // 构建树状结构
        const buildTree = (parentId: string | null): DepartmentTreeOption[] => {
          return departments
            .filter(dept => dept.parent_id === parentId)
            .map(dept => ({
              value: dept.department_id,
              label: dept.name,
              disabled: dept.status !== 'ACTIVE',
              children: buildTree(dept.department_id),
            }));
        };

        const departmentsTreeData = buildTree(null);
        return { departments, departmentsTreeData };
      }
      return undefined;
    } catch (error) {
      console.error('获取部门列表失败:', error);
      return undefined;
    }
  };

  // 先获取用户信息
  const currentUser = await fetchUserInfo();
  
  // 只有在用户登录成功后才获取部门信息
  let departmentsResult;
  if (currentUser) {
    departmentsResult = await fetchDepartments();
  }

  return {
    fetchUserInfo,
    fetchDepartments,
    currentUser,
    departments: departmentsResult?.departments,
    departmentsTreeData: departmentsResult?.departmentsTreeData,
    departmentsLastUpdate: departmentsResult?.departments ? Date.now() : undefined,
    name: currentUser?.username || '未有效登录',
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { location } = history;

  useEffect(() => {
    // 如果没有登录，重定向到 login
    if (!initialState?.currentUser && location.pathname !== loginPath) {
      history.push(loginPath);
    }

    // 如果用户状态不是 ACTIVE，重定向到 401 【暂时不深入处理，以登录错误信息的方式告知用户】
    // if (initialState?.currentUser?.status !== 'ACTIVE' && location.pathname !== '/401') {
    //   history.push('/401');
    // }
    
  }, [initialState?.currentUser, location.pathname]);

  // 设置部门数据更新的定时器
  let departmentUpdateTimer: NodeJS.Timeout | null = null;

  const updateDepartments = async () => {
    if (initialState?.fetchDepartments && initialState?.currentUser) {
      const departmentsResult = await initialState.fetchDepartments();
      if (departmentsResult) {
        setInitialState((s) => ({
          ...s,
          departments: departmentsResult.departments,
          departmentsTreeData: departmentsResult.departmentsTreeData,
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
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu>{avatarChildren}</AvatarDropdown>;
      },
    },
    onPageChange: () => {
      // 检查并更新部门数据
      checkAndUpdateDepartments();
    },
    ...initialState?.settings,
  };
};