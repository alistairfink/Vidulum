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
		flexDirection: 'row', 
	},
	pageBG: {
		flex: 1,
	},
	leftIcon: {
	    height:32,
	    width:32,
	    marginLeft: 7,
	    marginTop: 10,
	    marginRight: 7,
	},
	title: {
		fontSize: 30, 
		marginLeft: 15,
		color: 'white', 
		alignSelf: 'center', 
		fontWeight: 'bold',
	},
	rightIconSet: {
		flex: 1, 
		flexDirection: 'row-reverse', 
	},
	rightIcon: {
	    height:32,
	    width:32,
	    marginTop: 10,
	    marginRight: 18,
	},
});