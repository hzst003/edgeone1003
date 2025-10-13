"use client";
import React from "react";

type Project = {
  id: number | string;
  name: string;
  code: string;
  name_company: string;
  workflow: string;
  node: string;
  manager: string;
  custom_status: string;
};

type ProjectDetailProps = {
  project?: Project | null;
};

type Material = {
  id: number | string;
  name: string;
  unit: string;
  code: string;
  model: string;
  quantity: number | string;
};

type MoneyItem = {
  id: number | string;
  subjects: string;
  unit: string;
  unitprice: number | string;
  quantity: number | string;
  sum: number | string;
  name1: string;
  name2: string;
  name3: string;
};

type MoneyTableProps = {
  moneys: MoneyItem[];
};

export const MoneyTable: React.FC<MoneyTableProps> = ({ moneys }) => {
  if (!moneys || moneys.length === 0) {
    return <p className="text-gray-500">无工程量数据。</p>;
  }

  return (
<table className="w-full border-collapse text-sm shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
      <th className="border border-gray-300 p-2">项目</th>
      <th className="border border-gray-300 p-2">单位</th>
      <th className="border border-gray-300 p-2">单价</th>
      <th className="border border-gray-300 p-2">数量</th>
      <th className="border border-gray-300 p-2">合计</th>
      <th className="border border-gray-300 p-2">姓名1</th>
      <th className="border border-gray-300 p-2">姓名2</th>
      <th className="border border-gray-300 p-2">姓名3</th>
    </tr>
  </thead>
  <tbody>
    {moneys.map((m, index) => (
      <tr
        key={m.id}
        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
      >
        <td className="border border-gray-200 p-2">{m.subjects}</td>
        <td className="border border-gray-200 p-2 text-center">{m.unit}</td>
        <td className="border border-gray-200 p-2 text-center">{m.unitprice}</td>
        <td className="border border-gray-200 p-2 text-center">{m.quantity}</td>
        <td className="border border-gray-200 p-2 text-center font-semibold text-blue-600">{m.sum}</td>
        <td className="border border-gray-200 p-2 text-center">{m.name1}</td>
        <td className="border border-gray-200 p-2 text-center">{m.name2}</td>
        <td className="border border-gray-200 p-2 text-center">{m.name3}</td>
      </tr>
    ))}
  </tbody>
</table>
  );
};


// ================= MaterialsTable =================
type MaterialsTableProps = {
  materials: Material[];
};

export const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return <p className="text-gray-500">无材料数据。</p>;
  }

  return (
<table className="w-full border-collapse text-sm shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
      <th className="border border-gray-300 p-2">名称</th>
      <th className="border border-gray-300 p-2">单位</th>
      <th className="border border-gray-300 p-2">编号</th>
      <th className="border border-gray-300 p-2">型号</th>
      <th className="border border-gray-300 p-2">数量</th>
    </tr>
  </thead>
  <tbody>
    {materials.map((m, index) => (
      <tr
        key={m.id}
        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
      >
        <td className="border border-gray-200 p-2">{m.name}</td>
        <td className="border border-gray-200 p-2 text-center">{m.unit}</td>
        <td className="border border-gray-200 p-2 text-center">{m.code}</td>
        <td className="border border-gray-200 p-2 text-center">{m.model}</td>
        <td className="border border-gray-200 p-2 text-center font-semibold text-blue-600">
          {m.quantity}
        </td>
      </tr>
    ))}
  </tbody>
</table>

  );
};


export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  if (!project) {
    return <p className="text-red-500">未找到该项目。</p>;
  }

  return (
    <div className="mb-6 border p-4 rounded bg-gray-50">
      <p>
        <strong>名称：</strong>
        {project.name}
      </p>
      <p>
        <strong>编号：</strong>
        {project.code}
      </p>
      <p>
        <strong>公司：</strong>
        {project.name_company}
      </p>
      <p>
        <strong>流程：</strong>
        {project.workflow}
      </p>
      <p>
        <strong>节点：</strong>
        {project.node}
      </p>
      <p>
        <strong>负责人：</strong>
        {project.manager}
      </p>
      <p>
        <strong>状态：</strong>
        {project.custom_status}
      </p>
    </div>
  );
};