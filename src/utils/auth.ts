import { history } from '@umijs/max';
import { getAuthCheck } from '@/services/UAC/api/auth';
import { message } from '@oceanbase/design';

// 登录页面路径
export const loginPath = '/auth/login';

// 认证相关页面
export const authPages = ['/auth/login', '/auth/reset-password'];

// 检查是否是认证页面
export const isAuthPage = (pathname: string) => authPages.includes(pathname);

// 获取当前页面是否需要 app 参数
export const hasAppParam = () => new URLSearchParams(window.location.search).has('app');

// 获取重定向 URL
export const getRedirectUrl = (currentPath: string) => {
  const appParam = hasAppParam() ? `?app=${new URLSearchParams(window.location.search).get('app')}` : '';
  return loginPath + (currentPath !== '/' ? `?redirect=${encodeURIComponent(currentPath)}` : '') + appParam;
};

// 检查 token 是否有效
export const checkTokenValid = async () => {
  console.log('开始检查 token 有效性...');
  try {
    const response = await getAuthCheck();
    const isValid = response.code === 200 && response.data;
    console.log('Token 有效性检查结果:', {
      code: response.code,
      hasData: !!response.data,
      isValid,
    });
    return isValid;
  } catch (error) {
    console.error('Token 有效性检查失败:', error);
    return false;
  }
};

// 清除认证信息
export const clearAuth = () => {
  console.log('清除认证信息...');
  const oldToken = localStorage.getItem('token');
  const oldRefreshToken = localStorage.getItem('refresh_token');
  console.log('清除前的认证信息:', {
    hasToken: !!oldToken,
    tokenLength: oldToken?.length,
    hasRefreshToken: !!oldRefreshToken,
    refreshTokenLength: oldRefreshToken?.length,
  });
  
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  
  console.log('认证信息已清除');
};

// 保存认证信息
export const saveAuth = (token: string, refreshToken?: string) => {
  console.log('保存认证信息...', {
    tokenLength: token?.length,
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length,
  });
  
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
  
  console.log('认证信息保存完成');
};

// 获取认证信息
export const getAuth = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  console.log('获取认证信息:', {
    hasToken: !!token,
    tokenLength: token?.length,
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length,
  });
  
  return { token, refreshToken };
};

// 路由守卫
export const checkAuth = async (setInitialState?: (callback: (state: any) => any) => void) => {
  console.log('开始路由守卫检查...');
  const { token } = getAuth();
  const currentPath = location.pathname + location.search;
  const isCurrentAuthPage = isAuthPage(location.pathname);
  const hasCurrentAppParam = hasAppParam();

  console.log('当前页面状态:', {
    path: currentPath,
    isAuthPage: isCurrentAuthPage,
    hasAppParam: hasCurrentAppParam,
    hasToken: !!token,
    tokenLength: token?.length,
  });

  // 如果是认证页面且有 app 参数，允许访问
  if (isCurrentAuthPage && hasCurrentAppParam) {
    console.log('认证页面且有 app 参数，允许访问');
    return true;
  }

  // 如果没有 token 且不是认证页面，跳转到登录页
  if (!token && !isCurrentAuthPage) {
    console.log('未登录且不是认证页面，准备跳转到登录页');
    const redirectUrl = getRedirectUrl(currentPath);
    console.log('重定向 URL:', redirectUrl);
    history.push(redirectUrl);
    return false;
  }

  // 如果有 token，验证其有效性
  if (token && !isCurrentAuthPage) {
    console.log('有 token，开始验证有效性...');
    try {
      const response = await getAuthCheck();
      console.log('Token 验证响应:', {
        code: response.code,
        hasData: !!response.data,
      });
      
      if (response.code === 200 && response.data) {
        console.log('Token 有效，更新用户信息');
        // token 有效，更新用户信息
        if (setInitialState) {
          setInitialState((s) => ({
            ...s,
            currentUser: response.data,
          }));
        }
        return true;
      }
      throw new Error('Token 无效');
    } catch (error) {
      console.error('Token 验证失败:', error);
      // token 无效，清除并跳转
      clearAuth();
      if (setInitialState) {
        setInitialState((s) => ({
          ...s,
          currentUser: undefined,
        }));
      }
      const redirectUrl = getRedirectUrl(currentPath);
      console.log('Token 无效，准备跳转到登录页:', redirectUrl);
      history.push(redirectUrl);
      return false;
    }
  }

  // 如果已登录且在认证页面，跳转到首页
  if (token && isCurrentAuthPage) {
    console.log('已登录且在认证页面，准备跳转到首页');
    history.push('/');
    return false;
  }

  console.log('路由守卫检查完成，允许访问');
  return true;
};

// 处理 401 未授权
export const handleUnauthorized = (setInitialState?: (callback: (state: any) => any) => void) => {
  console.log('处理 401 未授权...');
  clearAuth();
  if (setInitialState) {
    console.log('清除用户状态');
    setInitialState((s) => ({
      ...s,
      currentUser: undefined,
    }));
  }

  const isCurrentAuthPage = isAuthPage(location.pathname);
  const hasCurrentAppParam = hasAppParam();

  console.log('401 处理状态:', {
    isAuthPage: isCurrentAuthPage,
    hasAppParam: hasCurrentAppParam,
    currentPath: location.pathname + location.search,
  });

  if (!isCurrentAuthPage || (isCurrentAuthPage && !hasCurrentAppParam)) {
    const redirectUrl = getRedirectUrl(location.pathname + location.search);
    console.log('准备重定向到:', redirectUrl);
    history.push(redirectUrl);
  } else {
    console.log('当前在认证页面且有 app 参数，不进行重定向');
  }
}; 