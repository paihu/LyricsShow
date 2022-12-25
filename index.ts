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

const getDefaultFont = (): {
  Name: string;
  Size: number;
  Style: number;
  Weight: number;
} => {
  try {
    return JSON.parse(window.GetFontCUI(0));
  } catch {
    return JSON.parse(window.GetFontDUI(0));
  }
};
const getArtist = (handle: IFileInfo) => {
  const artistIdx = handle.MetaFind("ARTIST");
  if (artistIdx !== -1) {
    return handle.MetaValue(artistIdx, 0);
  }
  const albumArtistIdx = handle.MetaFind("ALBUM ARTIST");
  if (albumArtistIdx !== -1) {
    return handle.MetaValue(albumArtistIdx, 0);
  }
  return "";
};
const getTitle = (handle: IFileInfo) => {
  const idx = handle.MetaFind("TITLE");
  if (idx !== -1) {
    return handle.MetaValue(idx, 0);
  }
  return "";
};
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
          const title = getTitle(fileInfo);
          const artist = getArtist(fileInfo);
          if (!artist) break;
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
  image: IJSImage | undefined,
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
  const msec = Math.floor((time % 1) * 100).toString();
  const sec = Math.floor(time % 60).toString();
  const min = Math.floor((time % 3600) / 60).toString();
  const hour = Math.floor(time / 3600).toString();
  if (hour !== "0") {
    return `${padding02(hour)}:${padding02(min)}:${padding02(sec)}.${padding02(
      msec
    )}`;
  } else {
    return `${padding02(min)}:${padding02(sec)}.${padding02(msec)}`;
  }
};

const calcCurrentLyricsLine = (lyricTimes: number[], time: number) => {
  let index = -1;
  lyricTimes.forEach((current, idx) => {
    if (current >= 0 && current < time) {
      index = idx;
    }
  });
  return index;
};

type Menu = {
  idx: number;
  menu: IMenuObj;
  func: { [key in number]?: () => void };
};
type MenuProps = {
  idx: number;
  menu?: IMenuObj;
  func: { [key in number]?: () => void };
};

const buildMenu = (
  items: {
    caption: string;
    func?: () => void;
    sub?: { caption: string; func: () => void }[];
  }[],
  parent: MenuProps = {
    idx: 1,
    func: {},
  },
  caption: string = ""
): Menu => {
  const menu = window.CreatePopupMenu();
  if (parent.menu) {
    menu.AppendTo(parent.menu, MF_STRING, caption);
  } else {
    parent.menu = menu;
  }
  for (const item of items) {
    if (item.sub) {
      const child = buildMenu(
        item.sub,
        { ...parent, menu: menu },
        item.caption
      );
      parent = { ...child, menu: parent.menu };
      continue;
    }
    parent.func[parent.idx] = item.func;
    menu.AppendMenuItem(MF_STRING, parent.idx++, item.caption);
  }
  return { ...parent, menu: parent.menu! };
};

const fontWeight = (isBold: boolean) => {
  return isBold ? 700 : 400;
};
const fontStyle = (isItalic: boolean) => {
  return isItalic ? DWRITE_FONT_STYLE_ITALIC : DWRITE_FONT_STYLE_NORMAL;
};
/**
 * global objects
 */

const obj: {
  mode: "View" | "Edit" | "EditView";
  height: number;
  width: number;
  albumArt?: IJSImage;
  lyrics: {
    raw: string[];
    view: string[];
    time: number[];
    y: number[];
  };

  lyricsUnsyncedHighlight: boolean;
  lyricsIsSync: boolean;
  lyricsLayout: ITextLayout[];
  lyricsImage?: IJSImage;
  lyricsShadowImage?: IJSImage;
  lyricsHighlightImage?: IJSImage;
  lyricsOrder: (LyricsFileType | LyricsTags)[];
  lyricsSearchPath: string;
  lyricsEditStepTime: number;
  lyricsEditSeekStepTime: number;
  noLyricsLayout?: ITextLayout;
  noLyricsImage?: IJSImage;
  padding: number;
  timer: number;
  interval: number;
  stepHight: number;
  step: number;
} = {
  mode: "View",
  height: 0,
  width: 0,
  lyrics: { raw: [], view: [], time: [], y: [] },
  lyricsIsSync: false,
  lyricsUnsyncedHighlight: window.GetProperty(
    "Panel.Lyrics.Unsynced.Highlight",
    false
  ),
  lyricsLayout: [],
  lyricsOrder: ["LYRICS", "lrc", "UNSYNCED LYRICS", "txt"],
  lyricsSearchPath: window.GetProperty<string>(
    "Panel.SearchPath",
    ws.SpecialFolders.Item("Desktop")
  ),
  lyricsEditStepTime: window.GetProperty("Panel.Edit.stepTime", 14),
  lyricsEditSeekStepTime: window.GetProperty("Panel.Edit.SeekTime", 5000),
  padding: window.GetProperty("Panel.Padding", 5),
  timer: -1,
  interval: window.GetProperty("Panel.Interval", 30),
  stepHight: 30,
  step: 0,
};
const fonts = {
  text: {
    name: utils.CheckFont(
      window.GetProperty("Panel.Font.Name", getDefaultFont().Name)
    )
      ? window.GetProperty("Panel.Font.Name", "Yu Gothic UI")
      : "Yu Gothic UI",
    size: window.GetProperty("Panel.Font.Size", 13),
    weight: fontWeight(window.GetProperty("Panel.Font.Bold", false)),
    style: fontStyle(window.GetProperty("Panel.Font.Italic", false)),
    stretch: DWRITE_FONT_STRETCH_NORMAL,
  },
};
const textFontString = () => {
  JSON.stringify({
    Name: fonts.text.name,
    Size: fonts.text.size,
    Style: fonts.text.style,
    Weight: fonts.text.weight,
    Stretch: fonts.text.stretch,
  });
};
const colors = {
  main: window.GetProperty("Panel.Lyrics.Main.Color", RGB(190, 190, 190)),
  highlight: window.GetProperty(
    "Panel.Lyrics.Highlight.Color",
    RGB(255, 142, 196)
  ),
  shadow: window.GetProperty("Panel.Lyrics.Shadow.Color", RGB(0, 0, 0)),
  background: window.GetProperty(
    "Panel.Lyrics.Background.Color",
    RGB(76, 76, 76)
  ),
  editMain: window.GetProperty("Panel.Edit.Main.Color", RGB(80, 80, 80)),

  editBackground: window.GetProperty(
    "Panel.Edit.Background.Color",
    RGB(255, 255, 255)
  ),
  editHighlight: window.GetProperty(
    "Panel.Edit.HighlightBackground.Color",
    RGB(193, 219, 252)
  ),
  editViewBackground: window.GetProperty(
    "Panel.EditView.Background.Color",
    RGB(236, 244, 254)
  ),
  editViewHighlight: window.GetProperty(
    "Panel.EditView.HighlightBackground.Color",
    RGB(193, 219, 252)
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
    -1
  );
  const nextLine = obj.lyrics.time.reduce((acc, cur, index) => {
    if (index < currentLine) return acc;
    if (acc === -1 && current < cur) return index;
    return acc;
  }, -1);

  const basePos = obj.lyrics.y[currentLine] || -LyricsView.fonts.text.size;
  const targetPos = (() => {
    if (typeof obj.lyrics.y[nextLine] !== "number")
      return obj.lyricsImage!.Height - obj.height;
    if (currentLine === -1 && nextLine === 0) return 0;
    return obj.lyrics.y[nextLine];
  })();

  const baseTime = obj.lyrics.time[currentLine] || 0;
  const targetTime =
    typeof obj.lyrics.time[nextLine] === "number"
      ? obj.lyrics.time[nextLine]
      : total;

  const delta = targetPos - basePos;

  return basePos + (delta * (current - baseTime)) / (targetTime - baseTime);
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
  obj.albumArt = handle.GetAlbumArtEmbedded() ?? undefined;
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
  obj.albumArt = undefined;

  releaseLyricsLayouts(obj.lyricsLayout);
  obj.lyricsLayout = [];

  obj.lyricsImage?.Dispose();
  obj.lyricsImage = undefined;

  obj.lyrics = { raw: [], view: [], time: [], y: [] };
};

const generateLyricsShadowImage = () => {
  obj.lyricsShadowImage?.Dispose();
  obj.lyricsShadowImage = undefined;
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
  if (obj.lyrics.y.length === 0) return 0;
  return obj.lyrics.y[obj.lyrics.y.length - 1] + obj.height;
};
const generateLyricsImage = () => {
  obj.lyricsImage?.Dispose();
  obj.lyricsImage = undefined;
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
  obj.lyricsHighlightImage = undefined;
  const current = fb.PlaybackTime;
  const highlightIndex = calcCurrentLyricsLine(obj.lyrics.time, current);
  if (highlightIndex === -1 || highlightIndex >= obj.lyricsLayout.length)
    return;

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
const releaseLyricsLayouts = (layouts: ITextLayout[] | ITextLayout) => {
  if (Array.isArray(layouts)) {
    layouts.forEach((layout) => layout.Dispose());
  } else {
    layouts.Dispose();
  }
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
  const y = Math.max(
    Math.min(
      currentPosition + obj.step * obj.stepHight,
      obj.lyricsImage.Height - obj.height
    ),
    0
  );
  if (LyricsView.shadow.enabled && obj.lyricsShadowImage)
    gr.DrawImage(
      obj.lyricsShadowImage,
      0 + LyricsView.shadow.position.x,
      obj.padding + LyricsView.shadow.position.y,
      obj.width,
      obj.height - obj.padding * 2,
      0,
      y,
      obj.width,
      obj.height - obj.padding * 2
    );

  gr.DrawImage(
    obj.lyricsImage,
    0,
    obj.padding,
    obj.width,
    obj.height - obj.padding * 2,
    0,
    y,
    obj.width,
    obj.height - obj.padding * 2
  );
  if (obj.lyricsHighlightImage)
    gr.DrawImage(
      obj.lyricsHighlightImage,
      0,
      obj.padding,
      obj.width,
      obj.height - obj.padding * 2,
      0,
      y,
      obj.width,
      obj.height - obj.padding * 2
    );
};
const getLyricsLine = (y: number) => {
  if (!obj.lyricsIsSync || !obj.lyricsImage) return;
  const currentPosition = calcCurrentPosition();
  if (!currentPosition) return;
  const lyricsImageY =
    Math.min(
      currentPosition + obj.step * obj.stepHight,
      obj.lyricsImage.Height - obj.height
    ) +
    obj.padding +
    y -
    obj.height / 2;
  const line = obj.lyrics.y.reduce(
    (acc, cur, index) => (cur < lyricsImageY ? index - 1 : acc),
    -1
  );
  if (!obj.lyrics.view[line]) return;
  return line;
};

/**
 * Editor
 */

const renderEditBackground = (
  gr: IJSGraphics,
  colour = colors.editBackground
) => {
  gr.FillRectangle(0, 0, obj.width, obj.height, colour);
  const h = obj.lyricsLayout[0].CalcTextHeight(100000000000000);
  for (var i = 0; i < obj.height; i += h) {
    gr.DrawLine(
      0 + obj.padding,
      i,
      obj.width - obj.padding,
      i,
      1,
      RGB(192, 192, 192)
    );
  }
};
const renderEditLyrics = (gr: IJSGraphics) => {
  const currentLine = obj.lyrics.time.reduce(
    (acc, cur, index) => (cur > 0 ? index : acc),
    0
  );
  var pos = 0;
  for (var i = currentLine - 2; i < obj.lyrics.view.length; i++) {
    const time = obj.lyrics.time[i] || 0;
    const layout = utils.CreateTextLayout(
      `${i !== -2 && time !== -1 ? `[${timeToTimeTag(time)}] ` : ""}${
        obj.lyrics.view[i] || ""
      }`,
      fonts.text.name,
      fonts.text.size,
      fonts.text.weight,
      fonts.text.style,
      fonts.text.stretch,
      DWRITE_TEXT_ALIGNMENT_CENTER,
      DWRITE_PARAGRAPH_ALIGNMENT_CENTER,
      DWRITE_WORD_WRAPPING_WRAP
    );
    if (i === currentLine) {
      gr.FillRectangle(
        0,
        pos,
        obj.width,
        layout.CalcTextHeight(obj.width),
        setAlpha(colors.editHighlight, 210)
      );
    }
    gr.WriteTextLayout(
      layout,
      colors.editMain,
      0,
      pos,
      obj.width,
      layout.CalcTextHeight(obj.width)
    );
    pos += layout.CalcTextHeight(obj.width);
    releaseLyricsLayouts(layout);
    if (pos > obj.height) break;
  }
};
const renderEditViewLyrics = (gr: IJSGraphics) => {
  const current = fb.PlaybackTime;
  const currentLine =
    calcCurrentLyricsLine(obj.lyrics.time, current) !== -1
      ? calcCurrentLyricsLine(obj.lyrics.time, current)
      : 0;
  var pos = 0;
  for (var i = currentLine - 2; i < obj.lyrics.view.length; i++) {
    const time = obj.lyrics.time[i] || 0;
    const layout = utils.CreateTextLayout(
      `${i !== -2 && time !== -1 ? `[${timeToTimeTag(time)}] ` : ""}${
        obj.lyrics.view[i] || ""
      }`,
      fonts.text.name,
      fonts.text.size,
      fonts.text.weight,
      fonts.text.style,
      fonts.text.stretch,
      DWRITE_TEXT_ALIGNMENT_CENTER,
      DWRITE_PARAGRAPH_ALIGNMENT_CENTER,
      DWRITE_WORD_WRAPPING_WRAP
    );
    if (i === currentLine) {
      gr.FillRectangle(
        0,
        pos,
        obj.width,
        layout.CalcTextHeight(obj.width),
        setAlpha(colors.editViewHighlight, 210)
      );
    }
    gr.WriteTextLayout(
      layout,
      colors.editMain,
      0,
      pos,
      obj.width,
      layout.CalcTextHeight(obj.width)
    );
    pos += layout.CalcTextHeight(obj.width);
    releaseLyricsLayouts(layout);
    if (pos > obj.height) break;
  }
};
/**
 * menu
 */

const colorMenuItems = [
  {
    caption: "color",
    func: () => {},
    sub: [
      {
        caption: "main",
        func: () => {
          window.SetProperty(
            "Panel.Lyrics.Main.Color",
            utils.ColourPicker(colors.main)
          );
          colors.main = window.GetProperty(
            "Panel.Lyrics.Main.Color",
            colors.main
          );
          init();
        },
      },
      {
        caption: "shadow",
        func: () => {
          window.SetProperty(
            "Panel.Lyrics.Shadow.Color",
            utils.ColourPicker(colors.shadow)
          );
          colors.shadow = window.GetProperty(
            "Panel.Lyrics.Shadow.Color",
            colors.shadow
          );
          init();
        },
      },
      {
        caption: "highlight",
        func: () => {
          window.SetProperty(
            "Panel.Lyrics.Highlight.Color",
            utils.ColourPicker(colors.highlight)
          );
          colors.highlight = window.GetProperty(
            "Panel.Lyrics.Highlight.Color",
            colors.highlight
          );
          init();
        },
      },
    ],
  },
];
const styleItems = [
  {
    caption: "style",
    func: () => {},
    sub: [
      {
        caption: "bold",
        func: () => {
          window.SetProperty(
            "Panel.Font.Bold",
            !window.GetProperty("Panel.Font.Bold", false)
          );
          fonts.text.weight = fontWeight(
            window.GetProperty("Panel.Font.Bold", false)
          );
          init();
        },
      },
      {
        caption: "italic",
        func: () => {
          window.SetProperty(
            "Panel.Font.Italic",
            !window.GetProperty("Panel.Font.Italic", false)
          );
          fonts.text.style = fontStyle(
            window.GetProperty("Panel.Font.Italic", false)
          );
          init();
        },
      },
    ],
  },
];
const mainMenuItem = [
  {
    caption: "EditMode",
    func: () => {
      obj.mode = obj.lyricsIsSync ? "EditView" : "Edit";
      window.Repaint();
    },
  },
  {
    sub: [...colorMenuItems, ...styleItems],
    func: () => {},
    caption: "text",
  },
];

const editColorMenuItems = [
  {
    caption: "text",
    func: () => {
      window.SetProperty(
        "Panel.Lyrics.Main.Color",
        utils.ColourPicker(colors.editMain)
      );
      colors.editMain = window.GetProperty(
        "Panel.Edit.Main.Color",
        colors.editMain
      );
    },
  },
  {
    caption: "background",
    func: () => {
      window.SetProperty(
        "Panel.Edit.Background.Color",
        utils.ColourPicker(colors.editBackground)
      );
      colors.editBackground = window.GetProperty(
        "Panel.Edit.HighlightBackground.Color",
        colors.editBackground
      );
      init();
    },
  },
  {
    caption: "highlightBackground",
    func: () => {
      window.SetProperty(
        "Panel.EditView.Background.Color",
        utils.ColourPicker(colors.editHighlight)
      );
      colors.editHighlight = window.GetProperty(
        "Panel.EditView.HighlightBackground.Color",
        colors.editHighlight
      );
      init();
    },
  },
  {
    caption: "editBackground",
    func: () => {
      window.SetProperty(
        "Panel.Lyrics.Highlight.Color",
        utils.ColourPicker(colors.editViewBackground)
      );
      colors.editViewBackground = window.GetProperty(
        "Panel.Lyrics.Highlight.Color",
        colors.editViewBackground
      );
      init();
    },
  },
  {
    caption: "editHighlightBackground",
    func: () => {
      window.SetProperty(
        "Panel.Lyrics.Highlight.Color",
        utils.ColourPicker(colors.editViewHighlight)
      );
      colors.editViewHighlight = window.GetProperty(
        "Panel.Lyrics.Highlight.Color",
        colors.editViewHighlight
      );
      init();
    },
  },
];
const editMenuItem = [
  {
    caption: "EditMode",
    func: () => {
      obj.mode = "Edit";
      window.Repaint();
    },
  },
  {
    caption: "EditViewMode",
    func: () => {
      obj.mode = "EditView";
      window.Repaint();
    },
  },
  {
    caption: "ViewMode",
    func: () => {
      obj.mode = "View";
      window.Repaint();
    },
  },
  {
    caption: "SaveToFile",
    func: () => {
      const lyricsStr = obj.lyrics.view.reduce((acc, cur, index) => {
        const time = obj.lyrics.time[index];
        return `${acc !== "" ? `${acc}\n` : ""}${
          time >= 0 ? `[${timeToTimeTag(time)}]` : ""
        }${cur.trim()}`;
      }, "");
      console.log(lyricsStr);
      const handle = fb.GetNowPlaying();
      const fileInfo = handle?.GetFileInfo();
      if (!fileInfo) {
        handle?.Dispose();
        return;
      }
      const artist = getArtist(fileInfo);
      const title = getTitle(fileInfo);
      if (!artist || !title) {
        fileInfo.Dispose();
        handle?.Dispose();
        return;
      }
      const path = `${obj.lyricsSearchPath}${artist.replace(
        "*",
        "＊"
      )}\\${title.replace("*", "＊")}.lrc`;
      utils.WriteTextFile(path, lyricsStr);
      fileInfo.Dispose();
      handle?.Dispose();
    },
  },
  {
    sub: editColorMenuItems,
    func: () => {},
    caption: "text",
  },
  ...styleItems,
];
const menu: { View: Menu; Edit: Menu; EditView: Menu } = {
  View: buildMenu(mainMenuItem),
  Edit: buildMenu(editMenuItem),
  EditView: buildMenu(editMenuItem),
};

/**
 * callbacks
 */

const on_paint = (gr: IJSGraphics) => {
  switch (obj.mode) {
    case "View":
      gr.FillRectangle(0, 0, obj.width, obj.height, colors.background);
      renderAlbumArt(gr);
      renderLyrics(gr);
      break;
    case "Edit":
      renderEditBackground(gr);
      renderEditLyrics(gr);
      break;
    case "EditView":
      renderEditBackground(gr, colors.editViewBackground);
      renderEditViewLyrics(gr);
      break;
  }
};
const on_playback_new_track = (handle: IMetadbHandle) => {
  loadTrackObj(handle);
  resetTimer();
  obj.mode = "View";
  window.Repaint();
};
const on_playback_stop = (reason: number) => {
  if (reason !== PlaybackStopReason.starting_another) {
    stopTimer();
    releaseTrackObj();
    obj.mode = "View";
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
  switch (obj.mode) {
    case "View":
      calcLyricsLineY();
      generateLyricsImage();
      generateLyricsShadowImage();
      generateLyricsHighlightImage();
      break;
    case "Edit":
      break;
  }
};
const on_mouse_wheel = (step: number) => {
  const current = fb.PlaybackTime;
  const index = calcCurrentLyricsLine(obj.lyrics.time, current);
  switch (obj.mode) {
    case "View":
      setScrollPosition(step);
      break;
    case "Edit":
      if (step > 0) {
        if (index >= 0) obj.lyrics.time[index] = -1;
      } else {
        if (index > obj.lyrics.view.length) return;
        if (!fb.IsPaused) obj.lyrics.time[index + 1] = current;
      }
      break;
    case "EditView":
      if (step > 0) {
        for (var i = index - 1; i >= 0; i--)
          if (obj.lyrics.time[i] && obj.lyrics.time[i] >= 0) {
            fb.PlaybackTime = obj.lyrics.time[i];
            break;
          }
      } else {
        for (var i = index + 1; i < obj.lyrics.time.length; i++)
          if (obj.lyrics.time[i] && obj.lyrics.time[i] >= 0) {
            fb.PlaybackTime = obj.lyrics.time[i] + 1;
            break;
          }
      }
      break;
  }
  window.Repaint();
};
const on_mouse_lbtn_down: on_mouse_lbtn_down = (_x, _y) => {
  switch (obj.mode) {
    case "View":
      break;
    case "Edit":
      const current = fb.PlaybackTime;
      const index = calcCurrentLyricsLine(obj.lyrics.time, current);
      obj.lyrics.time[index + 1] = current;

      break;
  }
};
const on_mouse_lbtn_dblclk: on_mouse_lbtn_dblclk = (_x, y) => {
  switch (obj.mode) {
    case "View":
      const beforePos = calcCurrentPosition();
      if (!beforePos) return;
      const line = getLyricsLine(y);
      if (typeof line === "number") {
        fb.PlaybackTime = obj.lyrics.time[line];
        const afterPos = calcCurrentPosition();
        if (!afterPos) return;
        obj.step -= (afterPos - beforePos) / obj.stepHight;
      }
    case "Edit":
      break;
  }
};
const on_mouse_rbtn_up: on_mouse_lbtn_up = (x, y) => {
  const idx = menu[obj.mode].menu.TrackPopupMenu(x, y);
  const f = menu[obj.mode].func[idx];
  if (typeof f === "function") f();

  return true;
};
const on_key_down: on_key_down = (vkey) => {
  switch (obj.mode) {
    case "Edit":
      switch (vkey) {
        case VK_LEFT:
          fb.PlaybackTime = Math.max(
            fb.PlaybackTime - obj.lyricsEditSeekStepTime / 1000,
            0
          );
          break;
        case VK_RIGHT:
          fb.PlaybackTime = Math.min(
            fb.PlaybackTime + obj.lyricsEditSeekStepTime / 1000,
            fb.PlaybackLength
          );
          break;
        case VK_RETURN:
          const current = fb.PlaybackTime;
          const index = calcCurrentLyricsLine(obj.lyrics.time, current);
          if (index > obj.lyrics.view.length) return;
          if (!fb.IsPaused) obj.lyrics.time[index + 1] = current;
          break;
      }
      break;
    case "EditView":
      const current = fb.PlaybackTime;
      const index = calcCurrentLyricsLine(obj.lyrics.time, current);
      switch (vkey) {
        case VK_UP:
          if (obj.lyrics.time[index] >= 0) {
            obj.lyrics.time[index] -= obj.lyricsEditStepTime / 1000;
            fb.PlaybackTime = obj.lyrics.time[index];
          }
          break;
        case VK_DOWN:
          if (obj.lyrics.time[index] >= 0) {
            obj.lyrics.time[index] += obj.lyricsEditStepTime / 1000;
            fb.PlaybackTime = obj.lyrics.time[index];
          }
          break;
        case VK_LEFT:
          fb.PlaybackTime = Math.max(
            fb.PlaybackTime - obj.lyricsEditSeekStepTime / 1000,
            0
          );
          break;
        case VK_RIGHT:
          fb.PlaybackTime = Math.min(
            fb.PlaybackTime + obj.lyricsEditSeekStepTime / 1000,
            fb.PlaybackLength
          );
          break;
      }
      break;
  }
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
