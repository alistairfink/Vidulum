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
  TextInput,
  Keyboard,
  Alert,
  AsyncStorage,
  FlatList,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';
import { Dropdown } from 'react-native-material-dropdown';
const win = Dimensions.get('window');

var walletListData = [
  {value:'Bitcoin'},
  {value:'Ethereum'},
];

class Add extends React.Component {
  constructor(props){
    super(props);
    this.saveFunc = this.saveFunc.bind(this);
    this.state = {
      wallet: { 
        name: '',
        description: '',
        coin: '',
        address: '',
      },
      keyboardHeight: 0,
    };
    this.mainScroll = null;
    this.addressInput = null;
    this.userFriendlyNames = {
      name: 'Wallet Name',
      description: 'Wallet Descritpion',
      coin: 'Cryptocurrency',
      address: 'Wallet Address',
    };
    this.addedWallets = [];
  }
  componentWillMount() {
    this.animateValue = new Animated.Value(0);
    this.getWallets();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }  
  componentDidMount() {
    Animated.timing(               
      this.animateValue,           
      {
        toValue: win.height-StatusBar.currentHeight,                  
        duration: 800,
        easing: Easing.bounce,             
      }
    ).start();
  }   
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  async getWallets() {
    let savedWallets = null;
    try{
      savedWallets = await AsyncStorage.getItem(Globals.StorageNames.wallets);
    }
    catch(error)
    {
      console.log(error);
    }
    if(savedWallets)
    {
      this.addedWallets = JSON.parse(savedWallets);
    }
  }
  async saveFunc() {
    for(let item in this.state.wallet)
    {
      if(!(this.state.wallet)[item])
      {
        Alert.alert(
          'Error',
          (this.userFriendlyNames)[item]+' Must Have a Value', 
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
    }
    for(let i = 0; i < this.addedWallets.length; i++)
    {
      if(this.addedWallets[i].address === this.state.wallet.address)
      {
        Alert.alert(
          'Error',
          'Wallet already added.', 
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        return;
      }
    }
    let valid = false;
    try{
      await fetch('http://memes.alistairfink.com/VidulumApi/validate',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coin: this.state.wallet.coin,
          address: this.state.wallet.address
        })
      })
      .then((response) => response.json()) 
      .then((responseJson) => {
        valid = responseJson.valid;
      })
    }
    catch(error)
    {
      console.log(error);
    }
    if(!valid)
    {
        Alert.alert(
          'Error',
          'Inputted address is not a valid '+ this.state.wallet.coin+ ' address.', 
        [
          {text: 'OK'},
        ]);
        return;
    }
    try{
      this.addedWallets.push(this.state.wallet);
      await AsyncStorage.setItem(Globals.StorageNames.wallets, JSON.stringify(this.addedWallets));
    }
    catch(error)
    {
      console.log(error);
    }
    this.props.handler();
  }
  _keyboardDidShow (e) {
    let height = e.endCoordinates.height; 
    this.setState({keyboardHeight: height});
    if(this.addressInput.isFocused()){
      setTimeout(() => {
        this.mainScroll.scrollTo({ y: height });
      }, 1)
    }
  }
  _keyboardDidHide () {
    this.setState({keyboardHeight: 0});
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
                <Image source={require('../assets/cancelIcon.png')} style={[CommonStylesheet.leftIcon, 
                  {tintColor: Globals.DefaultSettings.theme.textColour}]}
                />
              </TouchableOpacity>
              <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Add Wallet</Text>
            </View>
            <ScrollView
              ref={scrollView => this.mainScroll = scrollView}
            >
              <View style={[CommonStylesheet.textBlockBackground, {borderBottomColor: Globals.DefaultSettings.theme.lightColour}]}>
                <Text style={[CommonStylesheet.titleText, {color: Globals.DefaultSettings.theme.textColour}]}>Wallet Information</Text>
                <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>
                  Information about the wallet you are adding. This information is not used and is purely for yourself.
                </Text>
              </View>
              <View style={[CommonStylesheet.controlBackground, {marginTop: 15}]}>
                <View style={CommonStylesheet.controlInner}>
                  <TextInput
                    placeholder={'Input Wallet Name'}
                    placeholderTextColor={'#a0a0a0'}
                    value={this.state.wallet.name}
                    onChangeText={(value) =>{this.setState({
                      wallet: {
                        name: value,
                        description: this.state.wallet.description,
                        coin: this.state.wallet.coin, 
                        address: this.state.wallet.address,
                      }
                    })}}
                  />
                </View>
              </View>
              <View style={[CommonStylesheet.controlBackground, {marginTop: 15}]}>
                <View style={CommonStylesheet.controlInner}>
                  <TextInput
                    placeholder={'Input Wallet Description'}
                    placeholderTextColor={'#a0a0a0'}
                    value={this.state.wallet.description}
                    onChangeText={(value) =>{this.setState({
                      wallet: {
                        name: this.state.wallet.name,
                        description: value,
                        coin: this.state.wallet.coin, 
                        address: this.state.wallet.address,
                      }
                    })}}
                  />
                </View>
              </View>
              <View style={[CommonStylesheet.textBlockBackground, {borderBottomColor: Globals.DefaultSettings.theme.lightColour}]}>
                <Text style={[CommonStylesheet.titleText, {color: Globals.DefaultSettings.theme.textColour}]}>Wallet Data</Text>
                <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>
                  Data for the wallet that you are adding. This information will be used to retrieve balances and other data.
                </Text>
              </View>
              <View style={[CommonStylesheet.controlBackground, {marginTop: 15}]}>
                <View style={CommonStylesheet.controlInner}>
                  <Dropdown
                    label='Cryptocurrency'
                    data={walletListData}
                    onChangeText={(text) => {this.setState({wallet: {
                        name: this.state.wallet.name,
                        description: this.state.wallet.description,
                        coin: text, 
                        address: this.state.wallet.address,
                      }
                    })}}
                  />
                </View>
              </View>
              <View style={[CommonStylesheet.controlBackground, {marginTop: 15}]}>
                <View style={CommonStylesheet.controlInner}>
                  <TextInput
                    placeholder={'Input Wallet Address'}
                    placeholderTextColor={'#a0a0a0'}
                    value={this.state.wallet.address}
                    ref={textInput => this.addressInput = textInput}
                    onChangeText={(value) =>{this.setState({wallet: {
                        name: this.state.wallet.name,
                        description: this.state.wallet.description,
                        coin: this.state.wallet.coin, 
                        address: value,
                      }
                    })}}
                  />
                </View>
              </View>
              <View style={{height: this.state.keyboardHeight}}></View>
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
      wallets: null,
    };
    this.getWallets = this.getWallets.bind(this);
  }
  backHandle(){
    this.getWallets();
    this.setState({adding: false});
  }
  componentWillMount() {
    this.getWallets();
  }
  async getWallets() {
    let savedWallets = null;
    try{
      savedWallets = await AsyncStorage.getItem(Globals.StorageNames.wallets);
    }
    catch(error)
    {
      console.log(error);
    }
    if(savedWallets)
    {
      this.state.wallets = JSON.parse(savedWallets);
    }
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