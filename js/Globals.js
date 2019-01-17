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
		loggedIn: false, 
		email: '',
	},
	UpdateSettings: function(newSettings) {
		this.DefaultSettings = newSettings;
	},
	openingRefresh: true,
	UpdateOpeningRefresh: function() {
		this.openingRefresh = false;
	},
	currChanged: false,
	changeCurr: function() {
		this.currChanged = !this.currChanged;
	},
	alistairfinkApiKey: '',
	StorageNames: {
		settings: 'Settings',
		wallets: 'WalletList',
		walletData: 'WalletData',
		pass: 'PasswordPin',
		key: 'Key',
	},
	cryptoAddrs: {
	  Bitcoin: "1JVwvYNWFnsxfM4CukvMyU8NxxjeY5FNoE",
	  Ethereum: "0xAD54cB2fD6d207CBee71524632748B9a51e8793D",
	  Litecoin: "LePq7JCwnLaEmy2wooJuhiWhiu1vuuDCwx",
	  Dogecoin: "DHY7dKDHmutA4NRNzwTzjkpQHCKdVdQG2z",
	},
	ApiEndPoints: {
		ethplorer: 'https://api.alistairfink.com/vidulum/ethplorer',
		validate: 'https://api.alistairfink.com/vidulum/validate',
		feedback: 'https://api.alistairfink.com/vidulum/feedback',
		coinMarketCap: 'https://api.coinmarketcap.com/v1/ticker/',
		blockExplorer: 'https://blockexplorer.com/api/addr/',
		bitcoinChain: 'https://api-r.bitcoinchain.com/v1/address/txs/',
		alistairFinkSignUp: 'https://api.alistairfink.com/vidulum/signUp',
		alistairFinkSignIn: 'https://api.alistairfink.com/vidulum/signIn',
		alistairFinkSignOut: 'https://api.alistairfink.com/vidulum/signOut',
		alistairFinkBackup: 'https://api.alistairfink.com/vidulum/backup',
		alistairFinkRestore: 'https://api.alistairfink.com/vidulum/restore',
	}
};