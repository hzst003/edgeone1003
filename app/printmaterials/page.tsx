"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Client, Databases, Query } from "appwrite";


// 初始化 Appwrite
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const databases = new Databases(client);

// 类型定义
interface Project {
  $id: string;
  code: string;
  name: string;
  workflow: string;
  name_company: string;
  manager: string;
}

interface Material {
  $id: string;
  project_code: string;
  code: string;
  name: string;
  unit: string;
  model: string;
  quantity: number;
}

// 查询函数
async function getProjects(): Promise<Project[]> {
  const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
  const col = process.env.NEXT_PUBLIC_APPWRITE_TABLE_PROJECT_ID as string;

  const res = await databases.listDocuments<Project>(db, col, [Query.limit(1000)]);
  return res.documents;
}

async function getMaterialsByProjectCode(code: string): Promise<Material[]> {
  const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
  const col = process.env.NEXT_PUBLIC_APPWRITE_TABLE_MATERIAL_ID as string;

  const res = await databases.listDocuments<Material>(db, col, [
    Query.equal("project_code", code),
    Query.limit(1000),
  ]);
  return res.documents;
}

export default function ProjectMaterialsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const gridRef = useRef<AgGridReact>(null);

  // 加载工程列表
  useEffect(() => {
    setLoading(true);
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  // 打印选中工程材料表
  const handlePrint = async () => {
    if (selectedCodes.length === 0) {
      alert("请先选择至少一个工程。");
      return;
    }
    if (selectedCodes.length > 50) {
      alert("一次最多打印 50 个工程！");
      return;
    }

    setLoading(true);
    try {
      // 并行请求材料数据
      const allData = await Promise.all(
        selectedCodes.map(async (code) => {
          const mats = await getMaterialsByProjectCode(code);
          return { code, materials: mats };
        })
      );


      // 竖版 A4 样式
      const style = `
  <style>
    @page { size: A4 portrait; margin: 20mm 15mm; }
    body { font-family: "Microsoft YaHei", Arial, sans-serif; font-size: 12px; color: #000; }
    h1 { font-size: 18px; text-align: center; margin-bottom: 12px; }
    h2 { font-size: 14px; margin: 6px 0 12px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
    th, td { border: 1px solid #333; padding: 6px 8px; font-size: 12px; }
    th { background-color: #f0f0f0; text-align: center; }
    td { text-align: left; }
    td.number { text-align: right; }
    .page-break { page-break-after: always; }
    .footer { margin-top: 10px; font-size: 12px; display: flex; justify-content: space-between; }
    .footer div { width: 30%; text-align: center; }
  </style>
`;

      const html = `
<html>
  <head><meta charset="utf-8">${style}</head>
  <body>
    ${allData
          .map(
            (section) => `
        <div class="page-break">
          <h1>工程材料表</h1>
          <h2>工程编号：${section.code}</h2>
          <table>
            <thead>
              <tr>
                <th>序号</th>
                <th>材料编号</th>
                <th>名称</th>
                <th>单位</th>
                <th>型号</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              ${section.materials.length > 0
                ? section.materials
                  .map(
                    (m, i) => `
                        <tr>
                          <td>${i + 1}</td>
                          <td>${m.code}</td>
                          <td>${m.name}</td>
                          <td>${m.unit}</td>
                          <td>${m.model}</td>
                          <td class="number">${m.quantity}</td>
                        </tr>
                      `
                  )
                  .join("")
                : `<tr><td colspan="6" style="text-align:center;color:#888;">无材料数据</td></tr>`
              }
            </tbody>
          </table>
          <div class="footer">
            <div>制表人：__________</div>
            <div>日期：${new Date().toLocaleDateString()}</div>
            <div>审核人：__________</div>
          </div>
        </div>
      `
          )
          .join("")}
  </body>
</html>
`;


      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    } catch (err) {
      console.error(err);
      alert("打印失败，请稍后重试！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">工程材料打印</h1>

      <div className="flex items-center gap-3 mb-3">
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          disabled={selectedCodes.length === 0 || selectedCodes.length > 50 || loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "打印选中工程材料表"}
        </Button>

        <div className="text-gray-500 text-sm ml-4">
          已选工程：{selectedCodes.join(", ") || "无"} / 共 {projects.length} 个工程
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: "70vh", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={projects}
          columnDefs={[
            { field: "code", headerName: "工程编号", width: 260, checkboxSelection: true },
            { field: "name", headerName: "工程名称", flex: 1 },
            { field: "name_company", headerName: "公司名称", flex: 1 },
            { field: "workflow", headerName: "工作流程", flex: 1 },
            { field: "manager", headerName: "负责人", width: 160 },
          ]}
          rowSelection="multiple"
          onSelectionChanged={() => {
            const selectedRows = gridRef.current?.api.getSelectedRows() ?? [];
            setSelectedCodes(selectedRows.map(r => r.code));
          }}
          defaultColDef={{ sortable: true, filter: true, resizable: true }}
          animateRows
        />
      </div>
    </div>
  );
}
