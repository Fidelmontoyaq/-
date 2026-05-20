import React, { useState, useRef, useEffect } from 'react';
import Board from './components/Board';
import SetupPanel from './components/SetupPanel';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function App() {
  // Registra el service worker de la PWA
  useRegisterSW({ immediate: true });

  const [playerIcons, setPlayerIcons] = useState({
    X: { type: 'img', value: '/img/keiko.png', color: '#FF6600', label: 'Keiko' },
    O: { type: 'img', value: '/img/roberto.png', color: '#00A859', label: 'Roberto' }
  });

  const [cells, setCells] = useState(Array(9).fill(''));
  const [movesX, setMovesX] = useState([]);
  const [movesO, setMovesO] = useState([]);
  const [turn, setTurn] = useState('X');
  const [active, setActive] = useState(true);
  
  // Estados de animación final
  const [winningLine, setWinningLine] = useState(null);
  const [glowingCells, setGlowingCells] = useState([]); 
  const [showWinnerPodium, setShowWinnerPodium] = useState(false); 
  const [gameWinner, setGameWinner] = useState(null);

  // 🚨 ESTADOS PARA EL BOTÓN DE INSTALACIÓN PERSONALIZADO
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  const audioCtxRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Escuchar el evento de instalación del navegador
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Evita que el navegador ponga su aviso nativo clásico
      e.preventDefault();
      // Guarda el evento para usarlo cuando presionen nuestro botón
      setDeferredPrompt(e);
      // Muestra nuestro botón personalizado en la pantalla
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Si la app ya se instaló con éxito, esconde el botón de inmediato
    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
      console.log('¡Michi Político instalado con éxito!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Función para activar la instalación manual al dar clic
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Muestra la ventana oficial del sistema para confirmar instalación
    deferredPrompt.prompt();
    // Espera la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('El usuario aceptó la instalación.');
    }
    // Limpiamos el evento y destruimos el botón para siempre
    setDeferredPrompt(null);
    setShowInstallBtn(false);
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playSound = (freq, duration = 0.15, type = 'triangle', volume = 0.7) => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(volume, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log(e);
    }
  };

  const playResetSound = () => {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => playSound(freq, 0.4, 'triangle', 0.4), i * 70);
    });
  };

  const playWinnerSong = (winner) => {
    if (winner === 'X') {
      const keikoMelody = [
        { f: 523.25, d: 0.2 }, { f: 523.25, d: 0.2 }, { f: 523.25, d: 0.2 }, 
        { f: 659.25, d: 0.4 }, { f: 587.33, d: 0.2 }, { f: 659.25, d: 0.2 }, 
        { f: 783.99, d: 0.6 }, { f: 1046.50, d: 0.8 }
      ];
      keikoMelody.forEach((note, i) => {
        setTimeout(() => playSound(note.f, note.d, 'triangle', 0.8), i * 180);
      });
    } else {
      const robertoMelody = [
        { f: 587.33, d: 0.25 }, { f: 659.25, d: 0.25 }, { f: 783.99, d: 0.25 },
        { f: 783.99, d: 0.4 },  { f: 659.25, d: 0.25 }, { f: 587.33, d: 0.25 },
        { f: 493.88, d: 0.4 },  { f: 440.00, d: 0.6 }
      ];
      robertoMelody.forEach((note, i) => {
        setTimeout(() => playSound(note.f, note.d, 'triangle', 0.8), i * 220);
      });
    }
  };

  useEffect(() => {
    if (showWinnerPodium && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const colors = ['#FF5500', '#39ff14', '#FFCC00', '#FFFFFF'];
      const particles = [];

      for (let i = 0; i < 120; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          r: Math.random() * 6 + 4,
          d: Math.random() * canvas.height,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.random() * 10 - 5,
          tiltAngleIncremental: Math.random() * 0.07 + 0.02,
          tiltAngle: 0,
          isSerpentina: Math.random() > 0.6, 
          length: Math.random() * 20 + 15
        });
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, index) => {
          p.tiltAngle += p.tiltAngleIncremental;
          p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
          p.x += Math.sin(p.tiltAngle);
          p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

          ctx.beginPath();
          ctx.lineWidth = p.r / 2;
          ctx.strokeStyle = p.color;
          ctx.fillStyle = p.color;

          if (p.isSerpentina) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.length);
            ctx.stroke();
          } else {
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.lineTo(p.x + p.r, p.y + p.tilt);
            ctx.lineTo(p.x + p.r / 2, p.y);
            ctx.fill();
          }

          if (p.y > canvas.height) {
            particles[index] = { ...p, x: Math.random() * canvas.width, y: -20, tilt: Math.random() * 10 - 5 };
          }
        });
        animationFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [showWinnerPodium]);

  const checkWinner = (boardState) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      if (boardState[line[0]] && boardState[line[0]] === boardState[line[1]] && boardState[line[0]] === boardState[line[2]]) {
        return line;
      }
    }
    return null;
  };

  const handleCellClick = async (index) => {
    if (!active || cells[index] !== '') return;
    initAudio();
    playSound(600, 0.08, 'triangle', 0.5);

    const newCells = [...cells];
    newCells[index] = turn;

    let currentMoves = turn === 'X' ? [...movesX, index] : [...movesO, index];
    if (currentMoves.length > 3) {
      const oldestIndex = currentMoves.shift();
      newCells[oldestIndex] = '';
    }

    if (turn === 'X') setMovesX(currentMoves);
    else setMovesO(currentMoves);

    setCells(newCells);

    const win = checkWinner(newCells);
    if (win) {
      setActive(false);
      setWinningLine(win);
      setGameWinner(turn);
      
      win.forEach((idx, i) => {
        setTimeout(() => {
          setGlowingCells(prev => [...prev, idx]);
          playSound(523.25 + (i * 150), 0.3, 'triangle', 0.8);
        }, i * 500); 
      });

      setTimeout(() => {
        setShowWinnerPodium(true);
        playWinnerSong(turn); 
      }, (win.length * 500) + 200);

      return;
    }

    setTurn(turn === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    initAudio();
    playResetSound();
    setCells(Array(9).fill(''));
    setMovesX([]);
    setMovesO([]);
    setTurn('X');
    setActive(true);
    setWinningLine(null);
    setGlowingCells([]);
    setShowWinnerPodium(false);
    setGameWinner(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      <SetupPanel playerIcons={playerIcons} setPlayerIcons={setPlayerIcons} />
      
      <div 
        className="text-xl font-bold mb-4 px-6 py-2 bg-white rounded-full shadow-md transition-colors duration-300"
        style={{ color: playerIcons[turn].color }}
      >
        {gameWinner ? `¡GANADOR ${gameWinner}! 🎉` : `Turno: ${turn}`}
      </div>

      <Board 
        cells={cells} 
        handleCellClick={handleCellClick} 
        playerIcons={playerIcons} 
        winningLine={winningLine} 
        glowingCells={glowingCells}
        removalIndex={active ? (turn === 'X' ? (movesX.length === 3 ? movesX[0] : null) : (movesO.length === 3 ? movesO[0] : null)) : null} 
      />

      <div className="flex flex-col gap-3 w-full max-w-[260px] items-center">
        <button 
          onClick={resetGame} 
          className="mt-6 w-full py-3 bg-green-500 text-white font-bold text-lg rounded-full shadow-[0_4px_0_#2e7d32] active:translate-y-1 active:shadow-[0_1px_0_#2e7d32] transition-all z-20"
        >
          ¡REINICIAR!
        </button>

        {/* 🚨 BOTÓN DE INSTALACIÓN DINÁMICO: Solo aparece si el navegador da luz verde, y se elimina al instalar */}
        {showInstallBtn && (
          <button 
            onClick={handleInstallClick}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-full shadow-[0_4px_0_#1a237e] active:translate-y-0.5 active:shadow-[0_1px_0_#1a237e] transition-all animate-bounce z-20"
          >
            📥 INSTALAR APLICACIÓN
          </button>
        )}
      </div>

      {showWinnerPodium && gameWinner && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 p-6 transition-all duration-300">
          <div className="relative w-full max-w-[290px] rounded-2xl overflow-hidden border-[6px] shadow-2xl bg-white flex flex-col items-center" style={{ borderColor: playerIcons[gameWinner].color }}>
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
              <img src={playerIcons[gameWinner].value} alt="Ganador" className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
            </div>
            <div className="w-full bg-white text-center py-4 text-xl font-black uppercase tracking-wider z-20" style={{ color: playerIcons[gameWinner].color }}>
              ¡GANADOR JUGADOR {gameWinner}!
            </div>
          </div>
          <button onClick={resetGame} className="mt-6 px-[40px] py-[12px] text-white font-black text-lg rounded-full shadow-md border-2 border-white transform active:scale-95 transition-all z-20" style={{ backgroundColor: playerIcons[gameWinner].color }}>
            VOLVER A JUGAR
          </button>
        </div>
      )}
    </div>
  );
}
