import { useState } from "react";
import { IoMdSend } from "react-icons/io";

interface Props {
	onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: Props) {
	const [input, setInput] = useState("");

	// triming the input and checking if it is not empty before sending the message
	const handleSend = () => {
		if (input.trim() !== "") {
			onSendMessage(input);
			setInput("");
		}
	};

	return (
		<div className="p-2 border-t flex items-center bg-[#eeeeee]">
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="flex-1 bg-[#eeeeee] px-1 h-auto border-none focus:outline-none"
				placeholder="Please pick an option or type your response..."
				onKeyDown={(e) => e.key === "Enter" && handleSend()}
			/>
			<button
				onClick={handleSend}
				className="rounded-full hover:bg-[#8c8c8c] transition-colors duration-200 ease-in-out flex items-center justify-center h-10 w-10"
			>
				<IoMdSend size={20} />
			</button>
		</div>
	);
}
