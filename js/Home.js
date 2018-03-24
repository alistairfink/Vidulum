import React from 'react';
import { 
  StackNavigator,
} from 'react-navigation';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  ScrollView,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';
const win = Dimensions.get('window');

class Add extends React.Component {
  constructor(props){
    super(props);
    this.saveFunc = this.saveFunc.bind(this);
  }
  componentWillMount() {
    this.animateValue = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.animateValue,            // The animated value to drive
      {
        toValue: win.height-StatusBar.currentHeight,                   // Animate to opacity: 1 (opaque)
        duration: 800,
        easing: Easing.bounce,             // Make it take a while
      }
    ).start();
  }   
  saveFunc() {
    this.props.handler();
  }
  render() {
    const animatedStyle = {height: this.animateValue}
    return (
      <View style={{backgroundColor: Globals.DefaultSettings.theme.primaryColour, flex: 1}}>
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.darkColour}
        />
        <Animated.View style={animatedStyle}>
          <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour}]}>
            <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
              <TouchableOpacity
                onPress={this.props.handler}
              >
                <Image source={require('../assets/cancelIcon.png')} style={[CommonStylesheet.leftIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
              </TouchableOpacity>
              <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Add Address</Text>
            </View>
            <ScrollView>

            </ScrollView>
            <View style={[styles.footer, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
              <TouchableOpacity style={styles.footerButton} 
                onPress={this.props.handler}
              >
                <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Cancel</Text>            
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.footerButton, 
                  {borderLeftColor: Globals.DefaultSettings.theme.darkColour, borderLeftWidth: 1}]
                } 
                onPress={this.saveFunc}
              >
                <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      adding: false,
    };
  }
  backHandle(){
    this.setState({adding: false});
  }
  render() {
    if(this.state.adding)
    {
      return (
        <Add handler={this.backHandle.bind(this)}/>
      );
    }
    else
    {
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
                onPress={() => {this.setState({adding: true});}}
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
}

//Styles
const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  footer:{
    flexDirection: 'row', 
    height: 50, 
  },
  footerText: {
    fontSize: 20,
  },
  footerButton: {
    width: win.width/2,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default HomeScreen;