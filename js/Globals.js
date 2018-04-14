import { 
  AsyncStorage,
} from 'react-native';

module.exports = {
	DefaultSettings: {
		theme: {
          name: 'Light',
          primaryColour: '#bdbdbd',
          lightColour: '#efefef',
          darkColour: '#8d8d8d',
          backgroundColour: 'white',
          textColour: 'black',
		},
		walletLock: false,
		currency: 'USD',
		symbol: '$',
		reloadOnOpen: true,
	},
	UpdateSettings: function(newSettings) {
		this.DefaultSettings = newSettings;
	},
	openingRefresh: true,
	UpdateOpeningRefresh: function() {
		this.openingRefresh = false;
	},
	StorageNames: {
		settings: 'Settings',
		wallets: 'WalletList',
		walletData: 'WalletData',
	},
};