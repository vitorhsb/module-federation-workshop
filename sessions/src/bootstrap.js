import * as gen from "txtgen";

const root = document.getElementById("root-sessions");

const video = document.createElement("video");
video.setAttribute("controls", true);
video.setAttribute("width", "100%");
video.setAttribute(
  "src",
  // thanks Mozilla for the video example
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
);

const h1 = document.createElement("h1");
h1.append("Welcome to this session");

root.append(h1);
root.append(video);
root.append(`Title: ${gen.sentence()}`);
