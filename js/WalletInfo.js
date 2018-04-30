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
  Keyboard,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';

const win = Dimensions.get('window');

class WalletInfo extends React.Component {
  constructor(props){
    super(props);
  }
  componentWillMount() {
    //Starts animation
    this.animateValue = new Animated.Value(win.width);
  } 
  componentDidMount() {
    Animated.timing(               
      this.animateValue,           
      {
        toValue: 0,//win.height-StatusBar.currentHeight,                  
        duration: 200,
        easing: Easing.bounce,             
      }
    ).start();
  }  
  render() {
    const animatedStyle = {left: this.animateValue}
    return (
      <View style={{backgroundColor: Globals.DefaultSettings.theme.backgroundColour, width: win.width, position: 'absolute',}}>
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.darkColour}
        />
        <Animated.View style={animatedStyle}>
          <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour, height: win.height-StatusBar.currentHeight}]}>
            <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
              <TouchableOpacity
                onPress={this.props.handler}
              >
                <Image source={require('../assets/cancelIcon.png')} style={[CommonStylesheet.leftIcon, 
                  {tintColor: Globals.DefaultSettings.theme.textColour}]}
                />
              </TouchableOpacity>
              <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Add Wallet</Text>
            </View>
            <ScrollView
              ref={scrollView => this.mainScroll = scrollView}
            >
              <Text style={{color: 'white'}}>this.props.test</Text>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default WalletInfo;