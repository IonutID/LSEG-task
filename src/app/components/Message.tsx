import React, { JSX } from "react";
import { FaRobot } from "react-icons/fa";

interface MessageProps {
	sender: "bot" | "user";
	text: string;
	buttons?: JSX.Element;
}

export default function Message({ sender, text, buttons }: MessageProps) {
	return (
		<div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} items-end w-max-[200px] mb-2 gap-2`}>
			{sender === "bot" && (
				<div className="w-10 h-10 flex items-center justify-center bg-[#e9f6ff] rounded-full">
					<FaRobot className="text-[#031efe]" size={20} />
				</div>
			)}

			<div className={`p-3 rounded-lg max-w-lg text-black ${sender === "user" ? "bg-[#f2f2f2]" : "bg-[#e9f6ff]"}`}>
				<p>{text}</p>
				{buttons && <div className="mt-2">{buttons}</div>}
			</div>
		</div>
	);
}
