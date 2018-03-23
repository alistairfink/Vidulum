import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
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
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.darkColour}
        />
        <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('DrawerOpen');}}
          >
            <Image source={require('../assets/menuIcon.png')} style={[CommonStylesheet.leftIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
          </TouchableOpacity>
          <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Vidulum</Text>
          <View style={CommonStylesheet.rightIconSet}>
            <TouchableOpacity
              onPress={() => {}}
            >
              <Image source={require('../assets/addIcon.png')} style={[CommonStylesheet.rightIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
            >
              <Image source={require('../assets/refreshIcon.png')} style={[CommonStylesheet.rightIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
            </TouchableOpacity>
          </View>
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