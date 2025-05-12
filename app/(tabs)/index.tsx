import { fetchRecipeList } from "@/apis/recipeApi";
import { RecipeItem } from "@/types/recipeType";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 修改 DynamicScreen 以支持 route.params
type DynamicScreenProps = {
  route: RouteProp<ParamListBase, string>;
};

const PostItem = ({ item }: { item: RecipeItem }) => {
  const [isCollected,setIsCollected] = useState(item.is_collected);
  return (
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

          
        }}
      >
        <Text style={[styles.collectText,isCollected && styles.collected]}>
          ❤
        </Text>
      </TouchableOpacity>
    </View>
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
function DynamicScreen({ route }: DynamicScreenProps) {
  const { title } = route.params as { title: string };
  const [list, setList] = useState<RecipeItem[]>([]);
  const [pageInfo, setPageInfo] = useState({ pageindex: 1, pagesize: 10 });
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (pageToLoad: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const result = await fetchRecipeList<ApiResponse>({
        pagesize: pageInfo.pagesize,
        pageindex: pageToLoad,
        name: title,
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
  }, [title]);

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

const Tab = createMaterialTopTabNavigator();
export default function HomeScreen() {
  const tabs = ["豆角", "茄子", "胡萝卜", "南瓜"];
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true, // 启用横向滚动
        tabBarIndicatorStyle: { backgroundColor: "blue" }, // 可选：自定义指示器样式
        tabBarLabelStyle: { width: 120, fontSize: 14 }, // 可选：设置每个 tab 标签的宽度和字体大小
        tabBarStyle: { backgroundColor: "#f8f8f8" }, // 可选：设置 tab 条背景色
      }}
    >
      {tabs.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item}
          component={DynamicScreen}
          initialParams={{ title: item }}
        />
      ))}
    </Tab.Navigator>
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
  position: 'absolute',
  top: 8,
  right: 8,
  padding: 4,
  zIndex: 1,
},
collectText: {
  fontSize: 18,
  color: '#999',
},
collected: {
  color: 'red',
},
});
