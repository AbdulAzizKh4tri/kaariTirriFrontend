import { useEffect, useRef, useState } from 'react';

const ChatBox = ({ socket, user, systemMessages, userMessages }) => {
    const [input, setInput] = useState('');
    const [activeChat, setActiveChat] = useState('user');
    const chatEndRef = useRef(null);

    const nameToColor = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const min = 30, max = 270;
        const h = min + (Math.abs(hash) % (max - min));
        return `hsl(${h}, 70%, 65%)`;
    };

    const messages = activeChat === 'system' ? systemMessages : userMessages;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChat]);

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
        <div className="h-full min-h-0 flex flex-col gap-1 text-[#fcfdfc] text-[1.2vw]">

            {/* Chat toggle */}
            <div className="flex shrink-0 gap-1">
                {['user', 'system'].map(chat => (
                    <button
                        key={chat}
                        onClick={() => setActiveChat(chat)}
                        className={`flex-1 rounded-md py-[2px] text-[0.85vw] transition-colors ${
                            activeChat === chat
                                ? 'bg-[#0092ff] text-white'
                                : 'bg-[#2c3839] text-[#aaaaaa] hover:bg-[#3d4f50]'
                        }`}
                    >
                        {chat === 'user' ? 'User Chat' : 'System Chat'}
                    </button>
                ))}
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto bg-[#2c3839] rounded-lg p-1 [scrollbar-width:thin]">
                {messages.map((msg, i) => (
                    <div key={i}>
                        {i > 0 && <hr className="border-[#3d4f50] my-[2px]" />}

                        {activeChat === 'system' ? (
                            <div className="text-[#aaaaaa] text-[0.9vw] break-words">
                                {msg}
                            </div>
                        ) : (
                            <div className="break-words">
                                <span
                                    className="font-bold"
                                    style={{ color: nameToColor(msg.name) }}
                                >
                                    {msg.name}:
                                </span>{' '}
                                {msg.message}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-1 shrink-0">
                <input
                    className="flex-1 min-w-0 bg-[#2c3839] rounded-lg px-2 py-1 text-[#fcfdfc] outline-none text-[1vw] placeholder-[#666]"
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
