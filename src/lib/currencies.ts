// lib/currencies.ts

export interface Currency {
	code: string;
	symbol: string;
	symbolNative: string;
	name: string;
	decimalDigits: number;
	namePlural: string;
  }
  
  // Most used worldwide currencies
  export const COMMON_CURRENCIES = [
	'USD', 'EUR', 'GBP', 'JPY', 'CNY', 
	'NGN', 'ZAR', 'GHS', 'EGP', 'XOF'
  ];
  
  export const currencies: { [key: string]: Currency } = {
	// Top 10 Worldwide Currencies
	"USD": {
	  "code": "USD",
	  "symbol": "$",
	  "symbolNative": "$",
	  "name": "US Dollar",
	  "decimalDigits": 2,
	  "namePlural": "US dollars"
	},
	"EUR": {
	  "code": "EUR",
	  "symbol": "€",
	  "symbolNative": "€",
	  "name": "Euro",
	  "decimalDigits": 2,
	  "namePlural": "euros"
	},
	"GBP": {
	  "code": "GBP",
	  "symbol": "£",
	  "symbolNative": "£",
	  "name": "British Pound",
	  "decimalDigits": 2,
	  "namePlural": "British pounds"
	},
	"JPY": {
	  "code": "JPY",
	  "symbol": "¥",
	  "symbolNative": "￥",
	  "name": "Japanese Yen",
	  "decimalDigits": 0,
	  "namePlural": "Japanese yen"
	},
	"CNY": {
	  "code": "CNY",
	  "symbol": "¥",
	  "symbolNative": "￥",
	  "name": "Chinese Yuan",
	  "decimalDigits": 2,
	  "namePlural": "Chinese yuan"
	},
	"AUD": {
	  "code": "AUD",
	  "symbol": "A$",
	  "symbolNative": "$",
	  "name": "Australian Dollar",
	  "decimalDigits": 2,
	  "namePlural": "Australian dollars"
	},
	"CAD": {
	  "code": "CAD",
	  "symbol": "CA$",
	  "symbolNative": "$",
	  "name": "Canadian Dollar",
	  "decimalDigits": 2,
	  "namePlural": "Canadian dollars"
	},
	"CHF": {
	  "code": "CHF",
	  "symbol": "CHF",
	  "symbolNative": "CHF",
	  "name": "Swiss Franc",
	  "decimalDigits": 2,
	  "namePlural": "Swiss francs"
	},
	"HKD": {
	  "code": "HKD",
	  "symbol": "HK$",
	  "symbolNative": "$",
	  "name": "Hong Kong Dollar",
	  "decimalDigits": 2,
	  "namePlural": "Hong Kong dollars"
	},
	"SGD": {
	  "code": "SGD",
	  "symbol": "S$",
	  "symbolNative": "$",
	  "name": "Singapore Dollar",
	  "decimalDigits": 2,
	  "namePlural": "Singapore dollars"
	},
  
	// Top 10 African Currencies
	"NGN": {
	  "code": "NGN",
	  "symbol": "₦",
	  "symbolNative": "₦",
	  "name": "Nigerian Naira",
	  "decimalDigits": 2,
	  "namePlural": "Nigerian naira"
	},
	"ZAR": {
	  "code": "ZAR",
	  "symbol": "R",
	  "symbolNative": "R",
	  "name": "South African Rand",
	  "decimalDigits": 2,
	  "namePlural": "South African rand"
	},
	"GHS": {
	  "code": "GHS",
	  "symbol": "GH₵",
	  "symbolNative": "₵",
	  "name": "Ghanaian Cedi",
	  "decimalDigits": 2,
	  "namePlural": "Ghanaian cedis"
	},
	"EGP": {
	  "code": "EGP",
	  "symbol": "EGP",
	  "symbolNative": "ج.م.",
	  "name": "Egyptian Pound",
	  "decimalDigits": 2,
	  "namePlural": "Egyptian pounds"
	},
	"XOF": {
	  "code": "XOF",
	  "symbol": "CFA",
	  "symbolNative": "CFA",
	  "name": "West African CFA Franc",
	  "decimalDigits": 0,
	  "namePlural": "West African CFA francs"
	},
	"MAD": {
	  "code": "MAD",
	  "symbol": "MAD",
	  "symbolNative": "د.م.",
	  "name": "Moroccan Dirham",
	  "decimalDigits": 2,
	  "namePlural": "Moroccan dirhams"
	},
	"KES": {
	  "code": "KES",
	  "symbol": "Ksh",
	  "symbolNative": "Ksh",
	  "name": "Kenyan Shilling",
	  "decimalDigits": 2,
	  "namePlural": "Kenyan shillings"
	},
	"XAF": {
	  "code": "XAF",
	  "symbol": "FCFA",
	  "symbolNative": "FCFA",
	  "name": "Central African CFA Franc",
	  "decimalDigits": 0,
	  "namePlural": "Central African CFA francs"
	},
	"TND": {
	  "code": "TND",
	  "symbol": "DT",
	  "symbolNative": "د.ت",
	  "name": "Tunisian Dinar",
	  "decimalDigits": 3,
	  "namePlural": "Tunisian dinars"
	},
	"DZD": {
	  "code": "DZD",
	  "symbol": "DA",
	  "symbolNative": "د.ج",
	  "name": "Algerian Dinar",
	  "decimalDigits": 2,
	  "namePlural": "Algerian dinars"
	}
  }