import { fetchRecipeDetail } from "@/apis/recipeApi";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SearchParams = {
  recipe_id: string;
};

interface RecipeDetailProps {
  id: number;
  name: string;
  dish: string;
  description: string;
  ingredient: string[];
  instructions: string[];
  author: string;
  keywords: string[];
  cover_img: string;
  view_count: number;
  collect_count: number;
  is_collected: boolean;
}
export default function RecipeDetailScreen() {
  const navigation = useNavigation();

  const { recipe_id } = useLocalSearchParams<SearchParams>();
  const [recipe, setRecipe] = useState<RecipeDetailProps | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [collected, setCollected] = useState(false);

  const fetchData = async () => {
    try {
      if (!recipe_id) {
        console.error("recipe_id 不存在");
        return;
      }

      const idNumber = parseInt(recipe_id, 10);
      if (isNaN(idNumber)) {
        console.error("recipe_id 不是有效的数字");
        return;
      }
      const result = await fetchRecipeDetail({
        id: idNumber,
      });

      if (result.success && result.data?.code === 0) {
        setRecipe(result.data?.data);
        navigation.setOptions({
          title: result.data?.data.name,
        });
      } else {
        setRecipe(null); // 明确表示没有数据
      }
    } catch (error) {
      console.error("获取食谱列表失败:", error);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [recipe_id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const renderData = [
    { type: "cover" },
    { type: "title" },
    recipe?.dish ? { type: "dish" } : null,
    recipe?.description ? { type: "description" } : null,
    { type: "ingredient" },
    { type: "instructions" },
    (recipe?.keywords || []).length > 0 ? { type: "keywords" } : null,
    { type: "author" },
    { type: "collect" },
  ].filter(Boolean); // 过滤掉 null 值

  type SectionType =
    | "cover"
    | "title"
    | "dish"
    | "description"
    | "ingredient"
    | "instructions"
    | "keywords"
    | "author"
    | "collect";

  return (
    <FlatList
      data={renderData}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => {
        const section = item as { type: SectionType };
        switch (section.type) {
          case "cover":
            return (
              <View>
                {recipe?.cover_img ? (
                  <Image
                    source={{ uri: recipe.cover_img }}
                    style={styles.coverImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text>暂无封面图</Text>
                  </View>
                )}
              </View>
            );
          case "title":
            return <Text style={styles.title}>{recipe?.name}</Text>;
          case "dish":
            return <Text style={styles.subtitle}>{recipe?.dish}</Text>;
          case "description":
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>描述</Text>
                <Text>{recipe?.description}</Text>
              </View>
            );
          case "ingredient":
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>材料</Text>
                {recipe?.ingredient.map((item, index) => (
                  <Text key={index} style={styles.listItem}>
                    {item}
                  </Text>
                ))}
              </View>
            );
          case "instructions":
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>步骤</Text>
                {recipe?.instructions.map((step, index) => (
                  <Text key={index} style={styles.listItem}>
                    • {step}
                  </Text>
                ))}
              </View>
            );
          case "keywords":
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>关键词</Text>
                <FlatList
                  data={recipe?.keywords}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={styles.keywordTag}>
                      <Text style={styles.keywordText}>{item}</Text>
                    </View>
                  )}
                />
              </View>
            );
          case "author":
            return (
              <View style={styles.section}>
                <Text>作者：{recipe?.author}</Text>
                <Text>浏览量：{recipe?.view_count}</Text>
              </View>
            );
          case "collect":
            return (
              <TouchableOpacity
                style={styles.collectButton}
                onPress={() => setCollected(!collected)}
              >
                <Text style={styles.collectButtonText}>
                  {collected ? "取消收藏" : "收藏"}
                </Text>
              </TouchableOpacity>
            );
          default:
            return null;
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 16,
  },
  placeholderImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  keywordTag: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  keywordText: {
    fontSize: 14,
    color: "#333",
  },
  collectButton: {
    backgroundColor: "#ff6347",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  collectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
