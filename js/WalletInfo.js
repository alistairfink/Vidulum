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

    this.getEth = this.getEth.bind(this);
    this.getBtc = this.getBtc.bind(this);
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
        duration: 100,           
      }
    ).start();
  }  
  exit() {
    Animated.timing(
      this.animateValue,
      {
        toValue: win.width,
        duration: 100,
      }
    ).start();
    setTimeout(() => this.props.handler(), 100);
  }
  getEth() {

  }
  getBtc() {

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
                onPress={() => this.exit()}
              >
                <Image source={require('../assets/cancelIcon.png')} style={[CommonStylesheet.leftIcon, 
                  {tintColor: Globals.DefaultSettings.theme.textColour}]}
                />
              </TouchableOpacity>
              <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>{this.props.wallet.name ? this.props.wallet.name : this.props.wallet.address}</Text>
            </View>
            <ScrollView>
              <Text style={{color: 'white'}}>{JSON.stringify(this.props.wallet)}</Text>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default WalletInfo;