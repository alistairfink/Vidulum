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
          textColour: '#000000',
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
		pass: 'PasswordPin',
	},
	ApiEndPoints: {
		ethplorer: 'http://memes.alistairfink.com/VidulumApi/ethplorer',
		validate: 'http://memes.alistairfink.com/VidulumApi/validate',
		feedback: 'http://memes.alistairfink.com/VidulumApi/feedback',
		coinMarketCap: 'https://api.coinmarketcap.com/v1/ticker/',
		blockExplorer: 'https://blockexplorer.com/api/addr/',
		bitcoinChain: 'https://api-r.bitcoinchain.com/v1/address/txs/',
	}
};