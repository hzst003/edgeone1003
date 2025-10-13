"use client";
import React, { useState } from "react";

type RowData = Record<string, string | number>;

interface HeaderConfig {
  key: string;   // 数据字段
  label: string; // 表头显示
}

interface PrintTableProps {
  title?: string;       // 主标题
  subtitle?: string;    // 副标题，如工程名称
  headers: HeaderConfig[];
  data: RowData[];
  rowsPerPage?: number;
  maxPages?: number;
}

const PrintTable: React.FC<PrintTableProps> = ({
  title = "分页表格打印",
  subtitle = "",
  headers,
  data,
  rowsPerPage = 20,
  maxPages = 10,
}) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const totalPages = Math.min(maxPages, Math.ceil(data.length / rowsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) =>
    data.slice(i * rowsPerPage, (i + 1) * rowsPerPage)
  );

  const handlePrint = () => {
    if (isPrinting) return;
    setIsPrinting(true);

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-9999px";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const currentDate = new Date().toLocaleDateString("zh-CN");

    const printStyles = `
      <style>
        @media print {
          @page { size: A4; margin: 1cm; }
          body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; }
          .print-page { padding: 20px; page-break-inside: avoid; }
          .print-page:not(:last-child) { page-break-after: always; }
          .print-header { text-align: center; margin-bottom: 4px; }
          .print-header .title { font-size: 18px; font-weight: bold; }
          .print-header .subtitle {
  font-size: 12px;     /* 小一号字体 */
  text-align: left;    /* 靠左显示 */
  margin-top: 4px;
}
          
          .print-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
          .print-table th, .print-table td { border: 1px solid #bbb; padding: 6px 4px; text-align: left; }
          .print-table thead { display: table-header-group; background: #f0f0f0; }
          .print-footer { width: 100%; text-align: center; font-size: 10px; margin-top: 5px; }
        }
      </style>
    `;

    let html = `<html><head><meta charset="UTF-8"><title>${title}</title>${printStyles}</head><body>`;

    pages.forEach((pageData, pageIndex) => {
      html += `
        <div class="print-page">
          <div class="print-header">
            <div class="title">${title}</div>
            ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ""}
            
          </div>

          <table class="print-table">
            <thead>
              <tr>${headers.map((h) => `<th>${h.label}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${pageData
                .map(
                  (row) =>
                    `<tr>${headers
                      .map((h) => `<td>${row[h.key] ?? ""}</td>`)
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>

          ${
            pageIndex === totalPages - 1
              ? `<div style="display:flex; width:100%; font-size:12px; margin-top:10px;">
                  <div style="flex:1;text-align:center;">制表人：________</div>
                  <div style="flex:1;text-align:center;">确认人：________</div>
                  <div style="flex:1;text-align:center;">日期：${currentDate}</div>
                </div>`
              : ""
          }

          <div class="print-footer">第 ${pageIndex + 1} 页 共 ${totalPages} 页</div>
        </div>
      `;
    });

    html += `</body></html>`;

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
        setIsPrinting(false);
      }, 100); // 给浏览器渲染时间
    };
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={handlePrint}
        disabled={isPrinting}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          backgroundColor: isPrinting ? "#6c757d" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: isPrinting ? "not-allowed" : "pointer",
        }}
      >
        {isPrinting ? "准备打印..." : "打印材料单"}
      </button>
    </div>
  );
};

export default PrintTable;
