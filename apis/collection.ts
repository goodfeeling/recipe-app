// 修改 recipeApi.ts
import { post } from "@/utils/fetchTools";


type CollecttParams = {
  recipe_id: number;
};

// 收藏
export const fetchCollectRecipe = async <T = any>(params: CollecttParams) => {
  return await post<{ code: number; data: T }>('/api/v1/collect/add', params);
};


