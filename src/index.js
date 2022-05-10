const readline = require("readline");
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
ffmpeg.setFfmpegPath(ffmpegPath);

let id = process.argv[2];

const dirname = path.join(__dirname, "..", "downloads");

function padWithZeros(num, size) {
  num = num + "";
  while (num.length < size) num = "0" + num;
  return num;
}

function getFilename(item) {
  return (
    padWithZeros(item.index, 4) +
    "_" +
    item.title.slice(0, 40).replace(/\s/g, "")
  );
}

async function getItems(id) {
  const { items } = await ytpl(id, {
    limit: Infinity,
  });
  return items;
}

getItems(id).then((items) => {
  items.forEach((item) => {
    try {
      let stream = ytdl(item.id, {
        quality: "highestaudio",
      });

      let start = Date.now();
      ffmpeg(stream)
        .audioBitrate(128)
        .save(`${dirname}/${getFilename(item)}.mp3`);
      // .on("progress", (p) => {
      //   readline.cursorTo(process.stdout, 0);
      //   process.stdout.write(`${p.targetSize}kb downloaded`);
      // })
      // .on("end", () => {
      //   console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      // });
    } catch (error) {
      console.log(error);
    }
  });
});
