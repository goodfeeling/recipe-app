import { upload } from "@/utils/fetchTools";




// upload
export const fetchUpload = async <T = any>(params: FormData) => {
  return await upload<{ code: number; data: T }>("/api/v1/upload", params);
};
