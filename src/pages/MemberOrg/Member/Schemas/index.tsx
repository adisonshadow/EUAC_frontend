import { Tag } from "antd";
import UUIDDisplay from "@/components/UUIDDisplay";

export const columns: any = [
  {
    title: "员工编号",
    dataIndex: "user_id",
    render: (text: string) => <UUIDDisplay uuid={text} />,
  },
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "电话",
    dataIndex: "phone",
  },
  {
    title: "状态",
    dataIndex: "status",
    render: (_: any, record: any) => {
      if (record.status === "ACTIVE") {
        return <Tag color="success">在职</Tag>;
      }
      if (record.status === "DISABLED") {
        return <Tag color="error">离职</Tag>;
      }
      if (record.status === "LOCKED") {
        return <Tag color="warning">已锁定</Tag>;
      }
      if (record.status === "ARCHIVED") {
        return <Tag color="default">已归档</Tag>;
      }
    },
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    valueType: 'dateTime',
  },
  {
    title: "更新时间",
    dataIndex: "updated_at",
    valueType: 'dateTime',
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

export const formSchema: any = {
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
      title: "用户名",
      dataIndex: "username",
      required: true,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      required: true,
    },
    {
      title: "密码",
      dataIndex: "password",
      valueType: 'password',
      required: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: 'select',
      valueEnum: {
        ACTIVE: { text: '在职', status: 'success' },
        DISABLED: { text: '离职', status: 'error' },
        LOCKED: { text: '已锁定', status: 'warning' },
        ARCHIVED: { text: '已归档', status: 'default' },
      },
    },
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
