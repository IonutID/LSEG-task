# LSEG ChatBot

LSEG ChatBot is a **Next.js** project that provides a chatbot for querying stock prices from various stock exchanges.

I created a simple but well-designed chatbot, keeping in mind that the JSON data might be replaced with a real API in the future. To accommodate this, I created custom API endpoints to retrieve data from the JSON file, which I parsed once and stored in local cache to minimize file reads.

Additionally, I chose to query the API at each step in the chat to ensure the most up-to-date data, in case a live API is used in the future.

I also implemented a basic chat functionality that allows the user to type their response instead of selecting the available option buttons. This ensures flexibility for users who prefer typing over clicking predefined options.

## Live Demo

Try it out here: [LSEG ChatBot](https://lseg-chatbot-mu.vercel.app/)

---

## Getting Started

### Prerequisites

Ensure you have **[Node.js](https://nodejs.org/)** installed on your system.

### Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start the development server:**

    ```bash
    npm run dev
    ```

4. Open **[http://localhost:3000](http://localhost:3000)** in your browser to see the chatbot in action.

---

## Project Structure

```
├── .gitignore
├── .next/
├── package.json
├── postcss.config.mjs
├── public/
├── README.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── exchanges/
│   │   │   │   └── route.ts
│   │   │   ├── exchange-stock/
│   │   │   │   └── route.ts
│   │   │   ├── stock-price/
│   │   │   │   └── route.ts
│   │   ├── components/
│   │   │   ├── Chat.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   └── Message.tsx
│   │   ├── global.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── data/
│   │   └── stock_data.json
│   ├── lib/
│   │   └── loadStockData.ts
│   └── types.ts
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## API Endpoints

The chatbot interacts with the following **API endpoints**:

### Stock Exchanges

-   **GET** `/api/exchanges` → Returns a list of stock exchanges.

### Exchange Stocks

-   **GET** `/api/exchange-stock?exchange={exchangeCode}` → Returns a list of stocks for a given exchange.

### Stock Prices

-   **GET** `/api/stock-price?exchange={exchangeCode}&code={stockCode}` → Returns the stock price for a given stock code and exchange.

---

## Technologies Used

-   **[Next.js](https://nextjs.org/)** – React framework for building web applications.
-   **[React](https://react.dev/)** – JavaScript library for user interfaces.
-   **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework for styling.
-   **[TypeScript](https://www.typescriptlang.org/)** – Strongly typed JavaScript for better maintainability.

---
