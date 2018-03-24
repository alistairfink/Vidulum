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
      test: '',
    };
    this.userSettings = '';
    this.changeTheme = this.changeTheme.bind(this);
    this.save = this.save.bind(this);
  }
  componentWillMount() {
    this.getSettings();
  }
  async getSettings() {
    try{
      savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
      if(savedSettings)
      {
        this.userSettings = JSON.parse(savedSettings);
        return;
      }
      let savedSettings = Globals.DefaultSettings;
      this.userSettings = savedSettings;
    }
    catch(error){
      console.log(error);
    }
  }
  changeTheme(text){
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
  async save(){
    try{
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
          <View style={styles.controlBackground}>
            <View style={{marginRight: 5, marginLeft: 5}}>
              <Dropdown
                label='Theme'
                data={themeData}
                onChangeText={this.changeTheme}
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
  controlBackground: {
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});

export default Settings;