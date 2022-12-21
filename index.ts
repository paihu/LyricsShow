const RGBRe = /^#[0-9a-fA-F]{6}$/;
const TimeTagRe = /\[([\d.:]+)\]/;
const TimeTagAllRe = /\[([\d.:]+)\]/g;
const TimeTagSplitRe = /[:.]/;
const parseRGB = (str: string): number | undefined => {
  if (!str.match(RGBRe)) return;
  return 0xff000000 & parseInt(str.substring(1), 16);
};

const ws = new ActiveXObject("WScript.Shell");

type LyricsTags = "LYRICS" | "UNSYNCED LYRICS";
type LyricsFileType = "txt" | "lrc";

const getLyrics = (handle: IMetadbHandle) => {
  const lyrics: {
    raw: string[];
    view: string[];
    time: number[];
    y: number[];
  } = { raw: [], view: [], time: [], y: [] };
  const fileInfo = handle.GetFileInfo();
  try {
    obj.lyricsOrder.forEach((type) => {
      if (lyrics.raw.length > 0) {
        return lyrics;
      }
      switch (type) {
        case "UNSYNCED LYRICS":
        case "LYRICS":
          const lyricsIdx = fileInfo.MetaFind(type);
          if (lyricsIdx != -1) {
            const count = fileInfo.MetaValueCount(lyricsIdx);
            for (var i = 0; i < count; i++) {
              lyrics.raw.push(
                ...fileInfo.MetaValue(lyricsIdx, i).split(/\r?\n/)
              );
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
            lyrics.raw.push(...lines);
          }
          break;
      }
    });
  } finally {
    fileInfo.Dispose();
  }
  if (lyrics.raw.length > 0) {
    lyrics.view = lyrics.raw.map((line) => {
      return line.replace(TimeTagAllRe, "");
    });
    lyrics.time = lyrics.raw.map((line) => {
      const matched = line.match(TimeTagRe);
      if (!matched) {
        return -1;
      } else {
        return timeTagToTime(matched[1]);
      }
    });
  }
  return lyrics;
};

const calcImageSize = (
  image: IJSImage | null,
  dispW: number,
  dispH: number,
  stretch: boolean,
  keepAspectRatio: boolean
) => {
  if (!image) return;
  let size: { x: number; y: number; width: number; height: number };
  if (stretch) {
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
    .split(TimeTagSplitRe)
    .reverse()
    .reduce((total, current, index) => {
      if (index === 0) {
        return total + parseInt(current, 10) / 10 ** current.length;
      }
      return total + parseInt(current, 10) * 60 ** (index - 1);
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
  if (hour !== "0") {
    return `${padding02(hour)}:${padding02(min)}:${padding02(sec)}.${padding03(
      msec
    )}`;
  } else {
    return `${padding02(min)}:${padding02(sec)}.${padding03(msec)}`;
  }
};

const calcHighlightIndex = (lyricTimes: number[], time: number) => {
  let index = -1;
  lyricTimes.forEach((current, idx) => {
    if (current >= 0 && current < time) {
      index = idx;
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
  lyrics: {
    raw: string[];
    view: string[];
    time: number[];
    y: number[];
  };

  lyricsUnsyncedHighlight: boolean;
  lyricsIsSync: boolean;
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
  lyrics: { raw: [], view: [], time: [], y: [] },
  lyricsIsSync: false,
  lyricsUnsyncedHighlight: window.GetProperty(
    "Panel.Lyrics.Unsynced.Highlight",
    false
  ),
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
  main: window.GetProperty("Panel.Lyrics.Main.Color", RGB(190, 190, 190)),
  highlight: window.GetProperty(
    "Panel.Lyrics.Highlight.Color",
    RGB(255, 142, 196)
  ),
  shadow: window.GetProperty("Panel.Lyrics.Shadow.Color", RGBA(0, 0, 0, 255)),
  background: window.GetProperty(
    "Panel.Lyrics.Background.Color",
    RGB(76, 76, 76)
  ),
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

const calcCurrentPosition = () => {
  const current = fb.PlaybackTime;
  const total = fb.PlaybackLength;
  if (!obj.lyricsImage || total === 0) return;
  if (!obj.lyricsIsSync)
    return (obj.lyricsImage.Height - obj.height) * (current / total);

  const currentLine = obj.lyrics.time.reduce(
    (acc, cur, index) => (cur === -1 ? acc : current > cur ? index : acc),
    0
  );
  const nextLine = obj.lyrics.time.reduce(
    (acc, cur, index) => (acc === -1 ? (current < cur ? index : acc) : acc),
    -1
  );
  const delta =
    (obj.lyrics.y[nextLine] || obj.lyricsImage.Height - obj.height) -
    obj.lyrics.y[currentLine];
  return (
    obj.lyrics.y[currentLine] +
    (delta * (current - obj.lyrics.time[currentLine])) /
      ((obj.lyrics.time[nextLine] || total) - obj.lyrics.time[currentLine])
  );
};
const setScrollPosition = (step: number) => {
  const currentPosition = calcCurrentPosition();
  if (currentPosition) {
    obj.step -= step;
    if (currentPosition < -obj.step * obj.stepHight) {
      obj.step = -currentPosition / obj.stepHight;
    } else if (
      obj.lyricsImage!.Height - obj.height - currentPosition <
      obj.step * obj.stepHight
    ) {
      obj.step =
        (obj.lyricsImage!.Height - obj.height - currentPosition) /
        obj.stepHight;
    }
  }
};

const loadTrackObj = (handle: IMetadbHandle) => {
  obj.step = 0;
  obj.albumArt?.Dispose();
  obj.albumArt = handle.GetAlbumArtEmbedded();
  obj.lyrics = getLyrics(handle);
  obj.lyricsIsSync = obj.lyrics.time.some((time) => {
    return time >= 0;
  });
  generateLyricsLayouts();
  calcLyricsLineY();
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

  obj.lyrics = { raw: [], view: [], time: [], y: [] };
};

const generateLyricsShadowImage = () => {
  obj.lyricsShadowImage?.Dispose();
  obj.lyricsShadowImage = null;
  const hight = calcLyricsImageHeight();
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
const calcLyricsImageHeight = () => {
  if (obj.lyrics.raw.length === 0) return 0;
  return (
    obj.lyrics.y[obj.lyrics.raw.length - 1] +
    obj.lyricsLayout[obj.lyrics.raw.length - 1].CalcTextHeight(obj.width) +
    obj.height
  );
};
const generateLyricsImage = () => {
  obj.lyricsImage?.Dispose();
  obj.lyricsImage = null;
  const hight = calcLyricsImageHeight();
  if (hight > 0 && obj.width > 0) {
    obj.lyricsImage = utils.CreateImage(obj.width, hight);
    const lyricsGr = obj.lyricsImage.GetGraphics();

    let y = obj.height / 2;
    obj.lyricsLayout.forEach((layout) => {
      const h = layout.CalcTextHeight(obj.width);
      renderLyric(
        lyricsGr,
        layout,
        0,
        y,
        obj.width,
        h,
        !obj.lyricsIsSync && obj.lyricsUnsyncedHighlight
          ? colors.highlight
          : colors.main
      );
      y += h;
    });
    obj.lyricsImage.ReleaseGraphics();
  }
};
const generateLyricsHighlightImage = () => {
  obj.lyricsHighlightImage?.Dispose();
  obj.lyricsHighlightImage = null;
  const current = fb.PlaybackTime;
  const highlightIndex = calcHighlightIndex(obj.lyrics.time, current);
  if (highlightIndex === -1) return;

  const hight = calcLyricsImageHeight();
  if (hight > 0 && obj.width > 0) {
    obj.lyricsHighlightImage = utils.CreateImage(obj.width, hight);
    const lyricsGr = obj.lyricsHighlightImage.GetGraphics();

    let y = obj.height / 2;
    renderLyric(
      lyricsGr,
      obj.lyricsLayout[highlightIndex],
      0,
      y + obj.lyrics.y[highlightIndex],
      obj.width,
      obj.lyricsLayout[highlightIndex].CalcTextHeight(obj.width),
      colors.highlight
    );
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
  obj.lyricsLayout = obj.lyrics.view.map((str) => generateLyricsLayout(str));
};
const calcLyricsLineY = () => {
  obj.lyrics.y = [0];
  for (var i = 0; i < obj.lyricsLayout.length; i++) {
    const layout = obj.lyricsLayout[i];
    obj.lyrics.y.push(
      obj.lyrics.y[obj.lyrics.y.length - 1] + layout.CalcTextHeight(obj.width)
    );
  }
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
  const currentPosition = calcCurrentPosition();
  if (!currentPosition) return;
  const y = Math.min(
    currentPosition + obj.step * obj.stepHight,
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
  calcLyricsLineY();
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
