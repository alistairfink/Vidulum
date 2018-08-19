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
var hash = require('hash.js');

const win = Dimensions.get('window');

class LogIn extends React.Component {
  constructor(props){
    super(props);
    this.pages = [
      'Log In',
      'Log Out',
      'Sign Up',
    ];
    this.emailString = 'email';
    this.passString = 'pass';
    this.state={
      email: '',
      pass: '',
    };
  }
  componentWillMount() {
  }
  async loginButton() {
    if(this.state.email.length > 0 && this.state.pass.length > 0)
    {
      try{
        //Hashes Pass
        let passSend = hash.sha256().update(this.state.pass).digest('hex');
        //Sends to server
        await fetch(Globals.ApiEndPoints.alistairFinkSignIn,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: Globals.alistairfinkApiKey,
            email: this.state.email,
            pass: passSend
          })
        })
        .then((response) => response.json() ) 
        .then(async (responseJson) => {
          //If receive error display error.
          if(responseJson.error)
          {
            alert(responseJson.error);
            return;
          }
          //Successfully created account so set token to local storage.
          await AsyncStorage.setItem(Globals.StorageNames.key, responseJson.token);
			    Alert.alert(
			      'Success',
			      'Login Successful!', 
			    [
			      {text: 'Close'},
			    ]);
          //Update settings with email and such
          let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
          savedSettings = JSON.parse(savedSettings);
          savedSettings.loggedIn = true;
          savedSettings.email = this.state.email;
          Globals.UpdateSettings(savedSettings);
          await AsyncStorage.setItem(Globals.StorageNames.settings, JSON.stringify(savedSettings));
          this.setState({pass: ''});
        })
      }
      catch(error)
      {
        console.log(error);
      }
    }
    else
    {
	    Alert.alert(
	      'Error',
	      'E-Mail and Password Fields Required', 
	    [
	      {text: 'Close'},
	    ]);
	  }
  }
  async createButton() {
    //Checks pass and email fields aren't blank
    if(this.state.email.length > 0 && this.state.pass.length > 0)
    {
      try{
        //Hashes Pass
        let passSend = hash.sha256().update(this.state.pass).digest('hex');
        //Sends to server
        await fetch(Globals.ApiEndPoints.alistairFinkSignUp,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: Globals.alistairfinkApiKey,
            email: this.state.email,
            pass: passSend
          })
        })
        .then((response) => response.json() ) 
        .then(async (responseJson) => {
          //If receive error display error.
          if(responseJson.error)
          {
            alert(responseJson.error);
            return;
          }
          //Successfully created account so set token to local storage.
          await AsyncStorage.setItem(Globals.StorageNames.key, responseJson.token);
			    Alert.alert(
			      'Success',
			      'Account successfully created!', 
			    [
			      {text: 'Close'},
			    ]);
          //Update settings with email and such
          let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
          savedSettings = JSON.parse(savedSettings);
          savedSettings.loggedIn = true;
          savedSettings.email = this.state.email;
          Globals.UpdateSettings(savedSettings);
          await AsyncStorage.setItem(Globals.StorageNames.settings, JSON.stringify(savedSettings));
          this.setState({pass: ''});
        })
      }
      catch(error)
      {
        console.log(error);
      }
    }
    else
    {
	    Alert.alert(
	      'Error',
	      'E-Mail and Password Fields Required', 
	    [
	      {text: 'Close'},
	    ]);
    }
  }
  async backupButton() {
  	let savedWallets = await AsyncStorage.getItem(Globals.StorageNames.wallets);
  	if(savedWallets)
  	{
  		try{
  		 	//Retrieves key
        let token = await AsyncStorage.getItem(Globals.StorageNames.key);
        //Sends to server
        await fetch(Globals.ApiEndPoints.alistairFinkBackup,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: Globals.alistairfinkApiKey,
            email: Globals.DefaultSettings.email,
            key: token,
            wallets: savedWallets
          })
        })
        .then((response) => response.json() ) 
        .then(async (responseJson) => {
          //If receive error display error.
          if(responseJson.error)
          {
            alert(responseJson.error);
            return;
          }
          //Save new token and display alert
          await AsyncStorage.setItem(Globals.StorageNames.key, responseJson.token);
			    Alert.alert(
			      'Success',
			      'Backup Successful!', 
			    [
			      {text: 'Close'},
			    ]);
        })
      }
      catch(error)
      {
        console.log(error);
      }
  	}
  	else
  	{
  		alert('There are no saved wallets to backup.')
  	}
  }
  async restoreButton() { 
  	try{
  		 	//Retrieves key
        let token = await AsyncStorage.getItem(Globals.StorageNames.key);
        //Sends to server
        await fetch(Globals.ApiEndPoints.alistairFinkRestore,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: Globals.alistairfinkApiKey,
            email: Globals.DefaultSettings.email,
            key: token
          })
        })
        .then((response) => response.json() ) 
        .then(async (responseJson) => {
          //If receive error display error.
          if(responseJson.error)
          {
            alert(responseJson.error);
            return;
          }
          //Successfully retrieved backup so save new token and wallets.
          await AsyncStorage.setItem(Globals.StorageNames.key, responseJson.token);
          let retrievedWallets = JSON.parse(responseJson.wallets);
      		await AsyncStorage.setItem(Globals.StorageNames.wallets, JSON.stringify(retrievedWallets));
			    Alert.alert(
			      'Success',
			      'Restore Successful!', 
			    [
			      {text: 'Close'},
			    ]);
        })
  	}
  	catch(error)
  	{
  		console.log(error);
  	}
  }
  async logOutButton() {
  	try{
  		 	//Retrieves key
        let token = await AsyncStorage.getItem(Globals.StorageNames.key);
        //Sends to server
        await fetch(Globals.ApiEndPoints.alistairFinkSignOut,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            apiKey: Globals.alistairfinkApiKey,
            email: Globals.DefaultSettings.email,
            key: token
          })
        })
        .then((response) => response.json() ) 
        .then(async (responseJson) => {
          //If receive error display error.
          if(responseJson.error)
          {
            alert(responseJson.error);
            return;
          }
          //Successfully logged out so reset everything and refresh page
          await AsyncStorage.setItem(Globals.StorageNames.key, '');
          let savedSettings = await AsyncStorage.getItem(Globals.StorageNames.settings);
          savedSettings = JSON.parse(savedSettings);
          savedSettings.loggedIn = false;
          savedSettings.email = '';
          Globals.UpdateSettings(savedSettings);
          await AsyncStorage.setItem(Globals.StorageNames.settings, JSON.stringify(savedSettings));
          this.setState({});
			    Alert.alert(
			      'Success',
			      'Log Out Successful!', 
			    [
			      {text: 'Close'},
			    ]);
        })
  	}
  	catch(error)
  	{
  		console.log(error);
  	}
  }
  render() {
    const animatedStyle = {left: this.animateValue}
    return (
      <View style={{backgroundColor: Globals.DefaultSettings.theme.backgroundColour, width: win.width, position: 'absolute',}}>
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.darkColour}
        />
        <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour, height: win.height-StatusBar.currentHeight}]}>
          <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
            >
              <Image source={require('../assets/backIcon.png')} style={[CommonStylesheet.leftIcon, 
                {tintColor: Globals.DefaultSettings.theme.textColour}]}
              />
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center', padding: 0,}}>
              <Text numberOfLines={1} style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour, alignSelf: 'flex-start'}]}>Account Settings</Text>
            </View>
          </View>
          <ScrollView>
            <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour}]}>
              {
                (Globals.DefaultSettings.loggedIn) ? (
                	<View>
                    <View style={[styles.header, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}>
                      <Text style={[CommonStylesheet.normalText, styles.headerText, {color: Globals.DefaultSettings.theme.textColour}]}>{Globals.DefaultSettings.email}</Text>
                    </View>
                    <TouchableOpacity
                    	style={[styles.loggedInButton, {backgroundColor: Globals.DefaultSettings.theme.lightColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}
                    	onPress={() => this.backupButton()}
                    >
                      <Text style={[CommonStylesheet.normalText, styles.subHeaderText, {color: Globals.DefaultSettings.theme.textColour}]}>Backup Wallets List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    	style={[styles.loggedInButton, {backgroundColor: Globals.DefaultSettings.theme.lightColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}
                    	onPress={() => this.restoreButton()}
                    >
                      <Text style={[CommonStylesheet.normalText, styles.subHeaderText, {color: Globals.DefaultSettings.theme.textColour}]}>Restore Wallets List</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    	style={[styles.loggedInButton, {backgroundColor: Globals.DefaultSettings.theme.lightColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}
                    	onPress={() => this.logOutButton()}
                    >
                      <Text style={[CommonStylesheet.normalText, styles.subHeaderText, {color: Globals.DefaultSettings.theme.textColour}]}>Log Out</Text>
                    </TouchableOpacity>
                	</View>
                ) : (
                  <View>
                    <View style={[styles.header, {backgroundColor: Globals.DefaultSettings.theme.lightColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}>
                      <TextInput
                        placeholder={'E-Mail'}
                        placeholderTextColor={'#a0a0a0'}
                        value={this.state.email}
                        style={styles.input}
                        onChangeText={(value) =>{
                          this.setState({email: value});
                        }}
                      />
                      <TextInput
                        placeholder={'Password'}
                        placeholderTextColor={'#a0a0a0'}
                        value={this.state.pass}
                        style={styles.input}
                        secureTextEntry={true}
                        onChangeText={(value) =>{
                          this.setState({pass: value})
                        }}
                      />
                      <Text style={[CommonStylesheet.normalText, styles.textHelp, {color: Globals.DefaultSettings.theme.textColour}]}>Input credentials to login or to create an account.</Text>
                      <View style={[styles.buttons, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
                        <TouchableOpacity
                          onPress={() => this.loginButton()}
                          style={styles.buttonTouchable}
                        > 
                          <Text style={[CommonStylesheet.normalText, styles.buttonText, {color: Globals.DefaultSettings.theme.textColour}]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => this.createButton()}
                          style={styles.buttonTouchable}
                        > 
                          <Text style={[CommonStylesheet.normalText, styles.buttonText, {color: Globals.DefaultSettings.theme.textColour}]}>Create Account</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={[styles.header, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}>
                      <Text style={[CommonStylesheet.normalText, styles.subHeaderText, {color: Globals.DefaultSettings.theme.textColour}]}>Why Create an Account?</Text>
                      <View style={[styles.subHeader, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                        <Text style={[CommonStylesheet.normalText, styles.text, {color: Globals.DefaultSettings.theme.textColour}]}>Creating an account with the Vidulum app allows users to backup and restore wallet lists across devices regardless of device.</Text>
                      </View>
                    </View>
                  </View>
                )
              }
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    margin: 10,
    borderRadius: 5,
    flexDirection: 'column', 
    justifyContent: 'center', 
  },
  subHeader: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center', 
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center', 
    margin: 15,
  },
  subHeaderText: {
    fontSize: 16,
    alignSelf: 'center',
    margin: 10, 
  },
  text: {
    margin: 5,
  },
  input: {
    margin:10,
  },
  textHelp: {
    marginTop: 0,
    margin: 15,
  },
  buttons: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row', 
  },
  buttonTouchable: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',  
  },
  buttonText: {
    margin: 15,
    fontSize: 16,
  },
  loggedInButton: {
  	padding: 15,
  	margin: 15,
  	marginLeft: 50,
  	marginRight: 50,
  	borderRadius: 5,
  },
});

export default LogIn;