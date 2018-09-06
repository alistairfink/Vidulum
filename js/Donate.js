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
  Platform,
  Clipboard,
} from 'react-native';
import Globals from './Globals';
import CommonStylesheet from './Stylesheet';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  android: [
    'test',
  ],
});

const win = Dimensions.get('window');
const cryptoAddrs = {
  Bitcoin: "1JVwvYNWFnsxfM4CukvMyU8NxxjeY5FNoE",
  Ethereum: "0xAD54cB2fD6d207CBee71524632748B9a51e8793D",
  Litecoin: "LePq7JCwnLaEmy2wooJuhiWhiu1vuuDCwx",
  Dogecoin: "DHY7dKDHmutA4NRNzwTzjkpQHCKdVdQG2z",
}

class Donate extends React.Component {
  constructor(props){
    super(props);
    this.writeToClipBoard = this.writeToClipBoard.bind(this);
    this.alternatingColour = this.alternatingColour.bind(this);
  }
  componentWillMount() {
    this.prepare();
  }
  async prepare() {
    try {
      await RNIap.prepare();
      let products = await RNIap.getProducts(itemSkus);
      alert(JSON.stringify(products)); 
    }
    catch(err)
    {
      console.log(err);
    }
  }
  async writeToClipBoard(addr) {
    await Clipboard.setString(addr);
  }
  alternatingColour(index) {
    let c = null;
    c = index%2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.3)';
    return {
      backgroundColor: c,
    };
  }
  async writeToClipBoard(addr) {
    await Clipboard.setString(addr);
    ToastAndroid.show('Address Copied', ToastAndroid.SHORT);
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
          <Text style={[CommonStylesheet.title, {color: Globals.DefaultSettings.theme.textColour}]}>Support Me</Text>
        </View>
        <ScrollView>
          <View style={[CommonStylesheet.pageBG, {backgroundColor: Globals.DefaultSettings.theme.backgroundColour}]}>
            <View style={[styles.header, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}>
              <Text style={[CommonStylesheet.normalText, styles.headerText, {color: Globals.DefaultSettings.theme.textColour}]}>Crypto Addresses</Text>
              <View style={[styles.subHeaderGrid, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                {Object.keys(cryptoAddrs).map((key, i) => (
                  <TouchableOpacity key={key} style={[styles.subHeaderGridItem, this.alternatingColour(i)]}
                    onPress={()=>this.writeToClipBoard(cryptoAddrs[key])}
                  >
                    <View style={[styles.subHeaderGridItemLeft]}>
                      <Text style={[CommonStylesheet.normalText, styles.addrText, {color: Globals.DefaultSettings.theme.textColour}]}>
                        {key}
                      </Text>
                    </View>
                    <View style={[styles.subHeaderGridItemRight]}>
                      <Text numberOfLines={1} style={[CommonStylesheet.normalText, styles.addrText, {color: Globals.DefaultSettings.theme.textColour}]}>
                        {cryptoAddrs[key]}
                      </Text>
                    </View>
                  </TouchableOpacity> 
                ))}
              </View>
              <View style={styles.helpTextView}>
                <Text style={[CommonStylesheet.normalText, styles.text, {color: Globals.DefaultSettings.theme.textColour}]}>
                  To copy an address tap the corresponding row.
                </Text>
              </View>
            </View>
            <View style={[styles.header, {backgroundColor: Globals.DefaultSettings.theme.primaryColour, borderWidth: 1, borderColor: Globals.DefaultSettings.theme.darkColour}]}>
              <Text style={[CommonStylesheet.normalText, styles.headerText, {color: Globals.DefaultSettings.theme.textColour}]}>Why Donate?</Text>
              <View style={[styles.subHeader, {backgroundColor: Globals.DefaultSettings.theme.lightColour}]}>
                <Text style={[CommonStylesheet.normalText, styles.text, {color: Globals.DefaultSettings.theme.textColour}]}>
                  Parts of this application are hosted on my own servers. 
                  This means that the computing that occurs as a result of this application on my own server comes out of my own pocket.
                  By donating you'll help me to keep this project up and running for as long as possible!
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

//Styles
const styles = StyleSheet.create({
  header: {
    margin: 15,
    borderRadius: 5,
  },
  subHeader: {
    
  },
  headerText: {
    fontSize: 16,
    alignSelf: 'center',
    margin: 10, 
  },
  text: {
    margin: 10,
  },
  addrText: {
    margin: 15,
    fontSize: 14,
  },
  subHeaderGrid: {
    flexDirection: 'column' 
  },
  subHeaderGridItem: {
    flexDirection: 'row', 
  },
  subHeaderGridItemLeft: {
    flex: 0.3,
  },
  subHeaderGridItemRight: {
    flex: 0.7,
  },
  helpTextView: {
    alignItems: 'center',
  },
});

export default Donate;