import * as gen from "txtgen";

function mount(el) {
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

    el.append(h1);
    el.append(video);
    el.append(`Title: ${gen.sentence()}`);
}

if (process.env.NODE_ENV === "development") {
    const el = document.getElementById("root-sessions-dev");
    if (el) {
      mount(el);
    }
}

export default mount;
