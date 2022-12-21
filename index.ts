const RGBRe = /^#[0-9a-fA-F]{6}$/;
const parseRGB = (str: string): number | undefined => {
  if (!str.match(RGBRe)) return;
  return 0xff000000 & parseInt(str.substring(1), 16);
};

const ws = new ActiveXObject("WScript.Shell");
const fs = new ActiveXObject("Scripting.FileSystemObject");

type LyricsTags = "LYRICS" | "UNSYNCED LYRICS";
type LyricsFileType = "txt" | "lrc";

const getLyrics = (handle: IMetadbHandle) => {
  const lyrics: string[] = [];
  const fileInfo = handle.GetFileInfo();
  try {
    obj.lyricsOrder.forEach((type) => {
      if (lyrics.length > 0) {
        return lyrics;
      }
      switch (type) {
        case "UNSYNCED LYRICS":
        case "LYRICS":
          const lyricsIdx = fileInfo.MetaFind(type);
          if (lyricsIdx != -1) {
            const count = fileInfo.MetaValueCount(lyricsIdx);
            for (var i = 0; i < count; i++) {
              lyrics.push(fileInfo.MetaValue(lyricsIdx, i));
            }
          }
          break;
        case "lrc":
        case "txt":
          const titleIdx = fileInfo.MetaFind("TITLE");
          const title = fileInfo.MetaValue(titleIdx, 0);
          const artistIdx = fileInfo.MetaFind("ARTIST");
          const artist = fileInfo.MetaValue(artistIdx, 0);
          const path = `${obj.lyricsSearchPath}${artist.replace(
            "*",
            "＊"
          )}\\${title.replace("*", "＊")}.${type}`;
          if (utils.IsFile(path)) {
            const lines = utils
              .ReadTextFile(path, utils.DetectCharset(path))
              .split(/\r?\n/);
            lyrics.push(...lines);
          }
          break;
      }
    });
  } finally {
    fileInfo.Dispose();
  }
  return lyrics;
};

const calcImageSize = (
  image: IJSImage | null,
  dispW: number,
  dispH: number,
  strech: boolean,
  keepAspectRatio: boolean
) => {
  if (!image) return;
  let size: { x: number; y: number; width: number; height: number };
  if (strech) {
    size = { x: 0, y: 0, width: dispW || 1, height: dispH || 1 };
    if (keepAspectRatio) {
      const scale = Math.min(dispH / image.Height, dispW / image.Width);
      size.width = Math.floor(image.Width * scale);
      size.height = Math.floor(image.Height * scale);
    }
  } else {
    size = { x: 0, y: 0, width: image.Width, height: image.Height };
    if (keepAspectRatio) {
      if (size.height > dispH) {
        size.height = dispH;
        size.width = Math.ceil((dispH * image.Width) / image.Height);
      }
      if (size.width > dispW) {
        size.width = dispW;
        size.height = Math.ceil((dispW * image.Height) / image.Width);
      }
    } else {
      size.width = Math.min(image.Width, dispW);
      size.height = Math.min(image.Height, dispH);
    }
  }
  size.y = Math.floor((dispH - size.height) / 2);
  size.x = Math.floor((dispW - size.width) / 2);
  return size;
};

const timeTagToTime = (timeStr: string) => {
  return timeStr
    .split(":")
    .reverse()
    .reduce((total, current, index) => {
      return total + parseFloat(current) * 60 ** index;
    }, 0);
};

const padding02 = (str: string) => {
  if (str.length >= 2) return str;
  return ("0" + str).slice(-2);
};
const padding03 = (str: string) => {
  if (str.length >= 3) return str;
  return ("00" + str).slice(-3);
};
const timeToTimeTag = (time: number) => {
  const msec = Math.floor((time % 1) * 1000).toString();
  const sec = Math.floor(time % 60).toString();
  const min = Math.floor((time % 3600) / 60).toString();
  const hour = Math.floor(time / 3600).toString();
  return `${padding02(hour)}:${padding02(min)}:${padding02(sec)}.${padding03(
    msec
  )}`;
};

const calcHighlightIndex = (lyrics: string[], time: number) => {
  let index = -1;
  lyrics.forEach((str, idx) => {
    const matched = str.match(/\[([\d.:]+)\]/);
    if (matched) {
      const current = timeTagToTime(matched[1]);
      if (current < time) {
        index = idx;
      }
    }
  });
  return index;
};

/**
 * global objects
 */

const obj: {
  height: number;
  width: number;
  albumArt?: IJSImage | null;
  lyrics: string[];
  lyricsLayout: ITextLayout[];
  lyricsImage?: IJSImage | null;
  lyricsShadowImage?: IJSImage | null;
  lyricsHighlightImage?: IJSImage | null;
  lyricsOrder: (LyricsFileType | LyricsTags)[];
  lyricsSearchPath: string;
  padding: number;
  timer: number;
  interval: number;
  stepHight: number;
  step: number;
} = {
  height: 0,
  width: 0,
  lyrics: [],
  lyricsLayout: [],
  lyricsOrder: ["LYRICS", "UNSYNCED LYRICS", "lrc", "txt"],
  lyricsSearchPath: window.GetProperty<string>(
    "Panel.SearchPath",
    ws.SpecialFolders.Item("Desktop")
  ),
  padding: window.GetProperty("Panel.Padding", 5),
  timer: -1,
  interval: window.GetProperty("Panel.Interval", 30),
  stepHight: 30,
  step: 0,
};
const fonts = {
  text: {
    name: utils.CheckFont(window.GetProperty("Panel.Font.Name", "Yu Gothic UI"))
      ? window.GetProperty("Panel.Font.Name", "Yu Gothic UI")
      : "Yu Gothic UI",
    size: window.GetProperty("Panel.Font.Size", 13),
    weight: window.GetProperty("Panel.Font.Bold", false)
      ? DWRITE_FONT_WEIGHT_BOLD
      : DWRITE_FONT_WEIGHT_NORMAL,
    style: window.GetProperty("Panel.Font.Italic", false)
      ? DWRITE_FONT_STYLE_ITALIC
      : DWRITE_FONT_STYLE_NORMAL,
    stretch: DWRITE_FONT_STRETCH_NORMAL,
  },
};
const colors = {
  main: RGB(190, 190, 190),
  highlight: RGB(255, 142, 196),
  shadow: RGBA(0, 0, 0, 255),
  background: RGB(76, 76, 76),
};
const LyricsView = {
  background: {
    angle: window.GetProperty("Panel.Background.Angle", 20),
    opacity: window.GetProperty("Panel.Background.Alpha", 0.2),
    keepAspectRatio: window.GetProperty(
      "Panel.Background.KeepAspectRatio",
      true
    ),
    stretch: window.GetProperty("Panel.Background.Stretch", true),
  },
  fonts: fonts,
  colors: colors,
  blur: {
    enabled: false,
    radius: 10,
  },
  shadow: {
    enabled: window.GetProperty("Panel.Text.Shadow.Enabled", true),
    position: {
      x: window.GetProperty("Panel.Text.Shadow.X", 2),
      y: window.GetProperty("Panel.Text.Shadow.Y", 2),
    },
  },
};

const setScrollPosition = (step: number) => {
  const current = fb.PlaybackTime;
  const total = fb.PlaybackLength;
  if (total > 0 && obj.lyricsImage) {
    obj.step -= step;
    if (
      (obj.lyricsImage.Height - obj.height) * (current / total) <
      -obj.step * obj.stepHight
    ) {
      obj.step =
        -((obj.lyricsImage.Height - obj.height) * (current / total)) /
        obj.stepHight;
    } else if (
      ((obj.lyricsImage.Height - obj.height) * (total - current)) / total <
      obj.step * obj.stepHight
    ) {
      obj.step =
        ((obj.lyricsImage.Height - obj.height) * (total - current)) /
        total /
        obj.stepHight;
    }
  }
};

const loadTrackObj = (handle: IMetadbHandle) => {
  obj.step = 0;
  obj.albumArt?.Dispose();
  obj.albumArt = handle.GetAlbumArtEmbedded();
  obj.lyrics = getLyrics(handle);
  generateLyricsLayouts();
  generateLyricsImage();
  generateLyricsShadowImage();
};
const releaseTrackObj = () => {
  obj.albumArt?.Dispose();
  obj.albumArt = null;

  releaseLyricsLayouts(obj.lyricsLayout);
  obj.lyricsLayout = [];

  obj.lyricsImage?.Dispose();
  obj.lyricsImage = null;

  obj.lyrics = [];
};

const generateLyricsShadowImage = () => {
  obj.lyricsShadowImage?.Dispose();
  const hight =
    obj.lyricsLayout.reduce((total, current) => {
      return total + current.CalcTextHeight(obj.width);
    }, 0) + obj.height;
  if (hight > 0 && obj.width > 0) {
    obj.lyricsShadowImage = utils.CreateImage(obj.width, hight);
    const lyricsGr = obj.lyricsShadowImage.GetGraphics();

    let y = obj.height / 2;
    obj.lyricsLayout.forEach((layout) => {
      const h = layout.CalcTextHeight(obj.width);
      renderLyric(lyricsGr, layout, 0, y, obj.width, h, colors.shadow);
      y += h;
    });
    obj.lyricsShadowImage.ReleaseGraphics();
  }
};
const generateLyricsImage = () => {
  obj.lyricsImage?.Dispose();
  const hight =
    obj.lyricsLayout.reduce((total, current) => {
      return total + current.CalcTextHeight(obj.width);
    }, 0) + obj.height;
  if (hight > 0 && obj.width > 0) {
    obj.lyricsImage = utils.CreateImage(obj.width, hight);
    const lyricsGr = obj.lyricsImage.GetGraphics();

    let y = obj.height / 2;
    obj.lyricsLayout.forEach((layout) => {
      const h = layout.CalcTextHeight(obj.width);
      renderLyric(lyricsGr, layout, 0, y, obj.width, h);
      y += h;
    });
    obj.lyricsImage.ReleaseGraphics();
  }
};
const generateLyricsHighlightImage = () => {
  obj.lyricsHighlightImage?.Dispose();
  const current = fb.PlaybackTime;
  const highlightIndex = calcHighlightIndex(obj.lyrics, current);

  const hight =
    obj.lyricsLayout.reduce((total, current) => {
      return total + current.CalcTextHeight(obj.width);
    }, 0) + obj.height;
  if (hight > 0 && obj.width > 0) {
    obj.lyricsHighlightImage = utils.CreateImage(obj.width, hight);
    const lyricsGr = obj.lyricsHighlightImage.GetGraphics();

    let y = obj.height / 2;
    obj.lyrics.forEach((_, index) => {
      const layout = obj.lyricsLayout[index];
      const h = layout.CalcTextHeight(obj.width);
      if (index === highlightIndex) {
        renderLyric(lyricsGr, layout, 0, y, obj.width, h, colors.highlight);
      }
      y += h;
    });
    obj.lyricsHighlightImage.ReleaseGraphics();
  }
};
const generateLyricsLayout = (str: string) => {
  return utils.CreateTextLayout(
    str,
    fonts.text.name,
    fonts.text.size,
    fonts.text.weight,
    fonts.text.style,
    fonts.text.stretch,
    DWRITE_TEXT_ALIGNMENT_CENTER,
    DWRITE_PARAGRAPH_ALIGNMENT_CENTER,
    DWRITE_WORD_WRAPPING_WRAP
  );
};
const generateLyricsLayouts = () => {
  releaseLyricsLayouts(obj.lyricsLayout);
  obj.lyricsLayout = obj.lyrics.map((str) =>
    generateLyricsLayout(str.replace(/\[[0-9:.]+\]/g, ""))
  );
};
const releaseLyricsLayouts = (arr: ITextLayout[]) => {
  arr.forEach((layout) => layout.Dispose());
};
const resetTimer = () => {
  window.ClearInterval(obj.timer);
  obj.timer = window.SetInterval(mainLoop, obj.interval);
};
const stopTimer = () => {
  window.ClearInterval(obj.timer);
};

const renderAlbumArt = (gr: IJSGraphics) => {
  if (obj.albumArt) {
    const size = calcImageSize(
      obj.albumArt,
      obj.width,
      obj.height - obj.padding * 2,
      LyricsView.background.stretch,
      LyricsView.background.keepAspectRatio
    )!;
    gr.DrawImage(
      obj.albumArt,
      size.x,
      size.y + obj.padding,
      size.width,
      size.height,
      0,
      0,
      obj.albumArt.Width,
      obj.albumArt.Height,
      LyricsView.background.opacity,
      LyricsView.background.angle
    );
  }
};
const renderLyric = (
  gr: IJSGraphics,
  layout: ITextLayout,
  x: number,
  y: number,
  w: number,
  h: number,
  colour = colors.main
) => {
  gr.WriteTextLayout(layout, colour, x, y, w, h);
};
const renderLyrics = (gr: IJSGraphics) => {
  if (!obj.lyricsImage) return;
  const total = fb.PlaybackLength;
  const current = fb.PlaybackTime;
  if (total === 0) return;
  const y = Math.min(
    (obj.lyricsImage.Height - obj.height) * (current / total) +
      obj.step * obj.stepHight,
    obj.lyricsImage.Height - obj.height
  );
  if (LyricsView.shadow.enabled && obj.lyricsShadowImage)
    gr.DrawImage(
      obj.lyricsShadowImage,
      0 + LyricsView.shadow.position.x,
      obj.padding + LyricsView.shadow.position.y,
      obj.width,
      obj.height - obj.padding * 2,
      0,
      y > 0 ? y : 0,
      obj.width,
      obj.height
    );

  gr.DrawImage(
    obj.lyricsImage,
    0,
    obj.padding,
    obj.width,
    obj.height - obj.padding * 2,
    0,
    y > 0 ? y : 0,
    obj.width,
    obj.height
  );
  if (obj.lyricsHighlightImage)
    gr.DrawImage(
      obj.lyricsHighlightImage,
      0,
      obj.padding,
      obj.width,
      obj.height - obj.padding * 2,
      0,
      y > 0 ? y : 0,
      obj.width,
      obj.height
    );
};

/**
 * callbacks
 */

const on_paint = (gr: IJSGraphics) => {
  gr.FillRectangle(0, 0, obj.width, obj.height, colors.background);
  renderAlbumArt(gr);
  renderLyrics(gr);
};
const on_playback_new_track = (handle: IMetadbHandle) => {
  loadTrackObj(handle);
  resetTimer();
  window.Repaint();
};
const on_playback_stop = (reason: number) => {
  if (reason !== PlaybackStopReason.starting_another) {
    stopTimer();
    releaseTrackObj();
    window.Repaint();
  }
};
const on_playback_pause = (isPause: boolean) => {
  if (isPause) {
    stopTimer();
  } else {
    resetTimer();
  }
};
const on_size = () => {
  obj.height = window.Height;
  obj.width = window.Width;
  generateLyricsImage();
  generateLyricsShadowImage();
  generateLyricsHighlightImage();
};
const on_mouse_wheel = (step: number) => {
  setScrollPosition(step);
  window.Repaint();
};

/**
 * init
 */
const init = () => {
  const db = fb.GetNowPlaying();
  if (db) {
    loadTrackObj(db);
  }
  if (fb.IsPlaying) {
    resetTimer();
  }
  if (fb.IsPaused) {
    stopTimer();
  }
  db?.Dispose();
  window.Repaint();
};
const mainLoop = () => {
  generateLyricsHighlightImage();
  window.Repaint();
};

init();
