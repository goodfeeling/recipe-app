import { StyleSheet, Text, View } from 'react-native';


export default function TrendScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Trend</Text>
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
