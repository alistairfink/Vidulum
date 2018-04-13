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
  NetInfo,
  ToastAndroid,
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
      walletData: null,
      forceRefresh: false,
    };
    this.getWallets = this.getWallets.bind(this);
    this.getEthObj = this.getEthObj.bind(this);
    this.getBitcoinObj = this.getBitcoinObj(this);
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
      if(savedWallets)
      {
        await this.setState({wallets: JSON.parse(savedWallets)});
        this.getData();
      }
    }
    catch(error)
    {
      console.log(error);
    }
  }
  async getData() {
    try{
      let savedWalletData = await AsyncStorage.getItem(Globals.StorageNames.walletData)
      savedWalletData = null;
      let walletList = this.state.wallets;
      let curDate = parseInt(new Date().getTime()/1000);
      savedWalletData = JSON.stringify([{updateTime: 123},{updateTime: 456}]);

      let test = await this.getEthObj(walletList[1], curDate);
      alert(JSON.stringify(test));
      return;
      /*if(savedWalletData)
      {
        savedWalletData = JSON.parse(savedWalletData);
        NetInfo.isConnected.fetch().then(isConnected => {
          if(!isConnected)
          {
            this.setState({walletData: savedWalletData});
            ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            return;
          }
        })
        let updateDate = savedWalletData[1].updateTime;
        if(curDate-updateDate < 300 && !(this.state.forceRefresh))
        {
          this.setState({walletData: savedWalletData});
          ToastAndroid.show('Already Up To Date', ToastAndroid.SHORT);
          return; 
        }
      }*/
      savedWalletData = [];
      for(let i = 0; i < walletList.length; i++)
      {
        let itemObj = null;
        switch (walletList[i].coin.toLowerCase()) {
          case 'ethereum':
            itemObj = await this.getEthObj(walletList[i], curDate);
            break;
          case 'bitcoin':
            itemObj = await this.getBitcoinObj(walletList[i], curDate);
            break;
          default:
            itemObj = {
              val: 0,
              symbol: 0,
              fiatVal: 0,
              txCount: 0, 
              totalIn: 0,
              totalOut: 0,
              tokens: 0,
              updateTime: 0
            };
        }
        savedWalletData.push(itemObj);
      }
      this.setState({walletData: savedWalletData});
      AsyncStorage.setItem(Globals.StorageNames.walletData, JSON.stringify(savedWalletData));
    }
    catch(error)
    {

    }
  }
  async getEthObj(obj, curDate) {
    try{
      let responseObj = null; //Response from Ethplorer
      let fiatObj = null; //Response from CoinMarketCap
      let fiatRatio = null; //Ratio from usd to user selected fiat
      let tokens = null; //Token Object. Made from data from Ethplorer.
      let returnObj = null; //Object to Return
      //Does both api calls asynchronously and awaits(faster than doing one after the other)
      [responseObj, fiatObj] = await Promise.all([
        fetch('http://memes.alistairfink.com/VidulumApi/ethplorer',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passThrough: 'getAddressInfo/' + obj.address
          })
        })
        .then((response) => response.json()),
        fetch('https://api.coinmarketcap.com/v1/ticker/Ethereum?convert='+Globals.DefaultSettings.currency,{
          method: 'GET'
        })
        .then((response) => response.json()) 
      ]);
      //fiatObj is originally returned as an array (annoying)
      fiatObj = fiatObj[0];
      //This is for if the user has a different fiat selected since ethplorer only returns usd
      fiatRatio = (fiatObj)['price_'+Globals.DefaultSettings.currency.toLowerCase()]/fiatObj.price_usd;
      //Extracts only wanted info from giant token array
      if(responseObj.tokens){
        tokens = [];
        for(let j = 0; j < responseObj.tokens.length; j++)
        {
          let priceInfo = responseObj.tokens[j].tokenInfo.price ? fiatRatio*responseObj.tokens[j].tokenInfo.price.rate : false;
          let tempObj = {
            name: responseObj.tokens[j].tokenInfo.name,
            decimals: responseObj.tokens[j].tokenInfo.deicmals,
            symbol: responseObj.tokens[j].tokenInfo.symbol,
            fiatVal: priceInfo,
            val: responseObj.tokens[j].balance
          };
          tokens.push(tempObj);
        }
      }
      //Build object to return from api information
      returnObj = {
        val: responseObj.ETH.balance,
        symbol: "ETH",
        fiatRate: (fiatObj)['price_'+Globals.DefaultSettings.currency.toLowerCase()],
        txCount: responseObj.countTxs, 
        totalIn: responseObj.ETH.totalIn,
        totalOut: responseObj.ETH.totalOut,
        tokens: tokens,
        updateTime: curDate
      };
      return returnObj;
    }
    catch(error) {
      console.log(error);
    }
  }
  async getBitcoinObj() {

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
          {this.state.walletData &&
            <FlatList
              data={this.state.wallets}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={[styles.walletCard, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                  <View style={[styles.walletCardTop, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                    <View>
                      <Text style={[styles.walletCardTitleText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.name}</Text>
                      <Text style={[styles.walletCardText, styles.walletCardAddress, CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.address}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <TouchableOpacity onPress={() => {
                          
                        }}
                      >
                        <Image source={require('../assets/cancelIcon.png')} style={[styles.xIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.walletCardMiddle]}>
                    <Text style={[styles.walletCardText, CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.description}</Text>
                  </View>
                  <View style={[styles.walletCardBottom, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                    <Text style={[styles.walletCardText, CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.address}</Text>
                  </View>
                </View>
              )}
            />
          }
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
  walletCard: {
    marginRight: 15,
    marginLeft: 15,
    marginTop: 15,
    borderRadius: 5,
  },
  walletCardTop: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 0,
    paddingRight: 0,
    flexDirection: 'row', 
  },
  walletCardTitleText: {
    fontSize: 20,
  },
  walletCardText: {

  },
  walletCardMiddle: {
    padding: 10,
  },
  walletCardBottom: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10,
    paddingTop: 0,
    paddingBottom: 0,
  },
  xIcon: {
    height: 17,
    width: 17,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;