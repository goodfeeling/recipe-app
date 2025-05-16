import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function ChatSheetScreen() {
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.item}>
      <Image source={require("@/assets/images/react-logo.png")} />
      <Text> 肉类</Text>
    </View>
  );
  return (
    <FlatList
        data={[...Array(20)]}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={3}
      ></FlatList>
  );
}

const styles = StyleSheet.create({

  item: {
    flex:1,
    width: "30%", // 可保留作为最小宽度限制
    maxWidth: "33.33%", // 控制最大不超过三分之一
    alignItems:"center",
    justifyContent: "center",
    marginBottom: 10,
  },
});
