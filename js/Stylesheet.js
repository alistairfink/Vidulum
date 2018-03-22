import {
  StyleSheet,
  Dimensions, 
} from 'react-native';

const win = Dimensions.get('window');

export default StyleSheet.create({
	topBar: {
		width: win.width,
		height: 50,
		backgroundColor: 'red',
	},
	pageBG: {
		flex: 1,
	},
});