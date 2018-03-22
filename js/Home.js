import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour}]}>
        <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>

        </View>
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