"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

function generateChallenge() {
  const ops = ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b;
  if (op === "+") {
    a = Math.floor(Math.random() * 15) + 1;
    b = Math.floor(Math.random() * 15) + 1;
  } else {
    a = Math.floor(Math.random() * 15) + 6;
    b = Math.floor(Math.random() * (a - 1)) + 1;
  }
  return { a, b, op, answer: op === "+" ? a + b : a - b };
}

export default function MathCaptcha({ onVerified }) {
  const [challenge, setChallenge] = useState(null);
  const [input, setInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const reset = useCallback(() => {
    setChallenge(generateChallenge());
    setInput("");
    setVerified(false);
    setAttempts(0);
    onVerified(false);
  }, [onVerified]);

  useEffect(() => {
    setChallenge(generateChallenge());
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    // Only allow digits and minus sign
    if (!/^-?\d*$/.test(val)) return;
    setInput(val);

    if (val === "") return;
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed === challenge.answer) {
      setVerified(true);
      onVerified(true);
    } else if (val.length >= String(Math.abs(challenge.answer)).length + (challenge.answer < 0 ? 1 : 0)) {
      // Wrong answer — shake and reset
      setShake(true);
      setAttempts((p) => p + 1);
      setTimeout(() => {
        setShake(false);
        setChallenge(generateChallenge());
        setInput("");
      }, 600);
    }
  };

  if (!challenge) return null;

  return (
    <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0B3D24]" />
          Security Check
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="New question"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Math question */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm font-bold text-gray-800 font-mono bg-white border border-gray-200 rounded px-3 py-2 select-none min-w-[110px] text-center">
            {challenge.a} {challenge.op} {challenge.b} = ?
          </span>
          <span className="text-gray-400 text-sm">=</span>
          <input
            type="text"
            inputMode="numeric"
            value={input}
            onChange={handleChange}
            disabled={verified}
            placeholder="?"
            className={`w-16 text-center border rounded px-2 py-2 text-sm font-mono font-bold transition-all
              ${verified
                ? "border-green-400 bg-green-50 text-green-700"
                : shake
                ? "border-red-400 bg-red-50 animate-[shake_0.4s_ease]"
                : "border-gray-300 bg-white text-gray-800 focus:border-[#0B3D24] focus:outline-none"
              }`}
          />
        </div>

        {/* Status badge */}
        {verified ? (
          <span className="text-xs font-bold text-green-600 flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-4 h-4" /> Verified
          </span>
        ) : (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {attempts > 0 ? `Try again` : `Solve to continue`}
          </span>
        )}
      </div>
    </div>
  );
}
