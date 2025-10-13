'use client';

import { Client, Databases, Query } from "appwrite";
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { MoneyTable, MaterialsTable, ProjectDetail } from "./tables"
import PrintTable from "./PrintTable";
import PrintTableMoney from "./PrintTableMoney";

type Material = {
  id: string;
  name: string;
  unit: string;
  code: string;
  model: string;
  quantity: number;
  project_code: string;
};

type Project = {
  id: number;
  code: string;
  name: string;
  name_company: string;
  workflow: string;
  node: string;
  manager: string;
  custom_status: string;
};

type Workermoney = {
  id: string;
  subjects: string;
  unit: string;
  unitprice: string;
  quantity: number;
  sum: number;
  projectcode: string;
  projectname: string;
  name1: string;
  name2: string;
  name3: string;
};


const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);

export default function ProjectDetailPage() {
  const params = useParams();
  const code = params.code as string; // 这里就是路由里的 [code]

  const [project, setProject] = useState<Project | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [moneys, setMoneys] = useState<Workermoney[]>([]);
  const [loading, setLoading] = useState(true);



useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
        const projectsCol = process.env.NEXT_PUBLIC_APPWRITE_TABLE_PROJECT_ID!;
        const materialsCol = process.env.NEXT_PUBLIC_APPWRITE_MATERIALS_COLLECTION!;
        const moneysCol = process.env.NEXT_PUBLIC_APPWRITE_MONEYS_COLLECTION!;

        // ✅ 查询项目
        const projectRes = await databases.listDocuments(dbId, projectsCol, [
          Query.equal("code", code),
        ]);
        setProject(projectRes.documents[0] || null);

        // ✅ 查询材料
/*         const materialsRes = await databases.listDocuments(dbId, materialsCol, [
          Query.equal("project_code", code),
        ]);
        setMaterials(materialsRes.documents || []);

        // ✅ 查询工人费用
        const moneysRes = await databases.listDocuments(dbId, moneysCol, [
          Query.equal("projectcode", code),
        ]);
        setMoneys(moneysRes.documents || []); */

      } catch (e) {
        console.error("加载失败", e);
      } finally {
        setLoading(false);
      }
    };


    if (code) fetchData();
  }, [code]);

  if (loading) return <div className="p-6">加载中...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center ">工程项目详情</h1>
      <ProjectDetail project={project} />

      <h1 className="text-2xl font-semibold text-center mt-10">材料清单</h1>
      <MaterialsTable materials={materials} />
      <div>
        <h1>打印测试</h1>
        <PrintTable
          title="材料清单"
          subtitle= {`工程编号：${materials[0]?.project_code || "未知工程"}`}
          headers={[
          { key: "id", label: "编号" },
          { key: "name", label: "材料名" },          
          { key: "model", label: "型号" },
          { key: "unit", label: "单位" },
          { key: "quantity", label: "数量" },
          { key: "remark", label: "备注" },
        ]}
          data={materials}
          rowsPerPage={20}
          maxPages={5}
        />
      </div>



      <h1 className='text-2xl font-semibold text-center mt-10'>工程量清单</h1>
      <MoneyTable moneys={moneys} />

            <div>
        <h1>打印测试</h1>
        <PrintTableMoney
          title="决算清单"
          subtitle= {`工程名称：${moneys[0]?.projectname || "未知工程"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp 工程编号：${moneys[0]?.projectcode || "未知工程"}`}
          headers={[
          { key: "subjects", label: "科 目" },
          { key: "unit", label: "单位" },          
          { key: "unitprice", label: "单价" },
          { key: "quantity", label: "数量" },
          { key: "name1", label: "施工组1" },
          { key: "name2", label: "施工组2" },
          { key: "name3", label: "施工组3" },
        ]}
          data={moneys}
          rowsPerPage={20}
          maxPages={5}
        />
      </div>
    </div>
  );
}
