import { useState, useEffect, useRef, JSX, useCallback } from "react";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { StockExchange, Stock } from "@/types";
import { FaRobot } from "react-icons/fa";

export default function Chat() {
	const [messages, setMessages] = useState<{ sender: "bot" | "user"; text: string; buttons?: JSX.Element }[]>([]);
	const [exchanges, setExchanges] = useState<StockExchange[]>([]);
	const [stocks, setStocks] = useState<Stock[]>([]);
	const lastSelectedExchange = useRef<StockExchange | null>(null);
	const lastSelectedStock = useRef<Stock | null>(null);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const handleGoBackRef = useRef<() => void>(() => {});
	const handleMainMenuRef = useRef<() => void>(() => {});
	const handleStockSelectRef = useRef<(stock: Stock) => void>(() => {});

	// Function to handle the selection of an exchange and display the message with the available stocks
	const handleExchangeSelect = useCallback(
		(exchange: StockExchange) => {
			lastSelectedExchange.current = exchange;

			fetch(`/api/exchange-stock?exchange=${exchange.code}`)
				.then((res) => res.json())
				.then((data) => {
					setStocks(data);
					setMessages((prev) => [
						...prev,
						{
							sender: "bot",
							text: `You selected ${exchange.stockExchange}. Please select a stock from the list below:`,
							buttons: (
								<div className="flex flex-col gap-1">
									{data.map((stock: Stock) => (
										<button
											key={stock.code}
											onClick={() => handleStockSelectRef.current(stock)}
											className="bg-white border-black/[.08] text-black px-4 py-2 rounded-lg w-full"
										>
											{stock.stocks}
										</button>
									))}
									<button onClick={handleGoBackRef.current} className="bg-white border-black/[.08] text-gray-500 px-4 py-2 rounded-lg w-full">
										Back
									</button>
									<button
										onClick={handleMainMenuRef.current}
										className="bg-white border-black/[.08] text-red-500 px-4 py-2 rounded-lg w-full"
									>
										Main Menu
									</button>
								</div>
							),
						},
					]);
				})
				.catch(() => console.error("Failed to load stocks"));
		},
		[handleMainMenuRef]
	);

	// Function to display the available stock exchanges
	const showExchangeOptions = useCallback(
		(exchangeList: StockExchange[]) => {
			setMessages((prev) => [
				...prev,
				{
					sender: "bot",
					text: "Please select a stock exchange.",
					buttons: (
						<div className="flex flex-col gap-1">
							{exchangeList.map((exchange) => (
								<button
									key={exchange.code}
									onClick={() => handleExchangeSelect(exchange)}
									className="bg-white border-black/[.08] text-black px-4 py-2 rounded-lg w-full"
								>
									{exchange.stockExchange}
								</button>
							))}
						</div>
					),
				},
			]);
		},
		[handleExchangeSelect]
	);

	// Fetch the list of exchanges when the component is mounted
	useEffect(() => {
		fetch("/api/exchanges")
			.then((res) => res.json())
			.then((data) => {
				setExchanges(data);
				showExchangeOptions(data);
			})
			.catch(() => console.error("Failed to load exchanges"));
	}, [showExchangeOptions]);

	// Scroll to the end of the chat when a new message is added
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Function to clean the user input
	const cleanInput = (input: string) =>
		input
			.trim()
			.replace(/[^\w\s]/gi, "")
			.toLowerCase();

	// Function to find the matching exchange based on the user input and return the exchange object, you can search by code, name, first word, or first two letters of the code or name
	const findMatchingExchange = (input: string) => {
		const cleanedInput = cleanInput(input);
		return exchanges.find((exchange) => {
			const exchangeName = cleanInput(exchange.stockExchange);
			const firstWord = cleanInput(exchange.stockExchange.split(" ")[0]);
			const firstTwoLetters = cleanInput(exchange.code.substring(0, 2));

			return (
				cleanInput(exchange.code) === cleanedInput ||
				exchangeName === cleanedInput ||
				firstWord === cleanedInput ||
				firstTwoLetters === cleanedInput ||
				exchangeName.includes(cleanedInput)
			);
		});
	};

	// Function to find the matching stock based on the user input and return the stock object, you can search by code, name, first word, or part of the name
	const findMatchingStock = (input: string) => {
		const cleanedInput = cleanInput(input);
		return stocks.find((stock) => {
			const stockName = cleanInput(stock.stocks);
			const firstWord = cleanInput(stock.stocks.split(" ")[0]);

			return cleanInput(stock.code) === cleanedInput || stockName === cleanedInput || firstWord === cleanedInput || stockName.includes(cleanedInput);
		});
	};

	// Function to handle the user input and display the appropriate message based on the input and the current state
	const handleUserInput = (input: string) => {
		const cleanedInput = cleanInput(input);
		setMessages((prev) => [...prev, { sender: "user", text: input }]);

		if (cleanedInput === "back") {
			handleGoBackRef.current();
		} else if (cleanedInput === "main menu" || cleanedInput === "mainmenu" || cleanedInput === "main" || cleanedInput == "menu") {
			handleMainMenu();
		} else if (!lastSelectedExchange.current) {
			const exchange = findMatchingExchange(cleanedInput);
			if (exchange) {
				handleExchangeSelect(exchange);
			} else {
				setMessages((prev) => [...prev, { sender: "bot", text: "Invalid exchange. Please select from the available options." }]);
			}
		} else if (!lastSelectedStock.current) {
			const stock = findMatchingStock(cleanedInput);
			if (stock) {
				handleStockSelectRef.current(stock);
			} else {
				setMessages((prev) => [...prev, { sender: "bot", text: "Invalid stock. Please type or select one of the available stock codes." }]);
			}
		} else {
			setMessages((prev) => [...prev, { sender: "bot", text: "Type 'Back' to choose another stock or 'Main Menu' to restart selection." }]);
		}
	};

	// Function to handle the main menu option and reset the state
	// I choose to make a new request to simulate a real app where the data might change
	const handleMainMenu = useCallback(() => {
		setStocks([]);
		fetch("/api/exchanges")
			.then((res) => res.json())
			.then((data) => {
				setExchanges(data);
				showExchangeOptions(data);
			})
			.catch(() => console.error("Failed to load exchanges"));

		lastSelectedExchange.current = null;
		lastSelectedStock.current = null;
	}, [showExchangeOptions]);

	// Function to handle the go back option and reset the state
	// I choose to make a new request to simulate a real app where the data might change
	const handleGoBack = useCallback(() => {
		if (lastSelectedStock.current) {
			fetch(`/api/exchange-stock?exchange=${lastSelectedExchange.current?.code}`)
				.then((res) => res.json())
				.then((data) => {
					setStocks(data);
					setMessages((prev) => [
						...prev,
						{
							sender: "bot",
							text: `You selected ${lastSelectedExchange.current?.stockExchange}. Please select a stock from the list below:`,
							buttons: (
								<div className="flex flex-col gap-1">
									{data.map((stock: Stock) => (
										<button
											key={stock.code}
											onClick={() => handleStockSelectRef.current(stock)}
											className="bg-white border-black/[.08] text-black px-4 py-2 rounded-lg w-full"
										>
											{stock.stocks}
										</button>
									))}
									<button onClick={handleGoBackRef.current} className="bg-white border-black/[.08] text-gray-500 px-4 py-2 rounded-lg w-full">
										Back
									</button>
									<button onClick={handleMainMenu} className="bg-white border-black/[.08] text-red-500 px-4 py-2 rounded-lg w-full">
										Main Menu
									</button>
								</div>
							),
						},
					]);
				})
				.catch(() => console.error("Failed to load stocks"));
			lastSelectedStock.current = null;
		} else {
			setStocks([]);
			fetch("/api/exchanges")
				.then((res) => res.json())
				.then((data) => {
					setExchanges(data);
					showExchangeOptions(data);
				})
				.catch(() => console.error("Failed to load exchanges"));
		}
	}, [showExchangeOptions, handleMainMenu]);

	// Function to handle the selection of a stock and display the message with the stock price
	// I choose to make a new request to simulate a real app where the data might change even though I aleardy got the price when i got all the stocks
	const handleStockSelect = useCallback(
		(stock: Stock) => {
			lastSelectedStock.current = stock;

			fetch(`/api/stock-price?exchange=${lastSelectedExchange.current?.code}&code=${stock.code}`)
				.then((res) => res.json())
				.then((data) => {
					setMessages((prev) => [
						...prev,
						{
							sender: "bot",
							text: `The price of ${stock.stocks} is $${data.price}. You can go to the main menu or go back to select another stock.`,
							buttons: (
								<div className="flex flex-col gap-1">
									<button onClick={handleGoBackRef.current} className="bg-white border-black/[.08] text-gray-500 px-4 py-2 rounded-lg w-full">
										Back
									</button>
									<button onClick={handleMainMenu} className="bg-white border-black/[.08] text-red-500 px-4 py-2 rounded-lg w-full">
										Main Menu
									</button>
								</div>
							),
						},
					]);
				})
				.catch(() => console.error("Failed to fetch stock price"));
		},
		[handleMainMenu]
	);

	// Update refs with the latest function definitions
	handleGoBackRef.current = handleGoBack;
	handleMainMenuRef.current = handleMainMenu;
	handleStockSelectRef.current = handleStockSelect;

	return (
		<div className="flex flex-col h-screen bg-white w-full">
			<div className="flex items-center gap-2 bg-[#031efe] w-full p-4 h-16 rounded-t-xl">
				<FaRobot size={30} color="white" className="ml-2 mb-1" />
				<h1 className="text-white text-xl"> LSEG ChatBot</h1>
			</div>
			<div className="flex-1 overflow-y-auto space-y-4 p-2">
				{messages.map((msg, index) => (
					<Message key={index} sender={msg.sender} text={msg.text} buttons={msg.buttons} />
				))}
				<div ref={chatEndRef}></div>
			</div>
			<ChatInput onSendMessage={handleUserInput} />
		</div>
	);
}
