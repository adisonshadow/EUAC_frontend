import React, { useMemo } from 'react';
import { useModel } from '@umijs/max';
import { Tooltip, Cascader } from 'antd';
import type { CascaderProps } from 'antd';

interface DepartmentPathProps {
  departmentId: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

interface DepartmentOption {
  value: string;
  label: string;
  children?: DepartmentOption[];
  disabled?: boolean;
}

const DepartmentPath: React.FC<DepartmentPathProps> = ({ 
  departmentId, 
  editable = false,
  onChange 
}) => {
  const { initialState } = useModel('@@initialState');
  const departments = initialState?.departments || [];

  // 构建级联选择器的选项
  const options = useMemo(() => {
    const buildOptions = (parentId: string | null): DepartmentOption[] => {
      return departments
        .filter(dept => dept.parent_id === parentId)
        .map(dept => ({
          value: dept.department_id,
          label: dept.name,
          children: buildOptions(dept.department_id),
          disabled: dept.status !== 'ACTIVE',
        }));
    };
    return buildOptions(null);
  }, [departments]);

  // 获取当前部门路径
  const path = useMemo(() => {
    const buildPath = (id: string): string[] => {
      const dept = departments.find(d => d.department_id === id);
      if (!dept) return [];
      
      if (!dept.parent_id) {
        return [dept.name];
      }
      
      return [...buildPath(dept.parent_id), dept.name];
    };

    return buildPath(departmentId);
  }, [departmentId, departments]);

  // 获取当前部门ID的完整路径
  const getValue = useMemo(() => {
    const buildValue = (id: string): string[] => {
      const dept = departments.find(d => d.department_id === id);
      if (!dept) return [];
      
      if (!dept.parent_id) {
        return [dept.department_id];
      }
      
      return [...buildValue(dept.parent_id), dept.department_id];
    };

    return buildValue(departmentId);
  }, [departmentId, departments]);

  if (editable) {
    return (
      <Cascader<DepartmentOption>
        options={options}
        value={getValue}
        onChange={(value) => {
          if (value && value.length > 0) {
            onChange?.(value[value.length - 1]);
          }
        }}
        placeholder="请选择部门"
        style={{ width: '100%' }}
        expandTrigger="hover"
        changeOnSelect={false}
        showSearch={{
          filter: (inputValue, path) => {
            return path.some(option => 
              String(option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1
            );
          },
        }}
      />
    );
  }

  if (path.length === 0) {
    return <span>-</span>;
  }

  return (
    <Tooltip title={path.join(' / ')}>
      <span>{path.join(' / ')}</span>
    </Tooltip>
  );
};

export default DepartmentPath; 