import type { MP3TagTagsV1Defined } from "mp3tag.js/types/id3v1/tags";
import type { MP3TagTagsV2Defined } from "mp3tag.js/types/id3v2/tags";

export const availableTags: {
  name: string;
  label: string;
  v1name?: keyof MP3TagTagsV1Defined["v1"];
  v2name?: keyof MP3TagTagsV2Defined["v2"];
}[] = [
    {
      name: "title",
      label: "Title",
      v1name: "title",
      v2name: "TIT2"
    },
    {
      name: "artist",
      label: "Artist(s)",
      v1name: "artist",
      v2name: "TPE1"
    },
    {
      name: "album",
      label: "Album",
      v1name: "album",
      v2name: "TALB"
    },
    {
      name: "year",
      label: "Release Year",
      v1name: "year",
      v2name: "TYER"
    },
    {
      name: "comment",
      label: "Comment(s)",
      v1name: "comment",
      v2name: "COMM"
    },
    {
      name: "trackNum",
      label: "Track Number",
      v1name: "track",
      v2name: "TRCK"
    },
    {
      name: "genre",
      label: "Genre",
      v1name: "genre",
      v2name: "TCON"
    },
    {
      name: "isCompilation",
      label: "Is Compilation?",
      v2name: "TCM"
    },
    {
      name: "date",
      label: "Release Date",
      v2name: "TDAT"
    }
  ];
