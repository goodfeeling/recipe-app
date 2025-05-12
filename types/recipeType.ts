export type RecipeItem = {
  id: number;
  name: string;
  description: string;
  author: string;
  cover_img: string;
  view_count: number;
  collect_count: number;
  is_collected: boolean;
};

export type RecipeListResponse = {
  code: number;
  data: {
    list: RecipeItem[];
    page_index: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  msg: string;
};
