import { ProSchemaValueEnumType } from "@ant-design/pro-components";

// 状态枚举
export const statusEnum: Record<string, ProSchemaValueEnumType> = {
  ACTIVE: { text: '在职', status: 'success' },
  DISABLED: { text: '离职', status: 'error' },
  LOCKED: { text: '已锁定', status: 'warning' },
  ARCHIVED: { text: '已归档', status: 'default' },
};

// 性别枚举
export const genderEnum: Record<string, ProSchemaValueEnumType> = {
  MALE: { text: '男' },
  FEMALE: { text: '女' },
};
