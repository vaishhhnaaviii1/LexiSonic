import React, { useEffect, useRef } from 'react';

function AudioVisualizer({ audioUrl }) {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) return;

    // 1. Ek temporary invisible audio element create karte hain background processing ke liye
    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";

    // 2. Web Audio API setup
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    
    // Smoothness aur wave size settings
    analyser.fftSize = 64; // Kam bars taaki clean and modern dikhe
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Audio element ko analyser se connect karo
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    audioContextRef.current = context;
    analyserRef.current = analyser;
    sourceRef.current = source;

    // Audio auto-play shuru karo
    audio.play().catch(err => console.log("Auto-play backup active:", err));

    // 3. Canvas par drawing loop shuru karne ka function
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Canvas background clear karo
      canvasCtx.fillStyle = 'rgba(15, 23, 42, 1)'; // Slate-900 color matches UI
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 1.4;
      let barHeight;
      let x = 0;

      // Har frequency bin ke liye ek bar draw karo
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2.5; // Scale height to fit canvas

        // Modern Cyberpunk Gradient Effect (Indigo to Purple)
        const gradient = canvasCtx.createLinearGradient(0, HEIGHT, 0, HEIGHT - barHeight);
        gradient.addColorStop(0, '#6366f1'); // Indigo-500
        gradient.addColorStop(1, '#a855f7'); // Purple-500

        canvasCtx.fillStyle = gradient;
        
        // Rounded bars draw karne ke liye
        canvasCtx.beginPath();
        canvasCtx.roundRect(x, HEIGHT - barHeight, barWidth - 4, barHeight, 4);
        canvasCtx.fill();

        x += barWidth;
      }
    };

    draw();

    // Cleanup function: Jab audio change ho ya component unmount ho, sab roko
    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.pause();
      source.disconnect();
      analyser.disconnect();
      context.close();
    };
  }, [audioUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 backdrop-blur">
      <canvas 
        ref={canvasRef} 
        width="180" 
        height="45" 
        className="w-full max-w-[180px] h-[45px]"
      />
    </div>
  );
}

export default AudioVisualizer;