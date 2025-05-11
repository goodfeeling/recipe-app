import { fetchRecipeList } from "@/apis/recipeApi";
import { RecipeItem } from "@/types/recipeType";
import { create } from "zustand";

// 定义接口返回统一结构
interface ApiResponse {
  list: RecipeItem[] | undefined;
  code: number;
  data: {
    list: RecipeItem[];
  };
}

interface RecipeState {
  list: RecipeItem[];
  getList: (title: string) => void;
}

const useRecipeStore = create<RecipeState>((set) => ({
  list: [],
  getList: async (title: string) => {
 
    
    try {
      const result = await fetchRecipeList<ApiResponse>({
        pagesize: 10,
        pageindex: 1,
        name: title,
      });
   console.log(result);
      if (result.success && result.data?.code === 200) {
        // 注意这里的变化
        set({ list: result.data.data.list });
      }
    } catch (error) {
      console.error("获取食谱列表失败:", error);
    }
  },
}));

export default useRecipeStore;