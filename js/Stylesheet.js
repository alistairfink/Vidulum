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
	controlBackground: {
		margin: 15,
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: 'white',
	},
	controlInner: {
		marginRight: 5, 
		marginLeft: 5,
	},
	textBlockBackground:{
		margin: 15,
		marginTop: 10,
		marginBottom: 10,
		borderBottomWidth: 2,
	},
	titleText: {
		fontSize: 20,
		marginBottom: 10,
		fontWeight: 'bold',
	},
	normalText: {
		fontSize: 15,
		marginBottom: 15,
		marginLeft: 0,
	},
});