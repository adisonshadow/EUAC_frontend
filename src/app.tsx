// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import { history } from '@umijs/max';
import { getDepartments } from './services/UAC/api/departments';
import { getAuthCheck } from './services/UAC/api/auth';
import { Avatar, ConfigProvider, Menu, theme } from '@oceanbase/design';
import type { MenuProps } from '@oceanbase/design';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Footer } from '@/components';
import HeaderDropdown from '@/components/HeaderDropdown';
import defaultSettings from '@/../config/defaultSettings';
import { getImageUrl } from '@/utils/image';
import { requestInterceptors, responseInterceptors, errorConfig } from '@/utils/requestInterceptors';
import { loginPath, clearAuth, getAuth } from '@/utils/auth';

// 忽略 findDOMNode 警告
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes('is deprecated') || 
      args[0]?.includes('net::ERR_FILE_NOT_FOUND') ||
      args[0]?.includes('[antd: ConfigProvider]') ||
      args[0]?.includes('[antd: Tabs] `indicatorSize`') ||
      args[0]?.includes('Unchecked runtime.lastError: The message port closed before a response was received.')) {
    return;
  }
  originalError.call(console, ...args);
};

// 请求配置
export const request = {
  timeout: 10000,
  errorConfig: {
    errorHandler: errorConfig.errorHandler,
    errorThrower: errorConfig.errorThrower,
  },
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};

interface DepartmentTreeOption {
  value: string;
  label: string;
  children?: DepartmentTreeOption[];
  disabled?: boolean;
}

interface Department {
  department_id: string;
  name: string;
  code: string;
  parent_id: string | null;
  status: 'ACTIVE' | 'DISABLED' | 'ARCHIVED';
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
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

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const { token } = getAuth();
      if (!token) {
        return undefined;
      }

      const response = await getAuthCheck();
      if (response.code === 200 && response.data) {
        const user = response.data;
        return {
          user_id: user.user_id || '',
          username: user.username || '',
          name: user.name || '',
          avatar: user.avatar || null,
          gender: (user.gender as 'MALE' | 'FEMALE' | 'OTHER') || null,
          email: user.email || '',
          phone: user.phone || null,
          status: (user.status as 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'ARCHIVED') || 'DISABLED',
          department_id: user.department_id || null,
        };
      }
      
      throw new Error('获取用户信息失败');
    } catch (error) {
      clearAuth();
      return undefined;
    }
  };

  const fetchDepartments = async (): Promise<DepartmentsResult | undefined> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return undefined;
      }

      const response = await getDepartments({});
      if (response.code === 200 && response.data?.items) {
        const departments = response.data.items.map((item:any) => ({
          department_id: item.department_id || '',
          name: item.name || '',
          code: item.code || '',
          parent_id: item.parent_id || null,
          status: (item.status as 'ACTIVE' | 'DISABLED' | 'ARCHIVED') || 'ACTIVE',
          description: item.description || '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
          deleted_at: item.deleted_at || null,
        }));

        // 构建树状结构
        const buildTree = (parentId: string | null): DepartmentTreeOption[] => {
          return departments
            .filter((dept: Department) => dept.parent_id === parentId)
            .map((dept: Department) => ({
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
    settings: defaultSettings,
  };
}

interface LayoutProps {
  initialState: {
    currentUser?: {
      name?: string;
      avatar?: string | null;
    };
  };
}

// 布局配置
export const layout = ({ initialState }: LayoutProps) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return {
    layout: 'side',
    title: 'UAC Admin',
    rightContentRender: () => (
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <HeaderDropdown
          menu={{
            selectedKeys: [],
            onClick: (info: MenuInfo) => {
              if (info.key === 'logout') {
                clearAuth();
                history.push(loginPath);
              } else if (info.key === 'profile') {
                history.push('/account/center');
              }
            },
            items: menuItems,
          }}
          className='me-4'
        >
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={initialState?.currentUser?.avatar ? getImageUrl(initialState.currentUser.avatar) : undefined}
              icon={<UserOutlined />}
              style={{ marginRight: 8 }}
            />
            <span>{initialState?.currentUser?.name || '未登录'}</span>
          </span>
        </HeaderDropdown>
      </ConfigProvider>
    ),
    footerRender: () => <Footer />,
    ...defaultSettings,
  };
};

// 根容器配置
export function rootContainer(container: React.ReactNode) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      {container}
    </ConfigProvider>
  );
}