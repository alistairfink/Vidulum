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
  Clipboard,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';

const win = Dimensions.get('window');

class WalletInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      walletData: null,
      transactionsLoaded: false,
      transactionsShow: null,
      numTransactions: 5,
      showToken: false,
    }
    this.allTransactions = null;
    this.getEth = this.getEth.bind(this);
    this.getBtc = this.getBtc.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.alternatingColour = this.alternatingColour.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.arrowTint = this.arrowTint.bind(this);
  }
  componentWillMount() {
    //Starts animation
    this.animateValue = new Animated.Value(win.width);
    this.onLoad();
  } 
  componentDidMount() {
    //Open animation These animations are the same as all the other pages.
    Animated.timing(               
      this.animateValue,           
      {
        toValue: 0,//win.height-StatusBar.currentHeight,                  
        duration: 100,           
      }
    ).start();
  }  
  exit() {
    //Exit animation
    Animated.timing(
      this.animateValue,
      {
        toValue: win.width,
        duration: 100,
      }
    ).start();
    setTimeout(() => this.props.handler(), 100);
  }
  onLoad() {
    //when this page loads in it checks if there is a data object and if there is it sets the walletdata state which will cause a rerender then it will fetch the transactions.
    let walletI = this.props.wallet;
    if(this.props.walletData)
    {
      this.setState({walletData: this.props.walletData});
    }
    switch(walletI.coin.toLowerCase()) {
      case 'bitcoin':
        this.getBtc(walletI);
        break;
      default://Ethereum
        this.getEth(walletI);
    }
  }
  async getEth(walletI) {
    let transactionInfo = null;
    //Gets address info and transaction info then sets in state.
    if(!(this.props.walletData))
    {//This should only happen when searching an address.
      let curDate = parseInt(new Date().getTime()/1000);
      let addrInfo = null;
      let fiatObj = null;
      [addrInfo, transactionInfo, fiatObj] = await Promise.all([
        fetch(Globals.ApiEndPoints.ethplorer,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passThrough: 'getAddressInfo/' + walletI.address
          })
        })
        .then((response) => response.json()),
        fetch(Globals.ApiEndPoints.ethplorer,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passThrough: 'getAddressTransactions/' + walletI.address,
            options: 'limit=50'
          })
        })
        .then((response) => response.json()),
        fetch(Globals.ApiEndPoints.coinMarketCap + 'Ethereum?convert='+ Globals.DefaultSettings.currency,{
          method: 'GET'
        })
        .then((response) => response.json()) 
      ]);
      //fiatObj is originally returned as an array (annoying)
      fiatObj = fiatObj[0];
      //This is for if the user has a different fiat selected since ethplorer only returns usd
      fiatRatio = (fiatObj)['price_'+Globals.DefaultSettings.currency.toLowerCase()]/fiatObj.price_usd;
      //Extracts only wanted info from giant token array
      if(addrInfo.tokens){
        tokens = [];
        for(let j = 0; j < addrInfo.tokens.length; j++)
        {
          let priceInfo = addrInfo.tokens[j].tokenInfo.price ? fiatRatio*addrInfo.tokens[j].tokenInfo.price.rate : false;
          let tempObj = {
            name: addrInfo.tokens[j].tokenInfo.name,
            decimals: addrInfo.tokens[j].tokenInfo.decimals,
            symbol: addrInfo.tokens[j].tokenInfo.symbol,
            fiatVal: priceInfo,
            val: addrInfo.tokens[j].balance,
            totalIn: addrInfo.tokens[j].totalIn,
            totalOut: addrInfo.tokens[j].totalOut,
            address: addrInfo.tokens[j].tokenInfo.address,
          };
          tokens.push(tempObj);
        }
      }
      //Build object to return from api information
      returnObj = {
        val: addrInfo.ETH.balance,
        symbol: "ETH",
        fiatRate: (fiatObj)['price_'+Globals.DefaultSettings.currency.toLowerCase()],
        txCount: addrInfo.countTxs, 
        totalIn: addrInfo.ETH.totalIn,
        totalOut: addrInfo.ETH.totalOut,
        tokens: tokens,
        updateTime: curDate
      };
      this.setState({walletData: returnObj});
    }
    else 
    {//Happens when we already have data(from home screen). Only need to get 
      transactionInfo = await fetch(Globals.ApiEndPoints.ethplorer,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passThrough: 'getAddressTransactions/' + walletI.address,
            options: 'limit=50'
          })
        })
        .then((response) => response.json())
    }
    let _transactionInfo = [];
    for(let i = 0; i<transactionInfo.length; i++)
    {//Goes through all the transactions and sorts them. Array stuff and out is mostly so i can use the same render code for both bitcoin and ethereum.
      //This array functionality isnt rly used in ethereum so arrays here are of size 1
      let toArr = [];
      let fromArr = [];
      toArr.push(transactionInfo[i].to);
      fromArr.push(transactionInfo[i].from);
      let out = transactionInfo[i].to.toLowerCase().trim() === this.props.wallet.address.toLowerCase().trim() ? false : true;
      let tempObj = {
        timestamp: transactionInfo[i].timestamp,
        from: fromArr,
        to: toArr,
        transactionID: transactionInfo[i].hash,
        amount: transactionInfo[i].value,
        out: out, //Check Address for ether -> Check Out-In for BTC
      };
      _transactionInfo.push(tempObj);
    }
    this.allTransactions = _transactionInfo;
    this.setState({transactionsShow: this.allTransactions.slice(0, this.state.numTransactions), transactionsLoaded: true});
  }
  async getBtc(walletI) {
    let transactionInfo = null; //response from bitcoinchain
    if(!(this.props.walletData))
    {//Only happens when searching. same as above.
      let curDate = parseInt(new Date().getTime()/1000); //when getting data
      let responseObj = null; //Response from blockexplorer
      let fiatObj = null; //Response from CoinMarketCap
      let tokens = null; //Token Object. Made from data from Ethplorer.
      let returnObj = null; //Object to Return
      //Does both api calls asynchronously and awaits(faster than doing one after the other)
      [responseObj, fiatObj, transactionInfo] = await Promise.all([
        fetch(Globals.ApiEndPoints.blockExplorer+walletI.address,{
          method: 'GET'
        })
        .then((response) => response.json()),
        fetch(Globals.ApiEndPoints.coinMarketCap + 'Bitcoin?convert='+Globals.DefaultSettings.currency,{
          method: 'GET'
        })
        .then((response) => response.json()),
        fetch(Globals.ApiEndPoints.bitcoinChain + walletI.address + '?limit=50',{
          method: 'GET',
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
      this.setState({walletData: returnObj});    
    }
    else
    {//Same as above but for btc apis
      transactionInfo = await fetch(Globals.ApiEndPoints.bitcoinChain + walletI.address + '?limit=50',{
          method: 'GET',
        })
        .then((response) => response.json())
    }
    let _transactionInfo = [];
    transactionInfo = transactionInfo[0];
    for(let i = 0; i < transactionInfo.length; i++)
    {
      if(!(transactionInfo[i].tx)) continue;//If there are unconfirmed transactions we don't care about it and should continue to the next one.
      /*
        input = sender.
        output = receiver.
      */
      let toArr = [];
      let fromArr = [];
      let val = null;
      let out = null;
      //Goes through inputs and adds to array. Same for outputs.
      //If it finds address in one of these then thats the one we're looking for and we know its in/out and thats the transaction val.
      for(let j = 0; j < transactionInfo[i].tx.inputs.length; j++)
      {        if(transactionInfo[i].tx.inputs[j].sender.toLowerCase() === walletI.address.toLowerCase())
        {
          fromArr = [transactionInfo[i].tx.inputs[j].sender];
          val = transactionInfo[i].tx.inputs[j].value;
          out = true;
          break;
        }
        fromArr.push(transactionInfo[i].tx.inputs[j].sender);
      }
      for(let j = 0; j < transactionInfo[i].tx.outputs.length; j++)
      {
        if(transactionInfo[i].tx.outputs[j].receiver.toLowerCase() === walletI.address.toLowerCase())
        {
          toArr = [transactionInfo[i].tx.outputs[j].receiver];
          val = transactionInfo[i].tx.outputs[j].value;
          out = false;
          break;
        }
        toArr.push(transactionInfo[i].tx.outputs[j].receiver);
      }
      let tempObj = {
        timestamp: transactionInfo[i].tx.rec_time,
        from: fromArr,
        to: toArr,
        transactionID: transactionInfo[i].tx.blocks[0],
        amount: val,
        out: out, 
      };
      //For array of all transactions
      _transactionInfo.push(tempObj);
    }
    //Renders transactions after this.
    this.allTransactions = _transactionInfo;
    this.setState({transactionsShow: this.allTransactions.slice(0, this.state.numTransactions), transactionsLoaded: true});
  }
  alternatingColour(index) {
    //Same as home component
    let c = index%2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.3)';
    let bottom = 0;
    let top = 0;
    if(index === this.state.alternatingColour-1)
    {
      bottom = 5;
    }
    return {
      backgroundColor: c,
      borderBottomRightRadius: bottom,
      borderBottomLeftRadius: bottom,
    };
  }
  loadMore() {
    //Gets current number showing, adds 5, then updates states with proper amount of transactions and new transaction number
    let num = this.state.numTransactions + 5;
    this.setState({transactionsShow: this.allTransactions.slice(0, num), numTransactions: num});
  }
  arrowTint(out) {
    //Sees out var of current object and sets colour approriately. This is set when transaction data is loaded in.
    let colour = !out ? 'limegreen' : 'red';
    return {
      tintColor: colour
    };
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
                <Image source={require('../assets/backIcon.png')} style={[CommonStylesheet.leftIcon, 
                  {tintColor: Globals.DefaultSettings.theme.textColour}]}
                />
              </TouchableOpacity>
              <View style={{flex: 1, justifyContent: 'center', padding: 0,}}>
                <Text numberOfLines={1} style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour, alignSelf: 'flex-start'}]}>{this.props.wallet.name ? this.props.wallet.name : this.props.wallet.address}</Text>
              </View>
            </View>
            <ScrollView>
              {
                (this.state.walletData) ? (
                  <View>
                    <View style={styles.logoOutter}>
                      {
                        (this.props.wallet.coin.toLowerCase() === 'bitcoin') ? (
                          <Image style={styles.logoImage} source={require('../assets/coins/bitcoin.png')}/>
                        ):
                        (
                          <Image style={styles.logoImage} source={require('../assets/coins/ethereum.png')}/>
                        )
                      }
                    </View>
                    {this.props.wallet.description &&
                      <View style={[styles.head, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour,}]}> 
                        <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Description</Text>
                        <View style={[styles.headChild, {backgroundColor: Globals.DefaultSettings.theme.lightColour, padding: 10}]}>
                          <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.props.wallet.description}</Text>
                        </View>
                      </View>
                    }
                    <View style={[styles.head, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}> 
                      <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Address</Text>
                      <View style={[styles.headChild, {backgroundColor: Globals.DefaultSettings.theme.lightColour, padding: 10}]}>
                        <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.props.wallet.address}</Text>
                      <TouchableOpacity style={styles.loadMoreButton} onPress={async() => {
                        await Clipboard.setString(this.props.wallet.address);
                        ToastAndroid.show('Address Copied', ToastAndroid.SHORT);
                      }}>
                        <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Tap to Copy Address</Text>
                      </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.head, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour,}]}> 
                      <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Wallet Info</Text>
                      <View style={[styles.headChild, {backgroundColor: Globals.DefaultSettings.theme.lightColour, padding: 10}]}>
                        <View style={styles.balanceHeader}>
                          <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Balance</Text>
                        </View>
                        <View style={styles.balanceContent}>
                          <View style={{flex: 0.425}}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData.val} {this.state.walletData.symbol}</Text>
                          </View>
                          <View style={styles.balanceIcon}>
                              <Image style={{tintColor: Globals.DefaultSettings.theme.textColour, width: 30, height: 8.38}} source={require('../assets/convertIcon.png')}/>
                          </View>
                          <View style={{flex: 0.425, alignItems: 'flex-end'}}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{Globals.DefaultSettings.symbol} {(this.state.walletData.val*this.state.walletData.fiatRate).toFixed(2)} {Globals.DefaultSettings.currency}</Text>
                          </View>
                        </View>
                        <View>
                          <View style={{flexDirection: 'row' }}>
                            <View style={styles.InOutOutter}>
                              <View style={styles.InOutHeader}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Total In ({this.state.walletData.symbol})</Text>
                              </View>
                              <View style={styles.InOutContent}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData.totalIn}</Text>
                              </View>
                            </View>
                            <View style={{flex: 0.05}}>
                            </View>
                            <View style={styles.InOutOutter}>
                              <View style={styles.InOutHeader}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Total Out ({this.state.walletData.symbol})</Text>
                              </View>
                              <View style={styles.InOutContent}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData.totalOut}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <View style={styles.transactionCountBox}>
                            <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.walletData.txCount} Total Transactions</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {this.state.walletData.tokens &&
                      <View style={[styles.head, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour,}]}> 
                        <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Tokens</Text>
                        {this.state.showToken && this.state.walletData.tokens.map((token, i) => (
                          <View key={i} style={[styles.tokenOutter, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                            <View style={styles.tokenTitle}>
                              <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>{token.name}</Text>
                            </View>
                            <View style={{padding: 10}}>
                              <View style={styles.balanceHeader}>
                                <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Balance</Text>
                              </View>
                              <View style={styles.balanceContent}>
                                <View style={{flex: 0.425}}>
                                  <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{parseFloat((token.val/(Math.pow(10,token.decimals))).toFixed(token.decimals))} {token.symbol}</Text>
                                </View>
                                <View style={styles.balanceIcon}>
                                    <Image style={{tintColor: Globals.DefaultSettings.theme.textColour, width: 30, height: 8.38}} source={require('../assets/convertIcon.png')}/>
                                </View>
                                <View style={{flex: 0.425, alignItems: 'flex-end'}}>
                                  <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{token.fiatVal ? Globals.DefaultSettings.symbol + ' ' + (parseFloat((token.val/(Math.pow(10,token.decimals))))*token.fiatVal).toFixed(2) + ' ' + Globals.DefaultSettings.currency : 'N/A'}</Text>
                                </View>
                              </View>
                              <View>
                                <View style={{flexDirection: 'row' }}>
                                  <View style={styles.InOutOutter}>
                                    <View style={styles.InOutHeader}>
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Total In ({token.symbol})</Text>
                                    </View>
                                    <View style={styles.InOutContent}>
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{parseFloat((token.totalIn/(Math.pow(10,token.decimals))).toFixed(token.decimals))}</Text>
                                    </View>
                                  </View>
                                  <View style={{flex: 0.05}}>
                                  </View>
                                  <View style={styles.InOutOutter}>
                                    <View style={styles.InOutHeader}>
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardTextTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Total Out ({token.symbol})</Text>
                                    </View>
                                    <View style={styles.InOutContent}>
                                      <Text style={[CommonStylesheet.normalText, styles.walletCardText, {color: Globals.DefaultSettings.theme.textColour}]}>{parseFloat((token.totalOut/(Math.pow(10,token.decimals))).toFixed(token.decimals))}</Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                        <View style={[styles.headChild, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                          <TouchableOpacity style={styles.loadMoreButton} onPress={() => this.setState({showToken: !(this.state.showToken)})}>
                            <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Tap to {this.state.showToken ? 'Hide Tokens' : 'Show Tokens'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                    {
                      (this.state.transactionsLoaded) ? (
                        <View style={[styles.head, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour,}]}>
                          <Text style={[CommonStylesheet.titleText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Transactions ({Math.min(this.state.numTransactions, this.allTransactions.length)})</Text>
                          <View style={[styles.headChild, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                            {this.state.transactionsShow.map((transaction, i) => (
                              <View key={i} style={[styles.transactionItem, {borderColor: Globals.DefaultSettings.theme.textColour}, this.alternatingColour(i)]}>
                                <Text numberOfLines={1} style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{transaction.transactionID}</Text>
                                <View style={styles.transactionRow}>
                                  <View style={[styles.transactionRowItem, styles.transactionRowItemLeft]}>
                                    {transaction.from.map((fromAddr, j) => (
                                      <Text key={j}numberOfLines={1} ellipsizeMode='middle' style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{fromAddr}</Text>
                                    ))}
                                  </View>
                                  <View style={[styles.transactionRowItem, styles.transactionRowItemMiddle]}>
                                    <Image source={require('../assets/TransactionIcon.png')} style={[styles.transactionIcon, this.arrowTint(transaction.out)]}/>
                                  </View>
                                  <View style={[styles.transactionRowItem, styles.transactionRowItemRight]}>
                                    {transaction.to.map((toAddr, k) => (
                                      <Text key={k} numberOfLines={1} ellipsizeMode='middle' style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{toAddr}</Text>
                                    ))}
                                  </View>
                                </View>
                                <View style={{flexDirection: 'row',}}>
                                  <View style={{flex: 0.5}}>
                                    <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>Date:{' '}
                                      {(new Date(transaction.timestamp*1000)).toLocaleDateString()} {(new Date(transaction.timestamp*1000)).toLocaleTimeString()}
                                    </Text>
                                  </View>
                                  <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                                    <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>Amount: {transaction.amount}</Text>
                                  </View>
                                </View>
                              </View>
                            ))}
                            {this.state.numTransactions < 50 && this.state.numTransactions < this.allTransactions.length &&
                              <TouchableOpacity style={styles.loadMoreButton} onPress={() => this.loadMore()}>
                                <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Tap to Load More</Text>
                              </TouchableOpacity>
                            }
                          </View>
                        </View>
                      ) : (
                        <View style={[styles.transactionLoad, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                          <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Loading Transactions...</Text>
                        </View>
                      )
                    }
                  </View>
                  ) : (
                    <View style={styles.pageLoad}>
                      <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Loading Wallet...</Text>
                    </View>
                  )
              }
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  head: {
    margin: 15,
    marginTop: 0, 
    borderRadius: 5,
  },
  headChild: {
    borderBottomLeftRadius: 5, 
    borderBottomRightRadius: 5, 
  },
  headTitle: {
    margin: 10,
    alignSelf: 'center', 
  },
  transactionRow: {
    flexDirection: 'row',
  },
  transactionRowItem: {
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 3, 
  },
  transactionRowItemLeft: {
    flex: 0.4,
  },
  transactionRowItemMiddle: {
    flex: 0.2,
    alignItems: 'center',
  },
  transactionRowItemRight: {
    flex: 0.4,
    alignItems: 'flex-end', 
  },
  transactionIcon: {
    height: 15,
    width: 15*2.916,
  },
  transactionItem: {
    borderBottomWidth: 0,
    padding: 10,
  },
  loadMoreButton: {
    padding: 5, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  transactionLoad: {
    margin: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
    borderRadius: 5,
    marginTop: 0,
  },
  pageLoad: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: win.height,
  },
  logoImage: {
    width: win.width/3*2,
    height: win.width/3*2,
  },
  logoOutter: {
    marginTop: 15, 
    marginBottom: 15, 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
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
  walletCardTitleText: {
    fontSize: 20,
  },
  walletCardTextTitle: {
    marginTop: 5,
    fontSize: 16,
    //textDecorationLine: 'underline',  
  },
  walletCardText: {
    marginBottom: 0,
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
  transactionCountBox: {
    flex:1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    alignItems: 'center',
    borderRadius: 5,
  },
  tokenOutter: {
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10, 
    marginTop: 0, 
    borderRadius: 5,
  },
  tokenTitle: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderTopRightRadius: 5, 
    borderTopLeftRadius: 5,
  },
});

export default WalletInfo;