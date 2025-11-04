/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ModuleRegistry } from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-theme-alpine.css";
import PocketBase from "pocketbase";


export default function ProjectsPage() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ✅ 加载状态

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API);

    setLoading(true); // 开始加载
    pb.collection("workermoney2025")
      .getFullList()
      .then((records) => {
        setRowData(
          records.map((r) => ({
            subjects: r.subjects,
            unitprice: r.unitprice,
            quantity: r.quantity,
            sum: r.sum,
            projectname: r.projectname,
            projectcode: r.projectcode,
            fence: r.fence,
            remark: r.remark,
            name1: r.name1,
            name2: r.name2,
            name3: r.name3,
            name4: r.name4,
          }))
        );
      })
      .catch((err) => console.error("PB error:", err))
      .finally(() => setLoading(false)); // ✅ 加载完成
  }, []);

  const columnDefs = [
    { headerName: "科目", field: "subjects" },
    { headerName: "单价", field: "unitprice", width: 100 },
    { headerName: "数量", field: "quantity", width: 100 },
    { headerName: "金额", field: "sum", width: 100 },
    { headerName: "施工员1", field: "name1", width: 100 },
    { headerName: "施工员2", field: "name2", width: 100 },
    { headerName: "施工员3", field: "name3", width: 100 },
    { headerName: "施工员4", field: "name4", width: 100 },
    { headerName: "分册", field: "fence", width: 150 },
    { headerName: "工程名称", field: "projectname", width: 300 },
    { headerName: "工程编号", field: "projectcode", width: 200 },
    { headerName: "备注", field: "remark" },
  ];

  const defaultColDef = {
    sortable: true,
    filter: "agTextColumnFilter",
    filterParams: {
      filterOptions: ["contains"],
      suppressAndOrCondition: true,
    },
    resizable: true,
    floatingFilter: true, // ✅ 表头筛选行
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">工程量与施工人</h1>

      {/* ✅ 加载状态提示 */}
      {loading ? (
        <div className="flex justify-center items-center h-[500px] text-gray-600 text-lg">
          ⏳ 正在加载数据，请稍候...
        </div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 1000 }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            domLayout="normal"
          />
        </div>
      )}
    </div>
  );
}
