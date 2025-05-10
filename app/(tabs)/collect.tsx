import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';


export default function CollectScreen() {
  const navigation = useNavigation();
  useEffect(()=>{
    navigation.setOptions({
      tabBarLabel: 'title'
    })
  },[navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Collect</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#F%FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20
  }
});
