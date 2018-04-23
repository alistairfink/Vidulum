import React, { Component } from 'react';
import { 
  DrawerNavigator,
  NavigationActions,
} from 'react-navigation';
import { 
  Text,
  AsyncStorage,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Button,
  TouchableNativeFeedback,
  StatusBar,
  Vibration,
} from 'react-native';

import HomeScreen from './js/Home';
import Settings from './js/Settings';

import Globals from './js/Globals';
import CommonStylesheet from './js/Stylesheet';

class navDrawer extends React.Component {
  constructor(props){
    super(props);
    this.menuItems = [
      {
        displayText: 'Home',
        name: 'Home',
        icon: require('./assets/homeIcon.png'),
      },
      {
        displayText: 'Settings',
        name: 'Settings',
        icon: require('./assets/settingsIcon.png'),
      },
    ];
  }
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  render() {
    return(
      <ScrollView style={{backgroundColor: Globals.DefaultSettings.theme.primaryColour}}>
        <ImageBackground source={require('./assets/background.jpg')} style={styles.drawerHeader}>

        </ImageBackground>
        {this.menuItems.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              onPress={this.navigateToScreen(item.name)}
              style={styles.drawerItem}
            > 
              <View style={{flexDirection: 'row' }}>
                <View>
                  <Image source={item.icon} style={[styles.menuIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
                </View>
                <View style={styles.menuTextOutter}>
                  <Text style={[styles.menuText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.displayText}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }
}

//Navigator for pages
let RootStack = DrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: Settings,
    },
  },
  {
    headerMode: 'none',
    //transitionConfig: getSlideFromRightTransition,//Right to left transition
    initialRouteName: 'Home',//Initial page
    contentComponent: navDrawer,
  }
);

class LockScreen extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      hiddenPass: '',
    };
    this.pass = '';
    this.truePass = '';
    this.pinInput = this.pinInput.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.checkPass = this.checkPass.bind(this);
  }
  componentWillMount() {
    this.fetchData();
  }
  async fetchData () {
    this.truePass = await AsyncStorage.getItem(Globals.StorageNames.pass);
  }
  pinInput(input) {
    if(input === '-')
    {
      this.setState({hiddenPass: this.state.hiddenPass.substring(0, this.state.hiddenPass.length-2)});
      this.pass = this.pass.substring(0, this.pass.length-1);
      return;
    }
    this.setState({hiddenPass: this.state.hiddenPass.length > 0 ? this.state.hiddenPass + ' *' : '*'});
    this.pass = this.pass+input;
  }
  checkPass()
  {
    if(this.pass === this.truePass)
    {
      this.props.unlock();
      return;
    }
    Vibration.vibrate(1000);
  }
  render() {
    return(
      <View style={[styles.lockScreen, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.primaryColour}
        />
        <View style={styles.enterPassTitle}>
          <Text style={[styles.enterPassTitleText,{color: Globals.DefaultSettings.theme.textColour}]}>Enter Password</Text>
        </View>
        <View style={styles.numpadOutter}>
          <View style={styles.numpadDisplayOutter}>
            <Text style={[styles.numpadDisplay, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.hiddenPass}</Text>
          </View>
          <View style={styles.numpadRow}>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('1')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>1</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('2')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>2</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('3')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>3</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.numpadRow}>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('4')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>4</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('5')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>5</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('6')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>6</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.numpadRow}>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('7')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>7</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('8')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>8</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('9')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>9</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <View style={styles.numpadRow}>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.checkPass()}
              >
                <View style={styles.numpadItemOutter}>
                  <Image source={require('./assets/okIcon.png')} style={[styles.numpadOkIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('0')}
              >
                <View style={styles.numpadItemOutter}>
                  <Text style={[styles.numpadItemText,{color: Globals.DefaultSettings.theme.textColour}]}>0</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.numpadRowItemOutter}>
              <TouchableNativeFeedback
                onPress={() => this.pinInput('-')}
              >
                <View style={styles.numpadItemOutter}>
                  <Image source={require('./assets/numpadDeleteIcon.png')} style={[styles.numpadDeleteIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      locked: true,
    };
    this.unlock = this.unlock.bind(this);
  }
  componentWillMount() {
    this.retrieveSettings();
  }
  async retrieveSettings() {
    try{
      let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
      if(savedSettings)
        Globals.UpdateSettings(JSON.parse(savedSettings));
      if(!(Globals.DefaultSettings.walletLock))
      {
        this.setState({locked: false});
      }
      this.setState({loading: false});
    }
    catch(error){
      console.log(error)
    }
  }
  unlock() {
    this.setState({locked: false});
  }
  render() {
    if(this.state.loading){
      return(
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }
    if(this.state.locked)
    {
      return(
        <LockScreen unlock={() => this.unlock()}/>
      );
    }
    return (
      <RootStack style={{backgroundColor: Globals.DefaultSettings.theme.darkColour}} />
    );
  }
}

const styles = StyleSheet.create({
  loadingScreen:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    fontSize: 20,
    color: 'white',
  },
  menuText: {
    fontSize: 20,
  },
  drawerHeader: {
    flex:1, 
    height: 160,
  },
  drawerItem: {
    flex: 1, 
    padding: 15, 
  },
  menuIcon: {
    height:35, 
    width:35,
  },
  menuTextOutter: {
    marginLeft: 30, 
    justifyContent: 'center'
  },
  numpadItemOutter: {flex: 1, paddingTop: 30, paddingBottom: 30, alignItems: 'center', justifyContent: 'center',},
  numpadItemText: {fontSize: 20,},
  numpadRowItemOutter: {flex: 0.33,},
  numpadRow: {flexDirection: 'row',},
  numpadOutter: {margin: 30,marginTop: 5,},
  lockScreen: {flex: 1, justifyContent: 'center',},
  enterPassTitle: {margin: 10, alignItems: 'center',},
  enterPassTitleText: {fontSize: 25,},
  numpadDeleteIcon: {
    height: 20,
    width: 20*2.09,
  },
  numpadOkIcon: {
    height: 30,
    width: 30,
  },
  numpadDisplayOutter: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadDisplay: {
    fontSize: 20,
  },
});