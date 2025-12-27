import { Extension } from "@tiptap/core";

export const MagicTags = Extension.create({
  name: "magicTags",
  addCommands() {
    return {
      insertTag:
        (tag: string, content: string = "", type?: string, speaker?: string) =>
        ({ commands }: any) => {
          if (tag === "dialogue" && speaker) {
            return commands.insertContent(
              `[dialogue speaker="${speaker}"]${content}[/dialogue]`
            );
          }
          if (tag === "conversation" && type) {
            return commands.insertContent(
              `[conversation participants="${type}"]${content}[/conversation]`
            );
          }
          if (type) {
            return commands.insertContent(
              `[${tag} type="${type}"]${content}[/${tag}]`
            );
          }
          return commands.insertContent(`[${tag}]${content}[/${tag}]`);
        },
    } as any;
  },
});
