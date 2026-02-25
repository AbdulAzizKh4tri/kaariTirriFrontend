import { useEffect, useRef, useState } from 'react';

const ChatBox = ({ socket, user, systemMessages, userMessages }) => {
    const [input, setInput] = useState('');
    const systemEndRef = useRef(null);
    const userEndRef = useRef(null);

	const nameToColor = (name) => {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		const min = 30, max = 270;
		const h = min + (Math.abs(hash) % (max - min));
		return `hsl(${h}, 70%, 65%)`;
	};

    useEffect(() => {
        systemEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [systemMessages]);

    useEffect(() => {
        userEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [userMessages]);

    const sendMessage = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        socket?.emit('userMessage', trimmed);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="h-full flex flex-col gap-1 text-[#fcfdfc] text-[1.2vw]">
            <div className="h-[20%] overflow-y-auto bg-[#2c3839] rounded-lg p-1 [scrollbar-width:thin]">
                {systemMessages.map((msg, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-[#3d4f50] my-[2px]" />}
                        <div className="text-[#aaaaaa] text-[0.9vw] break-words">{msg}</div>
                    </div>
                ))}
                <div ref={systemEndRef} />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto bg-[#2c3839] rounded-lg p-1 [scrollbar-width:thin]">
                {userMessages.map((msg, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-[#3d4f50] my-[2px]" />}
                        <div className="break-words">
							<span className="font-bold" style={{ color: nameToColor(msg.name) }}>
								{msg.name}:
							</span>
                            {msg.message}
                        </div>
                    </div>
                ))}
                <div ref={userEndRef} />
            </div>

            <div className="flex gap-1 shrink-0">
                <input
                    className="flex-1 bg-[#2c3839] rounded-lg px-2 py-1 text-[#fcfdfc] outline-none text-[1vw] placeholder-[#666]"
                    placeholder="Message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#0092ff] hover:bg-[#007acc] rounded-lg px-2 py-1 text-white text-[1vw] shrink-0"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
