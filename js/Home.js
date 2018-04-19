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
  Clipboard,
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
    this.hitButton = false;
  }
  componentWillMount() {
    //Starts animation
    this.animateValue = new Animated.Value(win.width);
    this.getWallets();
    //Keyboard listening for moving screen up and down when keyboard pops up
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }  
  componentDidMount() {
    Animated.timing(               
      this.animateValue,           
      {
        toValue: 0,//win.height-StatusBar.currentHeight,                  
        duration: 250,
        easing: Easing.bounce,             
      }
    ).start();
  }   
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  async getWallets() {
    //Gets wallets from local
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
    if(this.hitButton) return;
    this.hitButton = true;
    //Checks all fields are filled out
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
        this.hitButton = false;
        return;
      }
    }
    //Checks wallet isn't already added
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
        this.hitButton = false;
        return;
      }
    }
    let valid = false;
    //Validates address
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
        this.hitButton = false;
        return;
    }
    try{
      //If wallet passes all the cheks then adds and goes back
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
    //Adds height to bottom of scrollview and scrolls down on that height so the keyboard isn't in the way
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
                        address: value.trim(),
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
      refreshing: null,
    };
    this.getWallets = this.getWallets.bind(this);
    this.getEthObj = this.getEthObj.bind(this);
    this.getBitcoinObj = this.getBitcoinObj.bind(this);
    this.cardRefresh = this.cardRefresh.bind(this);
    this.firstLoad = this.firstLoad.bind(this);
    this.writeToClipBoard = this.writeToClipBoard.bind(this);
    this.alternatingColour = this.alternatingColour.bind(this);
    this.backHandle = this.backHandle.bind(this);
  }
  async backHandle(){
    this.setState({adding: false});
    let savedWallets = await AsyncStorage.getItem(Globals.StorageNames.wallets);
    savedWallets = savedWallets ? JSON.parse(savedWallets) : null;
    if(savedWallets)
    {
      if(savedWallets.length === this.state.wallets.length)
      {
        this.setState({refreshing: false});
      }
      else
      {
        this.setState({forceRefresh: true, refreshing: true, wallets: null, walletData: null});
      }
    }
    //Refreshes after adding card. 
    this.getWallets();    
  }
  componentWillMount() {
    this.firstLoad();
  }
  async firstLoad() {
    //Checks if user has refresh on open selected or if they're just coming back to the componet from a different menu.
    //Handles based on that.
    if(Globals.DefaultSettings.reloadOnOpen && Globals.openingRefresh)
      this.setState({forceRefresh: true, refreshing: true});
    else if((!(Globals.DefaultSettings.reloadOnOpen) && Globals.openingRefresh) || !(Globals.openingRefresh))
      this.setState({refreshing: false});
    Globals.UpdateOpeningRefresh();
    await this.getWallets();
  }
  async getWallets() {
    //Gets the wallets then calls getData() to get each wallets data.
    let savedWallets = null;
    try{
      savedWallets = await AsyncStorage.getItem(Globals.StorageNames.wallets);
      if(savedWallets)
      {
        this.setState({wallets: JSON.parse(savedWallets)});
        this.getData();
      }
    }
    catch(error)
    {
      console.log(error);
    }
  }
  async getData() {
    /*
    This function was kinda confusing to write (haha maybe I'm tired) so heres the step by step:
     - All scenarios, assuming there is something stored in local, it will check internet connection.
     - After that it will check the following two scenarios:
        - Outdated and not for refreshing. This happens when the user is manually refreshing. We do not want force refresh for this.
        - The refreshing state is false. This state is true for every scenario except for the user opening the app and having the
          reload on open setting set to false OR when the user is navigating back from a different compoenent. The messages
          are also suppressed in this fashion.
     - If the function is not returned by this point then it is safe to assume that force refresh is on or the data is outdated.
     - The function will then retrieve all the data and set force refresh and refreshing to false.
    */
    try{
      //Retrieves data from local storage
      let savedWalletData = await AsyncStorage.getItem(Globals.StorageNames.walletData);
      let walletList = this.state.wallets;
      let curDate = parseInt(new Date().getTime()/1000);
      if(savedWalletData)
      {
        savedWalletData = JSON.parse(savedWalletData);
        //If theres no internet but theres data
        NetInfo.isConnected.fetch().then(isConnected => {
          if(!isConnected)
          {
            this.setState({walletData: savedWalletData});
            if(this.state.refreshing)
              ToastAndroid.show('No Internet', ToastAndroid.SHORT);
            this.setState({refreshing: true});
            this.setState({refreshing: false});
            return;
          }
        })
        let updateDate = savedWalletData[0].updateTime;
        //Checks if data is outdated or if user is navigating back from different component
        if((curDate-updateDate < 300 && !(this.state.forceRefresh)) || 
          !(this.state.refreshing))
        {
          this.setState({walletData: savedWalletData});
          if(this.state.refreshing)
            ToastAndroid.show('Already Up To Date', ToastAndroid.SHORT);
          this.setState({refreshing: true});
          this.setState({refreshing: false});
          return; 
        }
      }
      savedWalletData = [];
      //Retrieves data for each wallet.
      //Consider refactoring to make retrieval of each wallet parallel.
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
      //Saves data and updates view
      this.setState({walletData: savedWalletData});
      ToastAndroid.show('Updated', ToastAndroid.SHORT);
      await AsyncStorage.setItem(Globals.StorageNames.walletData, JSON.stringify(savedWalletData));
      this.setState({refreshing: false, forceRefresh: false});
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
            decimals: responseObj.tokens[j].tokenInfo.decimals,
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
  async getBitcoinObj(obj, curDate) {
    try{
      let responseObj = null; //Response from Ethplorer
      let fiatObj = null; //Response from CoinMarketCap
      let fiatRatio = null; //Ratio from usd to user selected fiat
      let tokens = null; //Token Object. Made from data from Ethplorer.
      let returnObj = null; //Object to Return
      //Does both api calls asynchronously and awaits(faster than doing one after the other)
      [responseObj, fiatObj] = await Promise.all([
        fetch('https://blockexplorer.com/api/addr/'+obj.address,{
          method: 'GET'
        })
        .then((response) => response.json()),
        fetch('https://api.coinmarketcap.com/v1/ticker/Bitcoin?convert='+Globals.DefaultSettings.currency,{
          method: 'GET'
        })
        .then((response) => response.json()) 
      ]);
      //fiatObj is originally returned as an array (annoying)
      fiatObj = fiatObj[0];
      //Build object to return from api information
      returnObj = {
        val: responseObj.balance,
        symbol: "BTC",
        fiatRate: (fiatObj)['price_'+Globals.DefaultSettings.currency.toLowerCase()],
        txCount: responseObj.txApperances, 
        totalIn: responseObj.totalReceived,
        totalOut: responseObj.totalSent,
        tokens: null, //No token data for bitcoin
        updateTime: curDate
      };
      return returnObj;
    }
    catch(error) {
      console.log(error);
    }
  }
  cardRefresh() {
    //Manually refreshing.
    this.setState({refreshing: true});
    this.getWallets();
  }
  async writeToClipBoard(addr) {
    await Clipboard.setString(addr);
  }
  alternatingColour(tokenI, walletDataI) {
    let c = null;
    let bRadius = 0;
    c = tokenI%2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.3)';
    if(tokenI === this.state.walletData[walletDataI].tokens.length-1)
    {
      bRadius = 5;
    }
    return {
      backgroundColor: c,
      borderBottomLeftRadius: bRadius,
      borderBottomRightRadius: bRadius,
    };
  }
  render() {
    if(this.state.adding)
    {
      return (
        <Add handler={this.backHandle}/>
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
                onPress={() => {this.cardRefresh()}}
              >
                <Image source={require('../assets/refreshIcon.png')} style={[CommonStylesheet.rightIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.wallets &&
            <FlatList
              data={this.state.wallets}
              keyExtractor={(x, i) => i.toString()}
              refreshing={this.state.refreshing}
              onRefresh={this.cardRefresh}
              renderItem={({ item, index }) => {
                if(this.state.walletData)
                  return (
                    <View style={[styles.walletCard, {backgroundColor: Globals.DefaultSettings.theme.lightColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour,}]}>
                      <View style={[styles.walletCardTop, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                        <View>
                          {
                            (item.coin.toLowerCase() === 'bitcoin') ? (
                              <Image style={styles.logoImage} source={require('../assets/coins/bitcoin.png')}/>
                            ):
                            (
                              <Image style={styles.logoImage} source={require('../assets/coins/ethereum.png')}/>
                            )
                          }
                        </View>
                        <View>
                          <Text style={[styles.walletCardTitleText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.name}</Text>
                        </View>
                        <View style={styles.xIconOuter}>
                          <TouchableOpacity onPress={() => {
                              
                            }}
                          >
                            <Image source={require('../assets/cancelIcon.png')} style={[styles.xIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={[styles.walletCardMiddle]}>
                        <View style={styles.descriptionOuter}>
                          <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.description}</Text>
                        </View>
                        <View style={styles.balanceHeader}>
                          <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Balance</Text>
                        </View>
                        <View style={styles.balanceContent}>
                          <View style={{flex: 0.425}}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData[index].val} {this.state.walletData[index].symbol}</Text>
                          </View>
                          <View style={styles.balanceIcon}>
                              <Image style={{tintColor: Globals.DefaultSettings.theme.textColour, width: 30, height: 8.38}} source={require('../assets/convertIcon.png')}/>
                          </View>
                          <View style={{flex: 0.425, alignItems: 'flex-end'}}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{Globals.DefaultSettings.symbol} {(this.state.walletData[index].val*this.state.walletData[index].fiatRate).toFixed(2)} {Globals.DefaultSettings.currency}</Text>
                          </View>
                        </View>
                        <View>
                          <View style={{flexDirection: 'row' }}>
                            <View style={styles.InOutOutter}>
                              <View style={styles.InOutHeader}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>Total In ({this.state.walletData[index].symbol})</Text>
                              </View>
                              <View style={styles.InOutContent}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData[index].totalIn}</Text>
                              </View>
                            </View>
                            <View style={{flex: 0.05}}>
                            </View>
                            <View style={styles.InOutOutter}>
                              <View style={styles.InOutHeader}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>Total Out ({this.state.walletData[index].symbol})</Text>
                              </View>
                              <View style={styles.InOutContent}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData[index].totalOut}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <View style={styles.transactionCountBox}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData[index].txCount} Total Transactions</Text>
                          </View>
                        </View>
                        {this.state.walletData[index].tokens &&
                          <View>
                            <View style={styles.tokenListHeader}>
                              <View style={{flex: 0.33}}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Token Name</Text>
                              </View>
                              <View style={{flex: 0.33, alignItems: 'center'}}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Balance</Text>
                              </View>
                              <View style={{flex: 0.33, alignItems: 'flex-end'}}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Balance ({Globals.DefaultSettings.currency})</Text>
                              </View>
                            </View>
                            {this.state.walletData[index].tokens.map((token, i) => (
                              <View key={i} style={[styles.tokeItem, this.alternatingColour(i, index)]}>
                                <View style={{flex: 0.33}}>
                                  <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{token.name}</Text>
                                </View>
                                <View style={{flex: 0.33, alignItems: 'center'}}>
                                  <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour, textAlign: 'center'}]}>{parseFloat((token.val/(Math.pow(10,token.decimals))).toFixed(token.decimals))} {token.symbol}</Text>
                                </View>
                                <View style={{flex: 0.33, alignItems: 'flex-end'}}>
                                  {
                                    (token.fiatVal) ? (
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{Globals.DefaultSettings.symbol} {(parseFloat((token.val/(Math.pow(10,token.decimals))))*token.fiatVal).toFixed(2)}</Text>
                                    ) : (
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>N/A</Text>
                                    )
                                  }
                                </View>
                              </View>
                            ))}
                          </View>
                        }
                      </View>
                      <View style={[styles.walletCardBottom, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                        <Text style={[styles.walletCardText, CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{item.address}</Text>
                        <View style={{flexDirection: 'row'}}>
                          <View style={{flex: 0.6, justifyContent: 'flex-end'}}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>Last Updated: {(new Date(this.state.walletData[index].updateTime*1000)).toLocaleDateString()} {(new Date(this.state.walletData[index].updateTime*1000)).toLocaleTimeString()}</Text>
                          </View>
                          <View style={{flex: 0.4, alignItems: 'flex-end',}}>
                            <TouchableOpacity 
                              onPress={() => this.writeToClipBoard(item.address)}
                            >
                              <View style={{backgroundColor: Globals.DefaultSettings.theme.lightColour, borderRadius: 5, marginTop: 5, padding: 5,}}>
                                <Text style={[styles.walletCardText, CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour, textAlign: 'center', marginRight: 10, marginLeft: 10, }]}>Copy Address</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
              }}
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
    margin: 15,
    marginTop: 10,
    marginBottom: 10,
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
    marginBottom: 0,
  },
  walletCardMiddle: {
    padding: 10,
  },
  walletCardBottom: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10,
  },
  xIcon: {
    height: 17,
    width: 17,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  logoImage: {
    width: 25,
    height: 25,
    marginRight: 8, 
    marginTop: 1,
  },
  xIconOuter: {
    flex: 1, 
    alignItems: 'flex-end',
  },
  walletCardTextTitle: {
    marginTop: 5,
    fontSize: 16,
    textDecorationLine: 'underline',  
  },
  tokenListHeader: {
    flexDirection: 'row', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    paddingLeft: 5, 
    paddingRight: 5, 
    paddingBottom: 5,
    marginTop: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tokeItem: { 
    flexDirection: 'row', 
    paddingLeft: 5, 
    paddingRight: 5, 
    paddingTop: 5,
    paddingBottom: 5,
  },
  transactionCountBox: {
    flex:1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    alignItems: 'center',
    borderRadius: 5,
  },
  InOutOutter: {
    flex: 0.475, 
    marginBottom: 5,
  },
  InOutHeader: {
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderTopLeftRadius: 5, 
    borderTopRightRadius: 5, 
    padding: 3,
  },
  InOutContent: {
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderBottomLeftRadius: 5, 
    borderBottomRightRadius: 5, 
    padding: 3,
  },
  balanceHeader: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 5, 
    borderTopRightRadius: 5, 
    borderTopLeftRadius: 5,
  },
  balanceContent: {
    flexDirection: 'row', 
    marginBottom: 5, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    padding: 5,
  },
  balanceIcon: {
    flex: 0.15, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  descriptionOuter: {
    backgroundColor: 'rgba(0,0,0,0.2)', 
    padding: 5, 
    marginBottom: 10, 
    borderRadius: 5,
  },
});

export default HomeScreen;