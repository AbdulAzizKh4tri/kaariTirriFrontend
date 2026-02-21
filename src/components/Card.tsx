const Card = ({ theme, socket, suit, number, disabled, count }) => {
  const handleClick = () => {
    if (!disabled) socket.emit('cardPlayed', { suit, number });
  };

  const rows = Math.ceil(count / 7);
  const cardHeight = rows === 1 ? 'calc(100% - 0.5rem)' : 'calc(50% - 0.5rem)';

  return (
    <img
		onClick={handleClick}
		src={`/assets/cards/${theme}/${suit.toLowerCase()}/${number.toLowerCase()}.png`}
		alt={`${number} of ${suit}`}
		style={{ 
		  height: rows === 1 ? 'calc(100% - 0.5rem)' : 'calc(50% - 0.5rem)', 
		  width: 'calc(100% / 7 - 0.25rem)',
		  objectFit: 'contain'
		}}
		className={`${disabled ? 'pointer-events-none opacity-70' : 'cursor-pointer hover:-translate-y-2 transition-transform'} drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)] drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]`}
    />
  );
};

export default Card;
