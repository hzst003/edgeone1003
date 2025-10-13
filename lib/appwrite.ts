import { Client, Storage, ID, Databases } from "appwrite";
const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const storage = new Storage(client);
export const generateId = ID.unique;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
export const databases = new Databases(client);


// types/appwrite.ts

/**
 * 通用 Appwrite 文档类型
 * T 表示业务字段类型
 */
export type AppwriteDocument<T = object> = T & {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
  $createdAt: string;
  $updatedAt: string;
  $sequence: number;
};

export type ProjectCreate = {
  id: string;
  code: string;
  name: string;
  name_company: string;
  workflow: string;
  node: string;
  manager: string;
  custom_status: string;
};

type MaterialCreate = {
  id: string;
  name: string;
  unit: string;
  code: string;
  model: string;
  quantity: number;
  project_code: string;
};

type WorkermoneyCreate = {
  id: string;
  subjects: string;
  unit: string;
  unitprice: number;
  quantity: number;
  sum: number;
  projectcode: string;
  projectname: string;
  name1: string;
  name2: string;
  name3: string;
};
// 获取文档时包含 Appwrite 系统字段
export type Project = AppwriteDocument<ProjectCreate>;
export type Material = AppwriteDocument<MaterialCreate>;
export type Workermoney = AppwriteDocument<WorkermoneyCreate>;