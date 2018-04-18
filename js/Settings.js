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
  StatusBar,
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

class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      refreshOnOpen: true,
    };
    this.userSettings = '';
    this.changeTheme = this.changeTheme.bind(this);
    this.save = this.save.bind(this);
    this.changeFiat = this.changeFiat.bind(this);
    this.getSwitchSettings = this.getSwitchSettings.bind(this);
    this.setSwitchSettings = this.setSwitchSettings.bind(this);
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
          textColour: 'white',
        }
        break;
      case "Red":
        this.userSettings.theme = {
          name: 'Red',
          primaryColour: '#b71c1c',
          lightColour: '#f05545',
          darkColour: '#7f0000',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Green":
        this.userSettings.theme = {
          name: 'Green',
          primaryColour: '#1b5e20',
          lightColour: '#4c8c4a',
          darkColour: '#003300',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Dark":
        this.userSettings.theme = {
          name: 'Dark',
          primaryColour: '#212121',
          lightColour: '#484848',
          darkColour: '#000000',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Orange":
        this.userSettings.theme = {
          name: 'Orange',
          primaryColour: '#e65100',
          lightColour: '#ff833a',
          darkColour: '#ac1900',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      case "Purple":
        this.userSettings.theme = {
          name: 'Purple',
          primaryColour: '#4a148c',
          lightColour: '#7c43bd',
          darkColour: '#12005e',
          backgroundColour: 'black',
          textColour: 'white',
        }
        break;
      default:
        this.userSettings.theme = {
          name: 'Light',
          primaryColour: '#e0e0e0',
          lightColour: '#ffffff',
          darkColour: '#aeaeae',
          backgroundColour: 'white',
          textColour: 'black',
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
  render() {
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
});

export default Settings;