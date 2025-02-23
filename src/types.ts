export interface Stock {
	code: string;
	stocks: string;
	price: number;
}

export interface StockExchange {
	code: string;
	stockExchange: string;
	stocks: Stock[];
}
