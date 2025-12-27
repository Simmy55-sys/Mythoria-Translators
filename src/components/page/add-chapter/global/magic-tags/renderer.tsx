interface Props {
  content: string;
}

// Generate a consistent color for a speaker based on their name
function getSpeakerColor(speaker: string): {
  bg: string;
  border: string;
  text: string;
  ring: string;
  bubble: string;
  tailColor: string;
} {
  // Simple hash function to get consistent color
  let hash = 0;
  for (let i = 0; i < speaker.length; i++) {
    hash = speaker.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Color palette with good contrast
  const colors = [
    {
      bg: "from-blue-500 to-cyan-600",
      border: "border-blue-500/60",
      text: "text-blue-300",
      ring: "ring-blue-400/50",
      bubble: "bg-blue-600/30",
      tailColor: "rgba(37, 99, 235, 0.3)",
    },
    {
      bg: "from-purple-500 to-pink-600",
      border: "border-purple-500/60",
      text: "text-purple-300",
      ring: "ring-purple-400/50",
      bubble: "bg-purple-600/30",
      tailColor: "rgba(147, 51, 234, 0.3)",
    },
    {
      bg: "from-green-500 to-emerald-600",
      border: "border-green-500/60",
      text: "text-green-300",
      ring: "ring-green-400/50",
      bubble: "bg-green-600/30",
      tailColor: "rgba(34, 197, 94, 0.3)",
    },
    {
      bg: "from-orange-500 to-red-600",
      border: "border-orange-500/60",
      text: "text-orange-300",
      ring: "ring-orange-400/50",
      bubble: "bg-orange-600/30",
      tailColor: "rgba(249, 115, 22, 0.3)",
    },
    {
      bg: "from-yellow-500 to-amber-600",
      border: "border-yellow-500/60",
      text: "text-yellow-300",
      ring: "ring-yellow-400/50",
      bubble: "bg-yellow-600/30",
      tailColor: "rgba(234, 179, 8, 0.3)",
    },
    {
      bg: "from-indigo-500 to-violet-600",
      border: "border-indigo-500/60",
      text: "text-indigo-300",
      ring: "ring-indigo-400/50",
      bubble: "bg-indigo-600/30",
      tailColor: "rgba(99, 102, 241, 0.3)",
    },
    {
      bg: "from-teal-500 to-cyan-600",
      border: "border-teal-500/60",
      text: "text-teal-300",
      ring: "ring-teal-400/50",
      bubble: "bg-teal-600/30",
      tailColor: "rgba(20, 184, 166, 0.3)",
    },
    {
      bg: "from-rose-500 to-pink-600",
      border: "border-rose-500/60",
      text: "text-rose-300",
      ring: "ring-rose-400/50",
      bubble: "bg-rose-600/30",
      tailColor: "rgba(244, 63, 94, 0.3)",
    },
  ];

  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}

export default function MagicRenderer({ content }: Props) {
  // First, extract and process conversations (which can span multiple lines)
  const conversationRegex =
    /\[conversation\s+([^\]]+)\]([\s\S]*?)\[\/conversation\]/gi;
  const conversations: Array<{
    match: string;
    participants: string[];
    dialogues: Array<{ speaker: string; text: string }>;
  }> = [];

  let conversationMatch;
  while ((conversationMatch = conversationRegex.exec(content)) !== null) {
    const participantsMatch =
      conversationMatch[1].match(/participants="(.+?)"/)?.[1];
    const participants = participantsMatch
      ? participantsMatch.split(",").map((p) => p.trim())
      : [];
    const conversationContent = conversationMatch[2] ?? "";

    // Parse dialogue lines within conversation
    const dialogueRegex = /\[dialogue\s+speaker="(.+?)"\](.*?)\[\/dialogue\]/gi;
    const dialogues: Array<{ speaker: string; text: string }> = [];
    let dialogueMatch;
    while ((dialogueMatch = dialogueRegex.exec(conversationContent)) !== null) {
      dialogues.push({
        speaker: dialogueMatch[1],
        text: dialogueMatch[2],
      });
    }

    conversations.push({
      match: conversationMatch[0],
      participants,
      dialogues,
    });
  }

  // Replace conversations with placeholders to avoid double processing
  // Also replace standalone dialogues that are inside conversations
  let processedContent = content;
  conversations.forEach((conv, idx) => {
    // Replace the entire conversation block
    processedContent = processedContent.replace(
      conv.match,
      `__CONVERSATION_${idx}__`
    );
    // Also replace any dialogue tags that are part of this conversation
    conv.dialogues.forEach((dialogue) => {
      const dialoguePattern = `[dialogue speaker="${dialogue.speaker}"]${dialogue.text}[/dialogue]`;
      processedContent = processedContent.replace(
        dialoguePattern,
        `__DIALOGUE_IN_CONV_${idx}__`
      );
    });
  });

  const lines = processedContent.split("\n");
  let conversationIndex = 0;

  return (
    <div className="space-y-4 leading-relaxed text-[1.15rem]">
      {lines.map((line, index) => {
        // Check if this line contains a conversation placeholder
        if (line.includes("__CONVERSATION_")) {
          const convIdx = parseInt(
            line.match(/__CONVERSATION_(\d+)__/)?.[1] ?? "0"
          );
          const conv = conversations[convIdx];
          if (!conv) return <p key={index}>{line}</p>;

          if (conv.dialogues.length === 0) {
            return (
              <div
                key={index}
                className="my-6 p-4 border border-dashed border-slate-600 rounded-xl text-slate-500 italic text-sm"
              >
                [Empty conversation between {conv.participants.join(", ")}]
              </div>
            );
          }

          return (
            <div
              key={index}
              className="my-8 p-6 bg-linear-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 rounded-2xl border-2 border-slate-600/50 shadow-2xl relative overflow-hidden"
            >
              {/* Conversation header with better styling */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-700/60">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <span className="text-xl">💬</span>
                </div>
                <div className="flex-1">
                  <div className="text-slate-300 font-semibold text-sm mb-1">
                    Conversation
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {conv.participants.map((p, i) => {
                      const participantColor = getSpeakerColor(p);
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1 ${participantColor.bubble
                            .replace("bg-", "bg-")
                            .replace("/30", "/40")} ${
                            participantColor.text
                          } rounded-full text-xs font-semibold border-2 ${
                            participantColor.border
                          }`}
                        >
                          {p}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dialogue items with improved chat-like appearance */}
              <div className="space-y-4">
                {conv.dialogues.map((dialogue, dIndex) => {
                  // Get consistent color for this speaker
                  const speakerColor = getSpeakerColor(dialogue.speaker);

                  if (!dialogue.text.trim()) {
                    return (
                      <div
                        key={dIndex}
                        className="text-slate-500 italic text-sm text-center py-2"
                      >
                        [Empty message from {dialogue.speaker}]
                      </div>
                    );
                  }

                  // Check if this is the same speaker as the previous message
                  const isSameSpeaker =
                    dIndex > 0 &&
                    conv.dialogues[dIndex - 1].speaker === dialogue.speaker;

                  return (
                    <div
                      key={dIndex}
                      className="flex items-start gap-4 animate-fade-in"
                      style={{ animationDelay: `${dIndex * 0.1}s` }}
                    >
                      {/* Avatar - only show if different speaker or first message */}
                      {!isSameSpeaker && (
                        <div
                          className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base shadow-lg bg-linear-to-br ${speakerColor.bg} ring-2 ${speakerColor.ring}`}
                        >
                          {dialogue.speaker.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isSameSpeaker && <div className="shrink-0 w-12"></div>}

                      {/* Message bubble */}
                      <div className="flex-1 min-w-0">
                        {/* Speaker name - only show if different speaker */}
                        {!isSameSpeaker && (
                          <div
                            className={`text-xs font-semibold mb-2 px-1 ${speakerColor.text}`}
                          >
                            {dialogue.speaker}
                          </div>
                        )}
                        <div className="relative inline-block max-w-[85%]">
                          {/* Speech bubble */}
                          <div
                            className={`px-5 py-3 rounded-2xl shadow-lg ${speakerColor.bubble} border-2 ${speakerColor.border} rounded-tl-sm`}
                          >
                            <p className="text-white leading-relaxed text-base">
                              {dialogue.text}
                            </p>
                          </div>

                          {/* Message tail pointing left */}
                          <div
                            className="absolute -left-2 top-4 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[10px]"
                            style={{
                              borderRightColor: speakerColor.tailColor,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtle visual effect overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
              </div>
            </div>
          );
        }
        // System / Quest Log Style
        if (/\[system\]([\s\S]*?)\[\/system\]/.test(line)) {
          const text = line.match(/\[system\](.*?)\[\/system\]/)?.[1] ?? "";
          return (
            <div
              key={index}
              className="bg-linear-to-r from-amber-500/20 to-amber-400/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl font-semibold uppercase tracking-wide drop-shadow glow animate-fade-in"
            >
              ⚙️ {text}
            </div>
          );
        }

        // EVENT TAGS
        if (/\[event\s+([^\]]+)\](.*?)\[\/event\]/i.test(line)) {
          const type = line.match(/type="(.+?)"/)?.[1];
          const text = line.match(/\](.*?)\[\/event\]/)?.[1];

          switch (type) {
            case "power-up":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-yellow-900/50 via-amber-900/40 to-yellow-900/50 border-2 border-yellow-500/60 text-yellow-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden animate-pulse-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-golden-shimmer"></div>
                  <div className="relative z-10 font-semibold text-lg">
                    ⚡ {text}
                  </div>
                </div>
              );

            case "awaken":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-blue-950/80 via-purple-950/80 to-blue-950/80 border-2 border-blue-400/70 text-blue-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 animate-flash"></div>
                  <div className="absolute inset-0">
                    <span className="absolute top-2 left-4 text-blue-400/60 text-xl animate-crack-particle">
                      ✨
                    </span>
                    <span className="absolute top-4 right-6 text-blue-400/60 text-lg animate-crack-particle-delayed">
                      ✨
                    </span>
                    <span className="absolute bottom-3 left-8 text-blue-400/60 text-xl animate-crack-particle-delayed-2">
                      ✨
                    </span>
                    <span className="absolute bottom-2 right-4 text-blue-400/60 text-lg animate-crack-particle">
                      ✨
                    </span>
                  </div>
                  <div className="relative z-10 font-bold text-lg">
                    💫 {text}
                  </div>
                </div>
              );

            case "breakthrough":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-emerald-900/50 via-teal-900/40 to-emerald-900/50 border-2 border-emerald-400/60 text-emerald-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 animate-scroll-effect"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-emerald-400/20 text-6xl font-bold animate-rune-float">
                      ⚡
                    </div>
                    <div className="text-emerald-400/20 text-5xl font-bold animate-rune-float-delayed absolute">
                      ⚡
                    </div>
                  </div>
                  <div className="relative z-10 font-semibold text-lg">
                    📜 {text}
                  </div>
                </div>
              );

            case "summon":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 border-2 border-purple-400/60 text-purple-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 border-4 border-purple-400/40 rounded-full animate-portal-ring"></div>
                    <div className="absolute w-24 h-24 border-4 border-purple-500/50 rounded-full animate-portal-ring-delayed"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-smoky"></div>
                  <div className="relative z-10 font-semibold">🌀 {text}</div>
                </div>
              );

            case "cast-spell":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-indigo-900/60 border-2 border-indigo-400/70 text-indigo-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent animate-arcane-glow"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="absolute top-2 left-6 text-indigo-400/40 text-2xl font-bold animate-glyph-float">
                      ⚛
                    </span>
                    <span className="absolute top-4 right-8 text-indigo-400/40 text-xl font-bold animate-glyph-float-delayed">
                      ⚛
                    </span>
                    <span className="absolute bottom-3 left-10 text-indigo-400/40 text-2xl font-bold animate-glyph-float-delayed-2">
                      ⚛
                    </span>
                    <span className="absolute bottom-2 right-6 text-indigo-400/40 text-xl font-bold animate-glyph-float">
                      ⚛
                    </span>
                  </div>
                  <div className="relative z-10 font-bold text-lg font-mono">
                    ✨ {text}
                  </div>
                </div>
              );

            case "skill-learn":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 border-4 border-cyan-400/70 text-cyan-200 px-5 py-4 rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    boxShadow:
                      "0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.1)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400/60 animate-hud-scan"></div>
                  <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-lg"></div>
                  <div className="relative z-10 font-mono font-semibold">
                    🎮 <span className="text-cyan-300">{text}</span>
                  </div>
                </div>
              );

            case "critical-hit":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-red-950/80 via-orange-950/70 to-red-950/80 border-4 border-red-500/80 text-red-300 px-5 py-4 rounded-lg shadow-2xl overflow-hidden animate-vibration"
                >
                  <div className="relative z-10 font-black text-2xl tracking-wider">
                    💥 {text}
                  </div>
                </div>
              );

            case "slow-motion":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-blue-950/70 via-indigo-950/60 to-blue-950/70 border-2 border-blue-400/60 text-blue-200 px-5 py-4 rounded-xl shadow-xl overflow-hidden"
                  style={{
                    animation: "stretch 3s ease-in-out infinite",
                  }}
                >
                  <div className="relative z-10 italic text-lg leading-relaxed">
                    ⏱️ {text}
                  </div>
                </div>
              );

            case "combo":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-orange-900/60 via-red-900/50 to-orange-900/60 border-2 border-orange-400/60 text-orange-200 px-5 py-4 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="relative z-10 font-bold text-lg">
                    ⚔️ <span className="animate-combo-sequence">{text}</span>
                  </div>
                </div>
              );

            case "bloodshed":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-red-950/90 via-red-900/80 to-red-950/90 border-2 border-red-700/70 text-red-300 px-5 py-4 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-4 w-1 h-8 bg-red-600/60 animate-drip"></div>
                    <div className="absolute top-2 right-6 w-1 h-6 bg-red-600/60 animate-drip-delayed"></div>
                    <div className="absolute bottom-0 left-8 w-1 h-10 bg-red-600/60 animate-drip-delayed-2"></div>
                    <div className="absolute bottom-4 right-4 w-1 h-7 bg-red-600/60 animate-drip"></div>
                  </div>
                  <div className="relative z-10 font-semibold">🩸 {text}</div>
                </div>
              );

            case "stealth":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95 border-2 border-slate-600/50 text-slate-400 px-5 py-4 rounded-xl shadow-xl overflow-hidden animate-fade-to-shadow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/30 to-transparent"></div>
                  <div className="relative z-10 italic font-semibold">
                    🌑 {text}
                  </div>
                </div>
              );

            case "danger":
              return (
                <div
                  key={index}
                  className="bg-red-900/40 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg shadow animate-shake"
                >
                  ⚠️ {text}
                </div>
              );

            case "prophecy":
              return (
                <div
                  key={index}
                  className="relative bg-violet-900/50 border-2 border-violet-400/60 text-violet-200 px-5 py-4 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
                  style={{
                    fontFamily: "serif",
                    textShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-shimmer"></div>
                  <div className="relative z-10 italic text-lg leading-relaxed">
                    🔮 {text}
                  </div>
                  <div className="absolute inset-0 opacity-30 animate-echo">
                    <div className="text-violet-300/20 blur-sm">{text}</div>
                  </div>
                </div>
              );

            case "omen":
              return (
                <div
                  key={index}
                  className="relative bg-slate-950/90 border-2 border-red-800/80 text-red-400 px-5 py-4 rounded-lg shadow-xl overflow-hidden animate-shake"
                  style={{
                    boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
                  <div className="relative z-10 font-semibold">👁️ {text}</div>
                </div>
              );

            case "sacred":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-yellow-100/20 via-amber-50/30 to-yellow-100/20 border-2 border-yellow-400/70 text-yellow-100 px-5 py-4 rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    fontFamily: "serif",
                    textShadow: "0 0 15px rgba(250, 204, 21, 0.6)",
                  }}
                >
                  <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-1 h-full bg-yellow-300/40 animate-radiate"></div>
                    <div className="absolute top-0 right-1/4 w-1 h-full bg-yellow-300/40 animate-radiate-delayed"></div>
                    <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-300/40 animate-radiate-delayed-2"></div>
                  </div>
                  <div className="relative z-10 font-semibold text-lg">
                    ✨ {text}
                  </div>
                </div>
              );

            case "cursed":
              return (
                <div
                  key={index}
                  className="relative bg-slate-900/95 border-2 border-purple-800/60 text-purple-300 px-5 py-4 rounded-lg shadow-xl overflow-hidden animate-glitch"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_50%,rgba(147,51,234,0.1)_50%,transparent_50%)] bg-[length:20px_100%] animate-static"></div>
                  <div className="relative z-10 font-mono text-sm">
                    💀 {text}
                  </div>
                </div>
              );

            case "memory":
              return (
                <div
                  key={index}
                  className="relative bg-amber-900/30 border-2 border-amber-700/50 text-amber-200 px-5 py-4 rounded-xl shadow-lg overflow-hidden"
                  style={{
                    filter: "sepia(40%) contrast(1.1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-900/20 to-transparent blur-sm"></div>
                  <div className="absolute inset-0 border-4 border-amber-800/30 rounded-xl"></div>
                  <div className="relative z-10 italic">📸 {text}</div>
                </div>
              );

            case "dream":
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-blue-900/30 border-2 border-pink-400/40 text-pink-200 px-5 py-4 rounded-2xl shadow-xl overflow-hidden"
                  style={{
                    filter: "blur(0.5px)",
                    backdropFilter: "blur(2px)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 animate-soft-glow"></div>
                  <div className="relative z-10 italic text-lg leading-relaxed">
                    💭 {text}
                  </div>
                </div>
              );

            case "heartbreak":
              return (
                <div
                  key={index}
                  className="relative bg-red-950/50 border-2 border-red-800/60 text-red-300 px-5 py-4 rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative z-10">
                    💔{" "}
                    <span className="inline-block animate-text-break">
                      {text}
                    </span>
                  </div>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-600/50 transform -rotate-2"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-600/50 transform rotate-2"></div>
                  </div>
                </div>
              );

            case "joy":
              return (
                <div
                  key={index}
                  className="relative bg-yellow-900/40 border-2 border-yellow-500/60 text-yellow-200 px-5 py-4 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-shimmer"></div>
                  <div className="relative z-10 font-semibold">😊 {text}</div>
                </div>
              );

            case "confession":
              return (
                <div
                  key={index}
                  className="relative bg-pink-900/40 border-2 border-pink-500/60 text-pink-200 px-5 py-4 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="absolute inset-0">
                    <span className="absolute top-2 left-4 text-pink-400/40 text-2xl animate-float">
                      💕
                    </span>
                    <span className="absolute top-4 right-6 text-pink-400/40 text-xl animate-float-delayed">
                      💕
                    </span>
                    <span className="absolute bottom-3 left-8 text-pink-400/40 text-lg animate-float-delayed-2">
                      💕
                    </span>
                    <span className="absolute bottom-2 right-4 text-pink-400/40 text-xl animate-float">
                      💕
                    </span>
                  </div>
                  <div className="relative z-10 italic">💕 {text}</div>
                </div>
              );

            case "rage":
              return (
                <div
                  key={index}
                  className="relative bg-red-950/80 border-2 border-red-600/80 text-red-400 px-5 py-4 rounded-lg shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/30 to-red-600/20 animate-fire-flicker"></div>
                  <div className="relative z-10 font-bold text-lg">
                    😡 {text}
                  </div>
                </div>
              );

            default:
              return (
                <div key={index} className="text-slate-400 italic">
                  {text}
                </div>
              );
          }
        }

        // SOUND EFFECT
        if (/\[sfx\](.*?)\[\/sfx\]/.test(line)) {
          const text = line.match(/\[sfx\](.*?)\[\/sfx\]/)?.[1];
          return (
            <div
              key={index}
              className="text-yellow-400 font-extrabold text-2xl tracking-wider animate-bounce"
            >
              {text}
            </div>
          );
        }

        // SCREEN SHAKE
        if (/\[shake\](.*?)\[\/shake\]/.test(line)) {
          const text = line.match(/\[shake\](.*?)\[\/shake\]/)?.[1];
          return (
            <div key={index} className="text-white font-bold animate-shake">
              {text}
            </div>
          );
        }

        // DIALOGUE - Single speaker dialogue (only standalone, not inside conversations)
        // Check if this dialogue is NOT part of a conversation block
        if (
          /\[dialogue\s+([^\]]+)\](.*?)\[\/dialogue\]/i.test(line) &&
          !line.includes("__CONVERSATION_") &&
          !line.includes("__DIALOGUE_IN_CONV_")
        ) {
          const speaker = line.match(/speaker="(.+?)"/)?.[1] ?? "Unknown";
          const text = line.match(/\](.*?)\[\/dialogue\]/)?.[1] ?? "";

          if (!text.trim()) {
            return (
              <div
                key={index}
                className="my-4 p-3 border border-dashed border-slate-600 rounded-lg text-slate-500 italic text-sm"
              >
                [Empty dialogue from {speaker}]
              </div>
            );
          }

          return (
            <div
              key={index}
              className="my-5 flex items-start gap-4 animate-fade-in"
            >
              {/* Avatar */}
              <div className="shrink-0 w-14 h-14 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-blue-400/50">
                {speaker.charAt(0).toUpperCase()}
              </div>

              {/* Speech Bubble */}
              <div className="flex-1 min-w-0">
                <div className="text-blue-300 font-semibold mb-2 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  {speaker}
                </div>
                <div className="relative">
                  {/* Speech bubble */}
                  <div className="bg-slate-800/80 border-2 border-blue-500/50 rounded-2xl px-5 py-4 shadow-lg relative">
                    {/* Tail pointing to avatar */}
                    <div className="absolute -left-3 top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-slate-800/80"></div>
                    <div className="absolute -left-[13px] top-6 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-blue-500/50"></div>

                    <p className="text-white leading-relaxed text-base relative z-10">
                      {text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Regular text line
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
