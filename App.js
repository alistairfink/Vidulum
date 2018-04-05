import React, { Component } from 'react';
import { 
  DrawerNavigator,
} from 'react-navigation';
import { 
  Text,
  AsyncStorage,
  View,
  StyleSheet,
} from 'react-native';

import HomeScreen from './js/Home';
import Settings from './js/Settings';

import Globals from './js/Globals';

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
    drawerBackgroundColor: '#8c8c8c',
    contentOptions: {
      activeTintColor: 'white',
      activeBackgroundColor: '#515151',
      inactiveTintColor: 'white',
    }
  }
);

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
    };
    this.refresh = this.refresh.bind(this);
  }
  componentDidMount() {
    this.retrieveSettings();
  }
  async retrieveSettings() {
    try{
      let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
      if(savedSettings)
        Globals.UpdateSettings(JSON.parse(savedSettings));
      this.setState({loading: false});
    }
    catch(error){
      console.log(error)
    }
  }
  refresh(){
    this.forceUpdate();
  }
  render() {
    if(this.state.loading){
      return(
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
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
});