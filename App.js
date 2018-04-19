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
      },
      {
        displayText: 'Settings',
        name: 'Settings',
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
        <View style={styles.drawerHeader}>

        </View>
        {this.menuItems.map((item, index) => (
          <View key={index} style={{}}>
            <TouchableOpacity
              onPress={this.navigateToScreen(item.name)}
              style={styles.drawerItem}
            > 
              <Text style={[styles.menuText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.displayText}</Text>
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
  menuText: {
    fontSize: 20,
  },
  drawerHeader: {
    flex:1, 
    height: 150, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(0,0,0,0.3)'
  },
  drawerItem: {
    flex: 1, 
    padding: 15, 
    borderBottomColor: 'rgba(0,0,0,0.3)', 
    borderBottomWidth: 1
  },
});