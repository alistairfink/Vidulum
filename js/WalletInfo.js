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
  onLoad() {
    let walletI = this.props.wallet;
    if(this.props.walletData)
    {
      this.setState({walletData: this.props.walletData});
    }
    switch(walletI.coin) {
      case 'Bitcoin':
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
    {
      [addrInfo, transactionInfo] = await Promise.all([
        fetch('http://memes.alistairfink.com/VidulumApi/ethplorer',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passThrough: 'getAddressInfo/' + walletI.address
          })
        })
        .then((response) => response.json()),
        fetch('http://memes.alistairfink.com/VidulumApi/ethplorer',{
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
      ]);
    }
    else 
    {
      transactionInfo = await fetch('http://memes.alistairfink.com/VidulumApi/ethplorer',{
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
    {
      let tempObj = {
        timestamp: transactionInfo[i].timestamp,
        from: transactionInfo[i].from,
        to:transactionInfo[i].to,
        transactionID: transactionInfo[i].hash,
        amount: transactionInfo[i].value,
      };
      _transactionInfo.push(tempObj);
    }
    this.allTransactions = _transactionInfo;
    this.setState({transactionsShow: this.allTransactions.slice(0, this.state.numTransactions), transactionsLoaded: true});
  }
  getBtc(walletI) {

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
  arrowTint(toAddr, walletAddr) {
    let colour = toAddr.toLowerCase() === walletAddr.toLowerCase() ? 'limegreen' : 'red';
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
                            <Text style={[CommonStylesheet.normalText, styles.headTitle, {color: Globals.DefaultSettings.theme.textColour}]}>{this.state.showToken ? 'Hide Tokens' : 'Show Tokens'}</Text>
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
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{transaction.from}</Text>
                                  </View>
                                  <View style={[styles.transactionRowItem, styles.transactionRowItemMiddle]}>
                                    <Image source={require('../assets/TransactionIcon.png')} style={[styles.transactionIcon, this.arrowTint(transaction.to, this.props.wallet.address)]}/>
                                  </View>
                                  <View style={[styles.transactionRowItem, styles.transactionRowItemRight]}>
                                    <Text numberOfLines={1} ellipsizeMode='middle' style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>{transaction.to}</Text>
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