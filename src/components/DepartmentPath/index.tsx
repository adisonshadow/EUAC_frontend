import React, { useMemo } from 'react';
import { useModel } from '@umijs/max';
import { Tooltip } from 'antd';

interface DepartmentPathProps {
  departmentId: string;
}

const DepartmentPath: React.FC<DepartmentPathProps> = ({ departmentId }) => {
  const { initialState } = useModel('@@initialState');
  const departments = initialState?.departments || [];

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