import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from '@umijs/max';
import { Spin } from '@oceanbase/design';
import { AUTH_PAGES, LOGIN_PATH, DEFAULT_REDIRECT } from '@/constants/auth';
import { checkAuth } from '@/utils/auth';

const SecurityLayout: React.FC = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const { pathname, search } = location;

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // 检查是否是认证页面
        const isAuthPage = AUTH_PAGES.includes(pathname as typeof AUTH_PAGES[number]);
        const hasAppParam = new URLSearchParams(search).has('app');

        // 如果是认证页面且有 app 参数，允许访问
        if (isAuthPage && hasAppParam) {
          setIsAuthenticated(true);
          setIsAuthChecking(false);
          return;
        }

        // 检查认证状态
        const isValid = await checkAuth();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error('认证检查失败:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuthentication();
  }, [pathname, search]);

  // 显示加载状态
  if (isAuthChecking) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="正在检查认证状态..." />
      </div>
    );
  }

  // 如果未认证且不是认证页面，重定向到登录页
  if (!isAuthenticated && !AUTH_PAGES.includes(pathname as typeof AUTH_PAGES[number])) {
    // 保存当前页面 URL 作为重定向目标
    const redirect = encodeURIComponent(`${pathname}${search}`);
    return <Navigate to={`${LOGIN_PATH}?redirect=${redirect}`} replace />;
  }

  // 如果已认证且是认证页面，重定向到首页
  if (isAuthenticated && AUTH_PAGES.includes(pathname as typeof AUTH_PAGES[number])) {
    return <Navigate to={DEFAULT_REDIRECT} replace />;
  }

  // 其他情况，渲染子路由
  return <Outlet />;
};

export default SecurityLayout;