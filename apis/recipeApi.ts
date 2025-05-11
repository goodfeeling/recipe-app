// 修改 recipeApi.ts
import { post } from "@/utils/fetchTools";
type RecipeListParams = {
  pagesize: number;
  pageindex: number;
  name?: string;
};

// 使用泛型 T 表示 data 字段的类型
export const fetchRecipeList = async <T = any>(params: RecipeListParams) => {
  return await post<{ code: number; data: T }>('/api/v1/recipe/list', params);
};