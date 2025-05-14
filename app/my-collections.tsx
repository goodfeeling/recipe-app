import { fetchCollectList, fetchCollectRecipe } from "@/apis/collection";
import { RecipeItem } from "@/types/recipeType";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PostItem = ({ item }: { item: RecipeItem }) => {
  const navigation = useNavigation();
  navigation.setOptions({
    title: "我的收藏",
  });
  const router = useRouter();
  const [isCollected, setIsCollected] = useState(item.is_collected);

  const handlePress = () => {
    router.push({
      pathname: "/recipe-detail",
      params: { recipe_id: item.id },
    });
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.postContainer}>
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.coverImage}
        />
        <View style={styles.postContent}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.author}>作者：{item.author}</Text>
            <Text style={styles.views}>浏览：{item.view_count}</Text>
            <Text style={styles.collects}>收藏：{item.collect_count}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.collectButton}
          onPress={async () => {
            const newCollectState = !isCollected;
            setIsCollected(newCollectState);

            try {
              const response = await fetchCollectRecipe({
                recipe_id: item.id,
              });
              console.log(response);

              if (response.data?.code !== 0) {
                setIsCollected(!newCollectState); // 回滚
                Alert.alert("操作失败", "请稍后再试");
              }
            } catch (error) {
              setIsCollected(!newCollectState); // 回滚
              Alert.alert("网络错误", "无法连接服务器");
            }
          }}
        >
          <FontAwesome
            name={isCollected ? "heart" : "heart-o"}
            size={28}
            color={isCollected ? "red" : "#999"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// 定义接口返回统一结构
interface ApiResponse {
  list: RecipeItem[];
  code: number;
  data: {
    list: RecipeItem[];
  };
}

// 模拟动态页面组件
export default function MyCollect() {
  const [list, setList] = useState<RecipeItem[]>([]);
  const [pageInfo, setPageInfo] = useState({ pageindex: 1, pagesize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (pageToLoad: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const result = await fetchCollectList<ApiResponse>({
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
