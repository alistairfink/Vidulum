//Imports
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  Dimensions, 
  Button, 
  ToastAndroid, 
  TouchableOpacity,
  ScrollView,
  Switch,
  AsyncStorage,
  TextInput,
  Linking,
  Animated,
  Easing,
  StatusBar,
  Alert,
  TouchableNativeFeedback,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';

const win = Dimensions.get('window');

class Donate extends React.Component {
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
            onPress={() => {this.props.navigation.navigate('DrawerOpen'); this.props.navigation.drawerBackground}}
          >
            <Image source={require('../assets/menuIcon.png')} style={[CommonStylesheet.leftIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
          </TouchableOpacity>
          <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Support Me</Text>
        </View>
        <ScrollView>

        </ScrollView>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({

});

export default Donate;