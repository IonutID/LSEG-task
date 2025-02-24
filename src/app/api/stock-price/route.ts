import { NextResponse } from "next/server";
import { loadStockData } from "@/lib/loadStockData";
import { StockExchange } from "@/types";

// Function to get the stock price for a given stock code and exchange
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const exchangeCode = searchParams.get("exchange");
	const stockCode = searchParams.get("code");

	if (!exchangeCode || !stockCode) {
		return NextResponse.json({ error: "Exchange and Stock code are required" }, { status: 400 });
	}

	try {
		const data: StockExchange[] = await loadStockData();
		const exchange = data.find((ex) => ex.code === exchangeCode);

		if (!exchange) {
			return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
		}

		const stock = exchange.stocks.find((s) => s.code === stockCode);
		if (!stock) {
			return NextResponse.json({ error: "Stock not found in this exchange" }, { status: 404 });
		}

		return NextResponse.json({ stockCode, price: stock.price, exchange: exchange.stockExchange });
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
