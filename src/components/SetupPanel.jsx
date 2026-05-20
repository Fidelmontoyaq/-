import React from 'react';

export default function SetupPanel({ playerIcons, setPlayerIcons }) {
  
  const handleFileChange = (e, player) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPlayerIcons(prev => ({
          ...prev,
          [player]: {
            ...prev[player],
            type: 'img',
            value: ev.target.result // Guarda el archivo base64 cargado
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-[15px] rounded-[12px] flex gap-[20px] mb-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      {['X', 'O'].map((player) => (
        <div key={player} className="flex flex-col items-center gap-[5px]">
          <div 
            className="w-[45px] h-[45px] rounded-full bg-[#eee] border-2 overflow-hidden flex items-center justify-center font-bold"
            style={{ borderColor: playerIcons[player].color }}
          >
            {playerIcons[player].type === 'img' ? (
              <img src={playerIcons[player].value} alt={player} className="w-full h-full object-cover" />
            ) : (
              <span style={{ color: playerIcons[player].color }}>{player}</span>
            )}
          </div>
          <label className="text-[11px] cursor-pointer text-blue-600 underline">
            Foto {player}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, player)} 
            />
          </label>
        </div>
      ))}
    </div>
  );
}