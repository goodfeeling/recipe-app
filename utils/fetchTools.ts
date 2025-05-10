// 定义请求的响应结构（根据你的 API 接口定义调整）
type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
  };
  
  // 默认 fetch 配置
  const DEFAULT_OPTIONS: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 根据需要携带 cookie
  };
  
  // 封装 fetch 方法
  async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      headers: {
        ...DEFAULT_OPTIONS.headers,
        ...(options.headers || {}),
      },
    };
  
    try {
      const response = await fetch(url, mergedOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: T = await response.json();
  
      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      return {
        success: false,
        message: error.message || "Network error",
      };
    }
  }
  
  // 快捷方法 GET POST 等
  const get = <T>(url: string) => request<T>(url, { method: "GET" });
  const post = <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) });
  
  export { request, get, post };