"use client";

import { Button } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Client, Databases, Query } from "appwrite";

type Project = {
  $id: string;
  code: string;
  name: string;
  name_company: string;
  workflow: string;
  node: string;
  manager: string;
  custom_status: string;
};

// ✅ 初始化 Appwrite 客户端
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

const databases = new Databases(client);

// ✅ 分页加载所有项目
async function getProjects(): Promise<Project[]> {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_TABLE_PROJECT_ID as string;

  const limit = 1000;
  let offset = 0;
  let allDocs: Project[] = [];

  while (true) {
    const res = await databases.listDocuments<Project>(databaseId, collectionId, [
      Query.limit(limit),
      Query.offset(offset),
    ]);

    allDocs = allDocs.concat(res.documents);

    if (res.documents.length < limit) break;
    offset += limit;
  }

  console.log("✅ Loaded projects:", allDocs.length);
  return allDocs;
}

export default function ProjectsPage() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  // 加载项目数据
  useEffect(() => {
    getProjects()
      .then((projects) => {
        console.log("✅ fetched:", projects.length);
        setData(projects);
      })
      .catch((err) => {
        console.error("❌ fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ 搜索过滤 + 初始化显示全部
  const filteredRows = useMemo(() => {
    if (loading) return [];
    if (!searchText.trim()) return data; // 初始显示全部

    const lower = searchText.toLowerCase();
    return data.filter(
      (row) =>
        row.name?.toLowerCase().includes(lower) ||
        row.code?.toLowerCase().includes(lower) ||
        row.name_company?.toLowerCase().includes(lower)||
        row.manager?.toLowerCase().includes(lower)
    );
  }, [data, searchText, loading]);

  // DataGrid 列定义
  const columns: GridColDef<Project>[] = [
    { field: "code", headerName: "编号", width: 150 },
    { field: "name", headerName: "项目名称", width: 350 },
    {
      field: "actions",
      headerName: "操作",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            height: "100%",
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            href={`/projects/${params.row.code}`}
            target="_blank"
          >
            查看
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => {
              console.log("发送:", params.row.$id);
            }}
          >
            发送
          </Button>
        </div>
      ),
    },
    { field: "manager", headerName: "负责人", width: 150 },
    { field: "name_company", headerName: "公司名称", width: 200 },
    { field: "workflow", headerName: "工作流", width: 150 },
    { field: "node", headerName: "节点", width: 150 },
    { field: "custom_status", headerName: "状态", width: 150 },
  ];

  return (
    <div className="p-4">
      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索编号 / 项目名称 / 公司名称 / 负责人"
          className="border rounded px-3 py-2 w-full md:w-1/3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* DataGrid */}
      <div style={{ height: "100%", width: "100%" }}>
        <DataGrid
          key={filteredRows.length} // ✅ 强制刷新防止初始空白
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row.$id}
          pageSizeOptions={[20, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}
