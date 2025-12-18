"use client";

import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Animated Orbs */}
      <div
        className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl animate-pulse"
        style={{ top: "-50px", left: "-50px" }}
      />
      <div
        className="absolute w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-ping"
        style={{ bottom: "-80px", right: "-80px" }}
      />

      {/* Orbital Glow */}
      <div className="absolute w-40 aspect-square rounded-full bg-linear-to-l from-amber-500 via-violet-500 to-transparent blur-3xl mix-blend-screen orbit-path animate-orbit" />

      {/* Main Content */}
      <div className="relative z-20 text-center px-6">
        <h1 className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-violet-500 drop-shadow-lg">
          404
        </h1>

        <p className="mt-4 text-slate-300 text-lg md:text-xl font-medium">
          The path you seek does not exist...
        </p>

        <p className="mt-2 text-slate-400 text-sm italic">
          Perhaps, the ancient scrolls have hidden it.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/40 hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
