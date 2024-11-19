import type { song } from "@prisma/client";

export const appState: {
  subnav: string;
  nowPlaying?: song
} = $state({
  subnav: "",
  nowPlaying: undefined
});
