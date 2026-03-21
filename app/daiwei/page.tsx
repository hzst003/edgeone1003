import fs from "node:fs";
import path from "node:path";
import RecordsClient, { type DaiweiRecord } from "./records-client";

type RawRow = {
  hypterlink?: string;
  拍摄地点?: string;
  井型号?: string;
  经度?: number;
  纬度?: number;
  道路名称?: string;
};

function mapRows(raw: RawRow[]): DaiweiRecord[] {
  return raw.map((row, index) => {
    const link = row.hypterlink ?? null;
    return {
      $id: link ? `${index}-${link}` : `row-${index}`,
      photo: link,
      location: row.拍摄地点 ?? null,
      well: row.井型号 ?? null,
      longitude: row.经度 ?? null,
      latitude: row.纬度 ?? null,
      name1: row.道路名称 ?? null,
      name2: null,
    };
  });
}

export default function DaiweiPage() {
  const filePath = path.join(process.cwd(), "app/daiwei/data.json");
  const json = fs.readFileSync(filePath, "utf8");
  const records = mapRows(JSON.parse(json) as RawRow[]);

  return <RecordsClient data={records} />;
}
