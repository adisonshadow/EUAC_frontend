import { Tag } from "antd";
import UUIDDisplay from "@/components/UUIDDisplay";
import DepartmentPath from "@/components/DepartmentPath";
import { ProColumns } from "@ant-design/pro-components";
import { ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { ProFormTextArea } from "@ant-design/pro-components";

export const columns: ProColumns<any>[] = [
  {
    title: "员工编号",
    dataIndex: "user_id",
    width: 90,
    render: (dom: any) => <UUIDDisplay uuid={dom as string} />,
  },
  {
    title: "姓名",
    dataIndex: "name",
    width: 90,
  },
  {
    title: "用户名",
    dataIndex: "username",
    width: 120,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    width: 200,
  },
  {
    title: "电话",
    dataIndex: "phone",
    width: 120,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 100,
    valueEnum: {
      ACTIVE: { text: '在职', status: 'success' },
      DISABLED: { text: '离职', status: 'error' },
      LOCKED: { text: '已锁定', status: 'warning' },
      ARCHIVED: { text: '已归档', status: 'default' },
    },
  },
  {
    title: "部门",
    dataIndex: "department_id",
    width: 200,
    render: (dom: any) => <DepartmentPath departmentId={dom as string} />,
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    valueType: 'dateTime',
    width: 180,
  },
  {
    title: "更新时间",
    dataIndex: "updated_at",
    valueType: 'dateTime',
    width: 180,
  },
];

export const mockData: any = [];

const p = ["班组长", "工程师", "主任", "装配", "拆卸", "清洗"];
const dp = ["生产", "生产", "生产", "生产", "质量", "质量", "工艺"];
const st = ["在职", "在职", "离职", "已调岗", "请假"];
for (let i = 1; i < 20; i++) {
  mockData.push({
    id: i,
    code: "10000" + i,
    name: "张三" + i,
    post: p[Math.floor(Math.random() * p.length)],
    dpt: dp[Math.floor(Math.random() * dp.length)],
    status: st[Math.floor(Math.random() * st.length)],
  });
}

export const formSchema = {
  title: "成员信息",
  columns: [
    [
      {
        title: "姓名",
        dataIndex: "name",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "此项为必填项",
            },
          ],
        },
        colProps: {
          span: 12,
        },
      },
      {
        title: "用户名",
        dataIndex: "username",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "此项为必填项",
            },
          ],
        },
        colProps: {
          span: 12,
        },
      },
    ],
    [
      {
        title: "邮箱",
        dataIndex: "email",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "此项为必填项",
            },
            {
              type: "email",
              message: "请输入有效的邮箱地址",
            },
          ],
        },
        colProps: {
          span: 12,
        },
      },
      {
        title: "电话",
        dataIndex: "phone",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "此项为必填项",
            },
          ],
        },
        colProps: {
          span: 12,
        },
      },
    ],
    [
      {
        title: "性别",
        dataIndex: "gender",
        valueType: "select",
        valueEnum: {
          MALE: { text: '男' },
          FEMALE: { text: '女' },
        },
        colProps: {
          span: 12,
        },
      },
      {
        title: "状态",
        dataIndex: "status",
        valueType: "select",
        valueEnum: {
          ACTIVE: { text: '在职' },
          DISABLED: { text: '离职' },
          LOCKED: { text: '已锁定' },
          ARCHIVED: { text: '已归档' },
        },
        colProps: {
          span: 12,
        },
      },
    ],
    [
      {
        title: "部门ID",
        dataIndex: "department_id",
        formItemProps: {
          rules: [
            {
              required: true,
              message: "此项为必填项",
            },
          ],
        },
        colProps: {
          span: 12,
        },
      },
    ],
  ],
};

export const formSchema1: any = {
  layoutType: "Form",
  rowProps: {
    gutter: [16, 16],
  },
  colProps: {
    span: 12,
  },
  grid: true,
  columns: [
    {
      title: "开始日期",
      dataIndex: "startDate",
      valueType: 'date',
      width:'100%'
    },
    {
      title: "结束日期",
      dataIndex: "endDate",
      valueType: 'date',
      width:'100%'
    },
  ],
};

export const dataSchema: any = [];
