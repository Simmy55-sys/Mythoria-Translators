"use client";

import { useState, useEffect, useRef } from "react";

interface ToolbarProps {
  editor: any;
}

const eventTags = [
  // Power/Growth Events
  { label: "⚡ Power Up", tag: "event", type: "power-up" },
  { label: "💫 Awaken", tag: "event", type: "awaken" },
  { label: "📜 Breakthrough", tag: "event", type: "breakthrough" },
  { label: "🌀 Summon", tag: "event", type: "summon" },
  { label: "✨ Cast Spell", tag: "event", type: "cast-spell" },
  { label: "🎮 Skill Learn", tag: "event", type: "skill-learn" },
  // Combat Events
  { label: "💥 Critical Hit", tag: "event", type: "critical-hit" },
  { label: "⏱️ Slow Motion", tag: "event", type: "slow-motion" },
  { label: "⚔️ Combo", tag: "event", type: "combo" },
  { label: "🩸 Bloodshed", tag: "event", type: "bloodshed" },
  { label: "🌑 Stealth", tag: "event", type: "stealth" },
  // Action Events
  { label: "🔥 Danger", tag: "event", type: "danger" },
  // Theme Events
  { label: "🔮 Prophecy", tag: "event", type: "prophecy" },
  { label: "👁️ Omen", tag: "event", type: "omen" },
  { label: "✨ Sacred", tag: "event", type: "sacred" },
  { label: "💀 Cursed", tag: "event", type: "cursed" },
  { label: "📸 Memory", tag: "event", type: "memory" },
  { label: "💭 Dream", tag: "event", type: "dream" },
  // Emotion Events
  { label: "💔 Heartbreak", tag: "event", type: "heartbreak" },
  { label: "😊 Joy", tag: "event", type: "joy" },
  { label: "💕 Confession", tag: "event", type: "confession" },
  { label: "😡 Rage", tag: "event", type: "rage" },
];

const conversationTags = [
  { label: "💬 Dialogue", tag: "dialogue" },
  { label: "👥 Conversation", tag: "conversation" },
];

const otherTags = [
  { label: "⚙️ System", tag: "system" },
  { label: "💥 SFX", tag: "sfx" },
  { label: "🌀 Shake", tag: "shake" },
];

export default function Toolbar({ editor }: ToolbarProps) {
  const [showEventMenu, setShowEventMenu] = useState(false);
  const [showConversationMenu, setShowConversationMenu] = useState(false);
  const eventMenuRef = useRef<HTMLDivElement>(null);
  const conversationMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        eventMenuRef.current &&
        !eventMenuRef.current.contains(event.target as Node)
      ) {
        setShowEventMenu(false);
      }
      if (
        conversationMenuRef.current &&
        !conversationMenuRef.current.contains(event.target as Node)
      ) {
        setShowConversationMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!editor) return null;

  const insertDialogue = () => {
    const speaker = prompt("Enter speaker name:");
    if (speaker) {
      const text = prompt(`Enter what ${speaker} says:`);
      if (text !== null) {
        // editor.commands.insertTag("dialogue", text || "", speaker);
        editor.commands.insertContent(
          `[dialogue speaker="${speaker}"]${text}[/dialogue]`
        );
      }
    }
  };

  const insertConversation = () => {
    const participants = prompt(
      "Enter participant names (comma-separated, e.g., Alice, Bob):"
    );
    if (participants) {
      // Insert conversation wrapper with example structure
      const exampleDialogue = `[dialogue speaker="${
        participants.split(",")[0]?.trim() || "Speaker1"
      }"]Enter dialogue here[/dialogue]\n[dialogue speaker="${
        participants.split(",")[1]?.trim() || "Speaker2"
      }"]Enter dialogue here[/dialogue]`;
      editor.commands.insertContent(
        `[conversation participants="${participants}"]\n${exampleDialogue}\n[/conversation]`
      );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 bg-slate-800 p-3 rounded-lg text-white">
        {/* Event Tags Group */}
        <div className="relative" ref={eventMenuRef}>
          <button
            onClick={() => setShowEventMenu(!showEventMenu)}
            className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-600 flex items-center gap-1"
          >
            📅 Events
            <span className="text-xs">▼</span>
          </button>
          {showEventMenu && (
            <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10 min-w-[150px]">
              {eventTags.map((btn) => (
                <button
                  key={`${btn.tag}-${btn.type}`}
                  onClick={() => {
                    editor.commands.insertTag(btn.tag, "", btn.type);
                    setShowEventMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Tags Group */}
        <div className="relative" ref={conversationMenuRef}>
          <button
            onClick={() => setShowConversationMenu(!showConversationMenu)}
            className="px-3 py-1 rounded bg-green-700 hover:bg-green-600 flex items-center gap-1"
          >
            💬 Conversations
            <span className="text-xs">▼</span>
          </button>
          {showConversationMenu && (
            <div className="absolute top-full left-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10 min-w-[180px]">
              <button
                onClick={() => {
                  insertDialogue();
                  setShowConversationMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-600 first:rounded-t-lg"
              >
                💬 Dialogue
              </button>
              <button
                onClick={() => {
                  insertConversation();
                  setShowConversationMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-600 last:rounded-b-lg"
              >
                👥 Conversation
              </button>
            </div>
          )}
        </div>

        {/* Other Tags */}
        {otherTags.map((btn) => (
          <button
            key={btn.tag}
            onClick={() => editor.commands.insertTag(btn.tag, "", undefined)}
            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
          >
            {btn.label}
          </button>
        ))}

        {/* Text Formatting */}
        <div className="border-l border-slate-600 pl-2 ml-2 flex gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-3 py-1 rounded bg-purple-700 hover:bg-purple-600"
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-3 py-1 rounded bg-purple-700 hover:bg-purple-600"
          >
            Italic
          </button>
        </div>
      </div>
    </div>
  );
}
