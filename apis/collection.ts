// 修改 recipeApi.ts
import { post } from "@/utils/fetchTools";


type CollectParams = {
  recipe_id: number;
};

type CollectListParams = {
  pagesize: number;
  pageindex: number;
};

// 收藏
export const fetchCollectRecipe = async <T = any>(params: CollectParams) => {
  return await post<{ code: number; data: T }>('/api/v1/collect/add', params);
};


export const fetchCollectList = async <T = any>(params: CollectListParams) => {
  return await post<{ code: number; data: T }>('/api/v1/collect/list', params);
};
