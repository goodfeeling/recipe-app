import { post } from "@/utils/fetchTools";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

type Post = {
  id: number;
  name: string; // 名称
  description: string; // 描述
  author: string; // 作者
  cover_img: string; // 封面图
  view_count: number; // 浏览量
  collect_count: number; // 收藏量
};

// 修改 DynamicScreen 以支持 route.params
type DynamicScreenProps = {
  route: RouteProp<ParamListBase, string>;
};

interface RecipeListResponse {
  code: number;
  data: {
    list: Post[];
    page_index: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  msg: string;
}

const PostItem = ({ item }: { item: Post }) => {
  return (
  <View style={styles.postContainer}>
    <Image source={require('@/assets/images/react-logo.png')} style={styles.coverImage} />
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
  </View>
)
};

// 模拟动态页面组件
function DynamicScreen({ route }: DynamicScreenProps) {
  const { title } = route.params as { title: string };
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await post<RecipeListResponse>(
        `http://172.26.216.120:3000/api/v1/recipe/list`,
        {
          pagesize: 10,
          pageindex: 1,
          name: title,
        }
      );

      if (result.success && result.data?.code === 200) {
        setPosts(result.data.data.list);
      }
    };
    fetchData();
  }, [title]);

  return (
    <View style={styles.container}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => <PostItem item={item} />}
        />
     
      ) : (
        <Text>没有数据</Text>
      )}
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
    shadowColor: "#000", // iOS 阴影
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
});
