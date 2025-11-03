"use client";
// 在你的应用入口文件（如 index.tsx, App.tsx 或某个初始化文件）的顶部
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

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API); 

    pb.collection("workermoney2025")
      .getFullList()
      .then((records) => {
        console.log("PB Records:", records);
        setRowData(
          records.map((r) => ({
            subjects: r.subjects,
            unitprice: r.unitprice,
            quantity: r.quantity,
            sum: r.sum ?? r.unitprice * r.quantity,
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
      .catch((err) => console.error("PB error:", err));
  }, []);

  const columnDefs = [
    { headerName: "科目", field: "subjects" },
    { headerName: "单价", field: "unitprice", width: 100 },
    { headerName: "数量", field: "quantity", width: 100 },
    { headerName: "金额", field: "sum" },
    { headerName: "施工员1", field: "name1", width: 100 },
    { headerName: "施工员2", field: "name2", width: 100 },
    { headerName: "施工员3", field: "name3", width: 100 },
    { headerName: "施工员4", field: "name4", width: 100 },
    { headerName: "分册", field: "fence", width: 150 },
    { headerName: "工程名称", field: "projectname", width: 300 },
    { headerName: "工程编号", field: "projectcode", width: 200 },
    { headerName: "备注", field: "remark" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center ">工程量与施工人</h1>
      <div className="ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, filter: true }}
          pagination={true} // Enable pagination
          paginationPageSize={20} // Number of rows per page
          domLayout="autoHeight" // Automatically adjust the grid's height based on the number of rows
        />
      </div>
    </div>
  );
}
