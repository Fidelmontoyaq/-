import React from 'react';

export default function Board({ cells, handleCellClick, playerIcons, winningLine, glowingCells, removalIndex }) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-[10px] bg-[#ccc] p-[10px] rounded-[8px] w-full max-w-[320px] aspect-square relative z-10">
      
      <style>{`
        /* ✨ EFECTO DE RESPLANDOR CRISTALINO DE VICTORIA CHILLONA */
        @keyframes neonGlow {
          0% { filter: brightness(1) saturate(1.2); }
          50% { filter: brightness(1.8) saturate(2); }
          100% { filter: brightness(1.3) saturate(1.5); }
        }
        .animate-neon-glow {
          animation: neonGlow 0.4s ease-out infinite alternate;
        }

        /* 🍊 ADVERTENCIA KEIKO (PRE-ELIMINACIÓN) */
        @keyframes pulseBorderOrange {
          0%, 100% { border-color: #ff5500; box-shadow: inset 0 0 8px #ff5500, 0 0 12px #ff5500; transform: scale(1); }
          50% { border-color: #ff2200; box-shadow: inset 0 0 22px #ff2200, 0 0 30px #ff2200; transform: scale(0.96); }
        }
        .animate-pulse-amber { animation: pulseBorderOrange 1s infinite ease-in-out !important; border-width: 5px !important; }

        /* 🍏 ADVERTENCIA ROBERTO (PRE-ELIMINACIÓN) */
        @keyframes pulseBorderGreen {
          0%, 100% { border-color: #39ff14; box-shadow: inset 0 0 8px #39ff14, 0 0 12px #39ff14; transform: scale(1); }
          50% { border-color: #00ff66; box-shadow: inset 0 0 20px #00ff66, 0 0 28px #00ff66; transform: scale(0.96); }
        }
        .animate-pulse-green { animation: pulseBorderGreen 1s infinite ease-in-out !important; border-width: 5px !important; }
      `}</style>

      {cells.map((cell, index) => {
        const isWinner = winningLine && winningLine.includes(index);
        const isGlowing = glowingCells.includes(index);
        const isPreviewRemove = index === removalIndex;
        const icon = playerIcons[cell];

        // Bordes estables
        let borderStyle = "border-2 border-[#999]";
        if (cell === 'X') borderStyle = "border-[4px] border-[#FF6600]";
        if (cell === 'O') borderStyle = "border-[4px] border-[#00A859]";

        let removalAnimationClass = "";
        if (isPreviewRemove) {
          removalAnimationClass = cell === 'X' ? 'animate-pulse-amber z-10' : 'animate-pulse-green z-10';
        }

        // Si la celda está en su turno de encendido secuencial de victoria
        let neonWinnerStyle = {};
        let neonClass = "";
        if (isWinner && isGlowing) {
          neonClass = "animate-neon-glow z-20 scale-105";
          // Usamos colores súper radioactivos / chillones
          neonWinnerStyle = {
            backgroundColor: cell === 'X' ? '#ff3c00' : '#26ff05',
            boxShadow: cell === 'X' ? '0 0 35px #ff5500, inset 0 0 15px #ffffff' : '0 0 35px #39ff14, inset 0 0 15px #ffffff',
            borderColor: '#ffffff'
          };
        }

        return (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            className={`relative bg-white rounded-[8px] flex items-center justify-center overflow-hidden cursor-pointer box-border aspect-square transition-all duration-300 ${borderStyle}
              ${removalAnimationClass} ${neonClass}
            `}
            style={neonWinnerStyle}
          >
            {/* Capa de tinte translúcido antes de que le toque brillar */}
            {isWinner && !isGlowing && (
              <div className="absolute inset-0 opacity-[0.4] z-10" style={{ backgroundColor: icon?.color }} />
            )}

            {/* Contenido (Foto del Avatar) */}
            <div className={`w-full h-full flex items-center justify-center z-0 transition-transform ${isWinner && isGlowing ? 'scale-110' : ''}`}>
              {cell && (
                <img src={icon.value} alt={cell} className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}