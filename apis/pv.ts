// 修改 recipeApi.ts
import { get } from "@/utils/fetchTools";

type PageViewListParams = {
  pagesize: number;
  pageindex: number;
};


export const fetchPageViewList = async <T = any>(params: PageViewListParams) => {
  return await get<{ code: number; data: T }>(`/api/v1/pv/list?pagesize=${params.pagesize}&pageindex=${params.pageindex}`);
};
