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
  Keyboard,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';

const win = Dimensions.get('window');

class Feedback extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      subject: '',
      returnBool: false,
      returnAddr: '',
      message: '',
    };
    this.send = this.send.bind(this);
    this.toogleReturn = this.toogleReturn.bind(this);
  }
  send() {
    if(!(this.state.name))
    {
      Alert.alert(
        'Error',
        "A name must be inputted.", 
      [
        {text: 'OK'},
      ]);
      return;
    }
    else if(!(this.state.subject))
    {
      Alert.alert(
        'Error',
        "A subject line must be inputted.", 
      [
        {text: 'OK'},
      ]);
      return;
    }
    else if(!(this.state.message))
    {
      Alert.alert(
        'Error',
        "There must be message content inputted.", 
      [
        {text: 'OK'},
      ]);
      return;
    }
    else if(this.state.returnBool && !(this.state.returnAddr))
    {
      Alert.alert(
        'Error',
        "If a response is requested a return e-mail must be inputted.", 
      [
        {text: 'OK'},
      ]);
      return;
    }
    let key = '';
    fetch(Globals.ApiEndPoints.feedback,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apiKey: key,
        name: this.state.name,
        subject: this.state.subject,
        returnBool: this.state.returnBool,
        returnAddr: this.state.returnBool ? this.state.returnAddr : '',
        message: this.state.message 
      })
    })
    .then((response) => response.json())
    .then((responseJson) => { 
      if(responseJson.message != 'success')
      {
        Alert.alert(
          'Error',
          "Error sending message. Please try again yesterday.", 
        [
          {text: 'OK'},
        ]);
      }
    })
    this.props.navigation.goBack();
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow (e) {
    //Adds height to bottom of scrollview and scrolls down on that height so the keyboard isn't in the way
    let height = e.endCoordinates.height; 
    this.setState({keyboardHeight: height});
    if(this.messageInput.isFocused() || (this.addrInput && this.addrInput.isFocused())){
      setTimeout(() => {
        this.mainScroll.scrollTo({ y: height });
      }, 1)
    }
  }
  _keyboardDidHide () {
    this.setState({keyboardHeight: 0});
  }
  toogleReturn() {
    this.setState({returnBool: !this.state.returnBool});
  }
  render() {
    return (
	    <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour, width: win.width, position: 'absolute', height: win.height-StatusBar.currentHeight}]}>
        <StatusBar
          backgroundColor={Globals.DefaultSettings.theme.darkColour}
        />
        <View style={[CommonStylesheet.topBar, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
          <TouchableOpacity
            onPress={() => {this.props.navigation.navigate('DrawerOpen'); this.props.navigation.drawerBackground}}
          >
            <Image source={require('../assets/menuIcon.png')} style={[CommonStylesheet.leftIcon, {tintColor: Globals.DefaultSettings.theme.textColour}]}/>
          </TouchableOpacity>
          <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Feedback</Text>
        </View>
        <ScrollView ref={scrollView => this.mainScroll = scrollView}>
          <View style={[styles.descriptionOutter, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <Text style={[CommonStylesheet.normalText, {color: Globals.DefaultSettings.theme.textColour}]}>Feel free to send me any comments, criticisms, requests, coin support, etc. pertaining to Vidulum. I will get back to you as soon as possible.</Text>
          </View>
          <View style={[styles.inputOutter, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <Text style={[CommonStylesheet.titleText, styles.inputTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Name</Text>
            <View style={[styles.inputChildOuter, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
              <TextInput
                ref={textInput => this.nameInput = textInput}
                style={[{margin: 5,}, {color: Globals.DefaultSettings.theme.textColour}]}
                onChangeText={(text) => this.setState({name: text})}
                value={this.state.name}
                placeholder="Enter Name"
                placeholderTextColor={Globals.DefaultSettings.theme.textColour+'7F'}
                underlineColorAndroid={Globals.DefaultSettings.theme.textColour}
              />
            </View>
          </View>
          <View style={[styles.inputOutter, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <Text style={[CommonStylesheet.titleText, styles.inputTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Subject</Text>
            <View style={[styles.inputChildOuter, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
              <TextInput
                ref={textInput => this.subjectInput = textInput}
                style={[{margin: 5,}, {color: Globals.DefaultSettings.theme.textColour}]}
                onChangeText={(text) => this.setState({subject: text})}
                value={this.state.subject}
                placeholder="Enter Name"
                placeholderTextColor={Globals.DefaultSettings.theme.textColour+'7F'}
                underlineColorAndroid={Globals.DefaultSettings.theme.textColour}
              />
            </View>
          </View>
          <View style={[styles.inputOutter, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <Text style={[CommonStylesheet.titleText, styles.inputTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Message</Text>
            <View style={[styles.inputChildOuter, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
              <TextInput
                ref={textInput => this.messageInput = textInput}
                multiline
                style={[{margin: 5,}, {color: Globals.DefaultSettings.theme.textColour}]}
                onChangeText={(text) => this.setState({message: text})}
                value={this.state.message}
                placeholder="Enter Message"
                placeholderTextColor={Globals.DefaultSettings.theme.textColour+'7F'}
                underlineColorAndroid={Globals.DefaultSettings.theme.textColour}
              />
            </View>
          </View>
          <View style={[styles.inputOutter, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.switchTextSection}>
                <Text style={[CommonStylesheet.titleText, styles.inputTitle, {color: Globals.DefaultSettings.theme.textColour}]}>Response?</Text>
              </View>
              <View style={styles.switchSwitchSection}>
                <Switch
                  value={this.state.returnBool}
                  tintColor={Globals.DefaultSettings.theme.darkColour}
                  onTintColor={Globals.DefaultSettings.theme.lightColour}
                  onValueChange={() => this.toogleReturn()}
                />
              </View>
            </View>
            {this.state.returnBool && 
              <View style={[styles.inputChildOuter, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                <TextInput
                  ref={textInput => this.addrInput = textInput}
                  style={[{margin: 5,}, {color: Globals.DefaultSettings.theme.textColour}]}
                  onChangeText={(text) => this.setState({returnAddr: text})}
                  value={this.state.returnAddr}
                  placeholder="Enter Response E-Mail"
                  placeholderTextColor={Globals.DefaultSettings.theme.textColour+'7F'}
                  underlineColorAndroid={Globals.DefaultSettings.theme.textColour}
                />
              </View>
            }
          </View>
          <View style={{height: this.state.keyboardHeight}}></View>
        </ScrollView>
        <View style={[styles.footer, {backgroundColor: Globals.DefaultSettings.theme.primaryColour}]}>
          <TouchableOpacity 
            style={[styles.footerButton, 
              {borderLeftColor: Globals.DefaultSettings.theme.darkColour, borderLeftWidth: 1}]
            } 
            onPress={() => this.send()}
          >
            <Text style={[styles.footerText, {color: Globals.DefaultSettings.theme.textColour}]}>Send</Text>
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
  descriptionOutter: {
    margin: 15, 
    padding: 10, 
    borderRadius: 5,
  },
  inputChildOuter: {
    borderBottomLeftRadius: 5, 
    borderBottomRightRadius: 5, 
    padding: 5,
  },
  inputOutter: {
    margin: 15,
    marginTop: 0, 
    borderRadius: 5,
  },
  inputTitle: {
    margin: 10,
  },
  switchTextSection: {
    marginBottom: 0, 
    flex: 1, 
    paddingTop: 5,
    paddingBottom: 10,
  },
  switchSwitchSection: {
    margin: 5, 
    marginBottom: 0
  },
});

export default Feedback;