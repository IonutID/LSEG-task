import { NextResponse } from "next/server";
import { loadStockData } from "@/lib/loadStockData";
import { StockExchange } from "@/types";

// Function to get the list of stocks for a given exchange
export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const exchangeCode = searchParams.get("exchange");

	if (!exchangeCode) {
		return NextResponse.json({ error: "Exchange code is required" }, { status: 400 });
	}

	try {
		const data: StockExchange[] = await loadStockData();
		const exchange = data.find((ex) => ex.code === exchangeCode);

		if (!exchange) {
			return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
		}

		return NextResponse.json(exchange.stocks);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
