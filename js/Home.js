import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
} from 'react-native';
import { 
  StackNavigator,
} from 'react-navigation';

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Tes2t</Text>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
});

export default HomeScreen;