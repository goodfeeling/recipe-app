import { StyleSheet, Text, View } from 'react-native';


export default function ChatSheetScreen() {

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
