import React, { Component } from 'react';
import { 
  StackNavigator,
} from 'react-navigation';

import HomeScreen from './js/Home';

//Navigator for pages
const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
  },
  {
    //headerMode: 'none',
    //transitionConfig: getSlideFromRightTransition,//Right to left transition
    initialRouteName: 'Home',//Initial page
  }
);

export default class App extends Component<Props> {
  render() {
    return (
      <RootStack />
    );
  }
}

