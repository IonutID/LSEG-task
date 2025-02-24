import { NextResponse } from "next/server";
import { StockExchange } from "@/types";
import { loadStockData } from "@/lib/loadStockData";

// Function to get the list of stock exchanges
export async function GET() {
	try {
		const data: StockExchange[] = await loadStockData();
		const exchanges = data.map((exchange) => ({
			code: exchange.code,
			stockExchange: exchange.stockExchange,
		}));

		return NextResponse.json(exchanges);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
