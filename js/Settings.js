//Imports
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
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';
import { Dropdown } from 'react-native-material-dropdown';

const win = Dimensions.get('window');

const fiatData = [
  {value:'AUD'},
  {value:'BRL'},
  {value:'CAD'},
  {value:'CHF'},
  {value:'CLP'},
  {value:'CNY'},
  {value:'CZK'},
  {value:'DKK'},
  {value:'EUR'},
  {value:'GBP'},
  {value:'HKD'},
  {value:'HUF'},
  {value:'IDR'},
  {value:'ILS'},
  {value:'INR'},
  {value:'JPY'},
  {value:'KRW'},
  {value:'MXN'},
  {value:'MYR'},
  {value:'NOK'},
  {value:'NZD'},
  {value:'PHP'},
  {value:'PKR'},
  {value:'PLN'},
  {value:'RUB'},
  {value:'SEK'},
  {value:'SGD'},
  {value:'THB'},
  {value:'TRY'},
  {value:'TWD'},
  {value:'USD'},
  {value:'ZAR'},
];
var themeData = [
  {value:'Light'},
  {value:'Dark'},
  {value:'Blue'},
  {value:'Red'},
  {value:'Green'},
  {value:'Orange'},
  {value:'Purple'},
];

class LockSettings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      enableLock: true,
      hiddenPass: '',
    };
    this.pass = '',
    this.lockToggle = this.lockToggle.bind(this);
    this.pinInput = this.pinInput.bind(this);
    this.savePin = this.savePin.bind(this);
    this.loadInPin = this.loadInPin.bind(this);
  }
  componentWillMount() {
    //Starts animation
    this.loadInPin();
    this.animateValue = new Animated.Value(win.width);
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
  async loadInPin() {
    this.setState({enableLock: Globals.DefaultSettings.walletLock});
    if(Globals.DefaultSettings.walletLock)
    {
      this.pass = await AsyncStorage.getItem(Globals.StorageNames.pass); 
      for(let i = 0; i < this.pass.length; i++)
      {
        this.setState({hiddenPass: this.state.hiddenPass + "* "});
      }     
      this.setState({hiddenPass: this.state.hiddenPass.trim()});
    }
  }
  async lockToggle() {
    if(!(this.state.enableLock))
    {
      this.setState({enableLock: true});
      return;
    }
    Alert.alert(
      'Are You Sure?',
      'Disabling lock screen will wipe all lock screen settings. This data cannot be recovered and the lock screen settings will need to be re-entered.', 
    [
      {text: 'Confirm', onPress: async() => {
        this.setState({enableLock: false});
      }},
      {text: 'Cancel'},
    ]);
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
  savePin() {
    if(!(this.state.enableLock))
    {
      this.props.lockUpdate(this.state.enableLock, '-');
    }
    else
    {
      if(!(this.pass))
      {
        Alert.alert(
          'Error',
          'A pin must be entered.', 
        [
          {text: 'OK'},
        ]);
        return;
      }
      this.props.lockUpdate(this.state.enableLock, this.pass);
    }
    this.exit();
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
              <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Lock Screen Settings</Text>
            </View>
            <ScrollView>
              <View style={CommonStylesheet.controlBackground}>
                <View style={CommonStylesheet.controlInner, styles.switchInner}>
                  <View style={styles.switchTextSection}>
                    <Text style={[CommonStylesheet.normalText, {color: 'black'}]}>Refresh on opening app.</Text>
                  </View>
                  <View style={styles.switchSwitchSection}>
                    <Switch
                      value={this.state.enableLock}
                      tintColor="darkslategray"
                      onTintColor={Globals.DefaultSettings.theme.primaryColour}
                      onValueChange={() => this.lockToggle()}
                    />
                  </View>
                </View>
              </View>
              {this.state.enableLock &&
                <View>
                  <View style={CommonStylesheet.controlBackground}>
                    <View style={styles.numpadDisplayOutter}>
                      <Text style={styles.numpadDisplay}>{this.state.hiddenPass}</Text>
                    </View>
                    <View style={styles.numpadRowOutter}>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('1')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>1</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('2')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>2</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('3')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>3</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                    <View style={styles.numpadRowOutter}>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('4')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>4</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('5')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>5</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('6')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>6</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                    <View style={styles.numpadRowOutter}>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('7')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>7</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('8')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>8</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('9')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>9</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                    <View style={styles.numpadRowOutter}>
                      <View style={styles.numpadItemOutter}>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('0')}
                        >
                          <View style={styles.numpadItem}>
                            <Text style={{color: 'black'}}>0</Text>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                      <View style={styles.numpadItemOutter}>
                        <TouchableNativeFeedback
                          style={styles.numpadNativeFeedback}
                          onPress={() => this.pinInput('-')}
                        >
                          <View style={styles.numpadItem}>
                            <Image source={require('../assets/numpadDeleteIcon.png')} style={styles.numpadDeleteIcon}/>
                          </View>
                        </TouchableNativeFeedback>
                      </View>
                    </View>
                  </View>
                </View>
              }
            </ScrollView>
            <View style={[styles.footer, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
              <TouchableOpacity 
                style={[styles.footerButton, 
                  {borderLeftColor: Globals.DefaultSettings.theme.darkColour, borderLeftWidth: 1}]
                } 
                onPress={() => this.savePin()}
              >
                <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}


class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refreshPage: false,
      refreshOnOpen: true,
    };
    this.menuPages = { 
        lock: {
          status: false,
          displayText: 'Lock Screen Settings',
        },
      },
    this.userSettings = '';
    this.pin = '';
    this.changeTheme = this.changeTheme.bind(this);
    this.save = this.save.bind(this);
    this.changeFiat = this.changeFiat.bind(this);
    this.getSwitchSettings = this.getSwitchSettings.bind(this);
    this.setSwitchSettings = this.setSwitchSettings.bind(this);
    this.menuPageHandler = this.menuPageHandler.bind(this);
    this.backHandle = this.backHandle.bind(this);
    this.lockUpdate = this.lockUpdate.bind(this);
  }
  componentWillMount() {
    this.getSettings();
  }
  async getSettings() {
    //Gets settings from storage and if there are any then it uses that object
    try{
      let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
      console.log(JSON.parse(savedSettings));
      if(savedSettings)
      {
        this.userSettings = JSON.parse(savedSettings);
        this.getSwitchSettings();
        return;
      }
      savedSettings = Globals.DefaultSettings;
      this.userSettings = savedSettings;
    }
    catch(error){
      console.log(error);
    }
  }
  changeFiat(text) {
    if(!Globals.currChanged)
    {
      Globals.changeCurr();
    }
    //Sets currency and symbol
    this.userSettings.currency = text;
    switch(text){
      case 'BRL':
        this.userSettings.symbol = 'R$';
        break;
      case 'CHF':
        this.userSettings.symbol = 'CHF';
        break;
      case 'CNY':
      case 'JPY':
        this.userSettings.symbol = '¥';
        break;
      case 'CZK':
        this.userSettings.symbol = 'Kč';
        break;
      case 'DKK':
        this.userSettings.symbol = 'kr.';
        break;
      case 'EUR':
        this.userSettings.symbol = '€';
        break;
      case 'GBP':
        this.userSettings.symbol = '£';
        break;
      case 'HUF':
        this.userSettings.symbol = 'Ft';
        break;
      case 'IDR':
        this.userSettings.symbol = 'Rp';
        break;
      case 'ILS':
        this.userSettings.symbol = '₪';
        break;
      case 'INR':
        this.userSettings.symbol = '₹';
        break;
      case 'KRW':
        this.userSettings.symbol = '₩';
        break;
      case 'MYR':
        this.userSettings.symbol = 'RM';
        break;
      case 'NOK':
      case 'SEK':
      case 'TRY':
        this.userSettings.symbol = 'kr';
        break;
      case 'PHP':
        this.userSettings.symbol = '₱';
        break;
      case 'PKR':
        this.userSettings.symbol = '₨';
        break;
      case 'PLN':
        this.userSettings.symbol = 'zł';
        break;
      case 'RUB':
        this.userSettings.symbol = '₽';
        break;
      case 'THB':
        this.userSettings.symbol = '฿';
        break;
      case 'ZAR':
        this.userSettings.symbol = 'R';
        break;
      default:
        this.userSettings.symbol = '$';
    }
  }
  changeTheme(text){
    //Sets user theme
    switch(text) {
      case "Blue":
        this.userSettings.theme = {
          name: 'Blue',
          primaryColour: '#0d47a1',
          lightColour: '#5472d3',
          darkColour: '#002171',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      case "Red":
        this.userSettings.theme = {
          name: 'Red',
          primaryColour: '#b71c1c',
          lightColour: '#f05545',
          darkColour: '#7f0000',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      case "Green":
        this.userSettings.theme = {
          name: 'Green',
          primaryColour: '#1b5e20',
          lightColour: '#4c8c4a',
          darkColour: '#003300',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      case "Dark":
        this.userSettings.theme = {
          name: 'Dark',
          primaryColour: '#212121',
          lightColour: '#484848',
          darkColour: '#000000',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      case "Orange":
        this.userSettings.theme = {
          name: 'Orange',
          primaryColour: '#e65100',
          lightColour: '#ff833a',
          darkColour: '#ac1900',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      case "Purple":
        this.userSettings.theme = {
          name: 'Purple',
          primaryColour: '#4a148c',
          lightColour: '#7c43bd',
          darkColour: '#12005e',
          backgroundColour: 'black',
          textColour: '#FFFFFF',
        }
        break;
      default:
        this.userSettings.theme = {
          name: 'Light',
          primaryColour: '#e0e0e0',
          lightColour: '#ffffff',
          darkColour: '#aeaeae',
          backgroundColour: 'white',
          textColour: '#000000',
        }
    }
  }
  getSwitchSettings() {
    this.setState({
      refreshOnOpen: this.userSettings.reloadOnOpen,
    });
  }
  setSwitchSettings() {
    this.userSettings.reloadOnOpen = this.state.refreshOnOpen;
  }
  async save(){
    try{
      if(this.pin === '-')
      {
        await AsyncStorage.setItem(Globals.StorageNames.pass, '');
      }
      else if(this.pin)
      {
        await AsyncStorage.setItem(Globals.StorageNames.pass, this.pin);
      }
      //Saves settings to local and updates globals then goes back.
      this.setSwitchSettings();
      Globals.UpdateSettings(this.userSettings);
      await AsyncStorage.setItem(Globals.StorageNames.settings, JSON.stringify(this.userSettings));
      this.props.navigation.goBack();
    }
    catch(error)
    {
      console.log(error);
    }
  }
  menuPageHandler(_name) {
    //Sets all pages to false then sets the selected to true. To acccount for overlap.
    for(let page in this.menuPages)
    {
      ((this.menuPages)[page]).status = false;
    }
    ((this.menuPages)[_name]).status = true;
    this.setState({refreshPage: !(this.state.refreshPage)});
  }
  backHandle(_name) {   
    ((this.menuPages)[_name]).status = false;
    this.setState({refreshPage: !(this.state.refreshPage)});
  }
  lockUpdate(enabled, pin) {
    this.userSettings.walletLock = enabled;
    this.pin = pin; 
  }
  render() {
    if(this.menuPages.lock.status)
    {
      return(
        <LockSettings handler={() => this.backHandle('lock')} lockUpdate={(var1, var2) => this.lockUpdate(var1, var2)}/>
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
              onPress={() => {this.props.navigation.navigate('DrawerOpen'); this.props.navigation.drawerBackground}}
            >
              <Image source={require('../assets/menuIcon.png')} style={[CommonStylesheet.leftIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
            </TouchableOpacity>
            <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Settings</Text>
          </View>
          <ScrollView>
            <View style={CommonStylesheet.controlBackground}>
              <View style={CommonStylesheet.controlInner, styles.switchInner}>
                <View style={styles.switchTextSection}>
                  <Text style={[CommonStylesheet.normalText, {color: 'black'}]}>Refresh on opening app.</Text>
                </View>
                <View style={styles.switchSwitchSection}>
                  <Switch
                    value={this.state.refreshOnOpen}
                    tintColor="darkslategray"
                    onTintColor={Globals.DefaultSettings.theme.primaryColour}
                    onValueChange={() => this.setState({refreshOnOpen: !(this.state.refreshOnOpen)})}
                  />
                </View>
              </View>
            </View>
            <View style={CommonStylesheet.controlBackground}>
              <View style={CommonStylesheet.controlInner}>
                <Dropdown
                  label='Theme'
                  data={themeData}
                  onChangeText={this.changeTheme}
                />
              </View>
            </View>
            <View style={CommonStylesheet.controlBackground}>
              <View style={CommonStylesheet.controlInner}>
                <Dropdown
                  label='Fiat Currency'
                  data={fiatData}
                  onChangeText={this.changeFiat}
                />
              </View>
            </View>
            <View style={CommonStylesheet.controlBackground}>
              <View style={CommonStylesheet.controlInner}>
                {Object.keys(this.menuPages).map((name: 'string') => (
                  <TouchableOpacity
                    key={name} 
                    style={styles.menuPageOuter}
                    onPress={() => this.menuPageHandler(name)}
                  >
                    <View style={styles.menuPageTextOuter}>
                      <Text style={{color: 'black'}}>{((this.menuPages)[name]).displayText}</Text>
                    </View>
                    <View style={styles.menuPageIconOuter}>
                      <Image source={require('../assets/forwardIcon.png')} style={styles.menuPageIcon}/>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          <View style={[styles.footer, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <TouchableOpacity style={styles.footerButton} 
              onPress={() => {
                this.props.navigation.goBack();
            }}>
              <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Cancel</Text>            
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.footerButton, 
                {borderLeftColor: Globals.DefaultSettings.theme.darkColour, borderLeftWidth: 1}]
              } 
              onPress={this.save}>
              <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

//Styles
const styles = StyleSheet.create({
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
  switchTextSection: {
    margin: 5, 
    marginBottom: 0, 
    flex: 1, 
    paddingTop: 5,
    paddingBottom: 10,
  },
  switchSwitchSection: {
    margin: 5, 
    marginBottom: 0
  },
  switchInner: {
    flexDirection: 'row'
  },
  menuPageOuter: {
    flexDirection: 'row', 
    borderBottomColor: 'rgba(0,0,0,0.3)', 
    borderBottomWidth: 1
  },
  menuPageTextOuter: {
    padding: 5, 
    paddingTop: 15, 
    paddingBottom: 15, 
    flex: 0.9
  },
  menuPageIconOuter: {
    flex: 0.1, 
    justifyContent: 'center', 
    alignItems: 'flex-end'
  },
  menuPageIcon: {
    width: 8, 
    height: 13.52, 
    tintColor: 'rgba(0,0,0,0.6)', 
    marginRight: 5
  },
  numpadItemOutter: {
    flex: 0.33,
  },
  numpadRowOutter: {
    flexDirection: 'row', 
    justifyContent:  'center',
  },
  numpadItem: {
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  numpadNativeFeedback: {
    flex: 1,
  },
  numpadDisplay: {
    color: 'black', 
    fontSize: 20,
  },
  numpadDisplayOutter: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadDeleteIcon: {
    height: 20,
    width: 20*2.09,
    tintColor: 'black',
  },
});

export default Settings;