import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API); // 替换为你的 PB 地址

export default pb;
