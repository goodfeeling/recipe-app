import { fetchPageViewList } from "@/apis/pv";
import { formatTime } from "@/utils/timeTools";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PostItem = ({ item }: { item: PageView }) => {
  const navigation = useNavigation();

  const router = useRouter();
  const handlePress = () => {
    router.push({
      pathname: "/recipe-detail",
      params: { recipe_id: item.recipe.id },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: "历史记录",
    });
  }, []);
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.postContainer}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.coverImage}
        />
        <View style={styles.postContent}>
          <Text style={styles.title}>{item.recipe.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.recipe.description}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.collects}>
              浏览时间：{formatTime(item.created_at)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 定义接口返回统一结构
interface ApiResponse {
  list: PageView[];
  code: number;
  data: {
    list: PageView[];
  };
}

type RecipeItem = {
  id: number;
  name: string;
  description: string;
  author: string;
  cover_img: string;
  view_count: number;
  collect_count: number;
  is_collected: boolean;
};

type PageView = {
  id: number;
  recipe_id: number;
  user_id: number;
  recipe: RecipeItem;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

// 模拟动态页面组件
export default function MyCollect() {
  const [list, setList] = useState<PageView[]>([]);
  const [pageInfo, setPageInfo] = useState({ pageindex: 1, pagesize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (pageToLoad: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const result = await fetchPageViewList<ApiResponse>({
        pagesize: pageInfo.pagesize,
        pageindex: pageToLoad,
      });

      if (result.success && result.data?.code === 200) {
        const newData = result.data.data.list;
        setList((prevList) => [...prevList, ...newData]);
        setPageInfo((prev) => ({ ...prev, pageindex: pageToLoad }));
        // 假设接口返回的数据小于 pagesize 表示没有更多了
        if (newData.length < pageInfo.pagesize) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("获取食谱列表失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 切换 tab 时重置状态
    setPageInfo({ pageindex: 1, pagesize: 10 });
    setList([]);
    setHasMore(true);
    fetchData(1);
  }, []);

  return (
    <View style={styles.container}>
      {list.length > 0 ? (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostItem item={item} />}
          onEndReached={() => {
            if (hasMore) {
              fetchData(pageInfo.pageindex + 1);
            }
          }}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <Text>没有数据</Text>
      )}
      {isLoading && <Text>加载中...</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 30,
  },
  postContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2, // Android 阴影
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // 使用标准 boxShadow
  },
  coverImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
  },
  postContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  author: {
    fontSize: 12,
    color: "#999",
  },
  views: {
    fontSize: 12,
    color: "#999",
  },
  collects: {
    fontSize: 12,
    color: "#999",
  },

  collectButton: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
  collectText: {
    fontSize: 18,
    color: "#999",
  },
  collected: {
    color: "red",
  },
});
