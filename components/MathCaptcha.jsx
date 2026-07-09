"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I, O, 0, 1 (confusing)
const LENGTH = 6;

function generateCode() {
  // Use current timestamp as additional entropy seed
  const seed = Date.now();
  return Array.from({ length: LENGTH }, (_, i) =>
    CHARS.charAt(Math.floor(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * CHARS.length + Math.random() * CHARS.length) % CHARS.length)
  ).join("");
}

function drawCaptcha(canvas, code) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.fillStyle = "#f0f4f8";
  ctx.fillRect(0, 0, W, H);

  // Background noise dots
  for (let i = 0; i < 80; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * W,
      Math.random() * H,
      Math.random() * 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = `hsla(${Math.random() * 360}, 40%, 70%, 0.6)`;
    ctx.fill();
  }

  // Noise lines (behind text)
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * W, Math.random() * H);
    ctx.bezierCurveTo(
      Math.random() * W, Math.random() * H,
      Math.random() * W, Math.random() * H,
      Math.random() * W, Math.random() * H
    );
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 50%, 55%, 0.35)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw each character with individual distortion
  const charW = W / (LENGTH + 1);
  const colors = [
    "#0B3D24", "#1a5c38", "#7c3aed", "#b45309",
    "#0369a1", "#be123c", "#0f766e", "#92400e",
  ];

  for (let i = 0; i < code.length; i++) {
    ctx.save();

    const x = charW * (i + 0.8) + charW * 0.1;
    const y = H / 2 + 6;

    ctx.translate(x, y);
    // Random slight rotation per character
    ctx.rotate((Math.random() - 0.5) * 0.45);
    // Random slight scale
    const scale = 0.85 + Math.random() * 0.3;
    ctx.scale(scale, scale);

    // Random font size variation
    const fontSize = 22 + Math.floor(Math.random() * 6);
    const fonts = ["Arial Black", "Georgia", "Verdana", "Trebuchet MS", "Impact"];
    ctx.font = `bold ${fontSize}px "${fonts[i % fonts.length]}"`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Slight shadow for depth
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = colors[i % colors.length];
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  // Overlay noise lines (on top of text)
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, Math.random() * H);
    ctx.lineTo(W, Math.random() * H);
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 60%, 50%, 0.2)`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

export default function VisualCaptcha({ onVerified }) {
  const canvasRef = useRef(null);
  // Lazy initializer — generates a fresh code immediately on every mount/page load
  const [code, setCode] = useState(() => generateCode());
  const [input, setInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(() => {
    const newCode = generateCode();
    setCode(newCode);
    setInput("");
    setVerified(false);
    setError(false);
    onVerified(false);
  }, [onVerified]);

  // Draw onto canvas whenever code changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && code) drawCaptcha(canvas, code);
  }, [code]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setInput(val);
    setError(false);

    if (val.length === LENGTH) {
      if (val === code) {
        setVerified(true);
        onVerified(true);
        setError(false);
      } else {
        setError(true);
        onVerified(false);
        // Auto-refresh after showing error briefly
        setTimeout(() => {
          refresh();
        }, 800);
      }
    }
  };

  return (
    <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0B3D24]" />
          Security Check
        </span>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#0B3D24] transition-colors"
          title="Refresh code"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          New code
        </button>
      </div>

      {/* Canvas */}
      <div className="flex items-center gap-3">
        <canvas
          ref={canvasRef}
          width={200}
          height={56}
          className={`rounded border select-none flex-shrink-0 transition-all ${
            verified
              ? "border-green-400 opacity-60"
              : error
              ? "border-red-400 animate-shake"
              : "border-gray-300"
          }`}
          style={{ imageRendering: "pixelated" }}
        />

        <div className="flex-1">
          <input
            type="text"
            maxLength={LENGTH}
            value={input}
            onChange={handleChange}
            disabled={verified}
            placeholder={`Type ${LENGTH} characters`}
            autoComplete="off"
            spellCheck={false}
            className={`w-full text-center border rounded px-2 py-2.5 text-sm font-mono font-bold tracking-[0.2em] uppercase transition-all focus:outline-none
              ${verified
                ? "border-green-400 bg-green-50 text-green-700"
                : error
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-gray-300 bg-white text-gray-800 focus:border-[#0B3D24]"
              }`}
          />

          {/* Status */}
          <p className={`text-xs mt-1 text-center font-semibold transition-all ${
            verified ? "text-green-600" : error ? "text-red-500" : "text-gray-400"
          }`}>
            {verified
              ? "✓ Verified you're human!"
              : error
              ? "✗ Wrong — try the new code"
              : `Enter the ${LENGTH} characters shown`}
          </p>
        </div>
      </div>
    </div>
  );
}
