import fs from "fs/promises";
import path from "path";
import { StockExchange } from "@/types";

let stockData: StockExchange[] | null = null;

export async function loadStockData(): Promise<StockExchange[]> {
	if (!stockData) {
		try {
			const filePath = path.join(process.cwd(), "src/data/stock_data.json");
			const jsonData = await fs.readFile(filePath, "utf-8");
			stockData = JSON.parse(jsonData) as StockExchange[];
		} catch (error) {
			throw new Error(`Failed to load stock data with error: ${(error as Error).message}`);
		}
	}
	return stockData;
}
