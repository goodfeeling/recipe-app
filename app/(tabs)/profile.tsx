import { StyleSheet, Text, View } from 'react-native';
export default function ProfileScreen() {

  return (
    <View style={styles.container}>

      <Text style={styles.welcome}>Profile</Text>
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
