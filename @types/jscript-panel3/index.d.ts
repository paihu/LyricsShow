interface IContextMenuManager {
  BuildMenu(menu: IMenuObj, base_id: number);
  Dispose();
  ExecuteByID(id: number): boolean;
  InitContext(handleList: IMetadbHandleList);
  InitContextPlaylist();
  InitNowPlaying();
}

interface IDropAction {
  Base: number;
  Effect: number;
  Playlist: number;
  ToSelect: boolean;
}
interface IFileInfo {
  readonly MetaCount: number;
  readonly InfoCount: number;
  Dispose();
  /**
   *
   * @param name
   * @return index for InfoName, InfoValue. return -1 on failure.
   */
  InfoFind(name: string): number;
  InfoName(idx: number): string;
  InfoValue(idx: number): string;
  /**
   *
   * @param name
   * @return index for MetaName, MetaValue, MetaValueCount. return -1 on failure.
   */
  MetaFind(name: string): number;
  MetaName(idx: number): string;
  MetaValue(idx: number, vIdx: number): string;
  MetaValueCount(idx: number): number;
}

interface IJSGraphics {
  DrawEllipse(
    centreX: number,
    centreY: number,
    radiusX: number,
    radiusY: number,
    lineWidth: number,
    colour: number
  );
  DrawImage(
    image: IJSImage,
    dstX: number,
    dstY: number,
    dstW: number,
    dstH: number,
    srcX: number,
    srcY: number,
    srcW: number,
    srcH: number,
    opacity?: number,
    angle?: number
  );

  DrawImageWithMask(
    image: IJSImage,
    mask: IJSImage,
    x: number,
    y: number,
    w: number,
    h: number
  );

  DrawLine(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    lineWidth: number,
    colour: number
  );

  DrawRectangle(
    startX: number,
    startY: number,
    w: number,
    h: number,
    lineWidth: number,
    colour: number
  );
  DrawRoundedRectangle(
    startX: number,
    startY: number,
    w: number,
    h: number,
    radiusX: number,
    radiusY: number,
    lineWidth: number,
    colour: number
  );
  FillEllipse(
    centreX: number,
    centreY: number,
    radiusX: number,
    radiusY: number,
    colour: number
  );
  FillGradientRectangle(
    startX: number,
    startY: number,
    w: number,
    h: number,
    direction: number,
    startColour: number,
    endColour: number
  );
  FillGradientRectangleAdvanced(
    startX: number,
    startY: number,
    w: number,
    h: number,
    brushStr: string
  );
  FillRectangle(
    startX: number,
    startY: number,
    w: number,
    h: number,
    colour: number
  );
  FillRoundedRectangle(
    startX: number,
    startY: number,
    w: number,
    h: number,
    radiusX: number,
    radiusY: number,
    colour: number
  );
  WriteText(
    text: string,
    font: FontString,
    colour: number,
    startX: number,
    startY: number,
    w: number,
    h: number,
    textAlignment?: number,
    paragraphAlignment?: number,
    wordWrapping?: number,
    trimmingGranularity?: number
  );
  WriteTextLayout(
    textLayout: ITextLayout,
    colour: cumber | string,
    startX: number,
    startY: number,
    w: number,
    h: number,
    verticalOffset?: number
  );
}

interface IJSImage {
  readonly Path: string;
  readonly Width: number;
  readonly Height: number;
  ApplyEffect(effect: ImageEffect);
  Clone(): IJSImage;
  Dispose();
  /**
   *
   * @param options see WICBitmapTransform
   */
  FlipRotate(options: number);
  GetColourScheme(count: number): VBArray<string>;
  GetGraphics(): IJSGraphics;
  ReleaseGraphics();
  Resize(w: number, h: number);
  SaveAs(path: string): boolean;
  StackBlur(radius: number);
}
interface IMainMenuManager {
  BuildMenu(parentMenu: IMenuObj, baseId: number);
  Dispose();
  ExecuteByID(id: number): boolean;
}
interface IMenuObj {
  /**
   *
   * @param flags see AppendMenuItemFlags
   * @param itemId
   * @param text
   */
  AppendMenuItem(flags: number, itemId: number, text: string);
  AppendMenuSeparator();
  /**
   *
   * @param parentMenu
   * @param flags see AppendMenuItemFlags
   * @param text
   */
  AppendTo(parentMenu: IMenuObj, flags: number, text: string);
  CheckMenuItem(itemId: number, check: boolean);
  CheckMenuRadioItem(
    firstItemId: number,
    lastItemId: number,
    selectedItemId: number
  );
  Dispose();
  /**
   *
   * @param x
   * @param y
   * @param flags see type TrackPopupMenuFlags
   */
  TrackPopupMenu(x: number, y: number, flags?: number): number;
}
interface IMetadbHandle {
  readonly FileCreated: number;
  readonly FileSize: number;
  readonly LastModified: number;
  readonly Length: number;
  readonly Path: string;
  readonly RawPath: string;
  readonly SubSong: number;
  Compare(handle: IMetadbHandle): boolean;
  Dispose();
  GetAlbumArt(artId?: AlbumArtId, wantStub?: boolean): IJSImage | null;
  GetAlbumArtAsync(windowId: number, artId?: AlbumArtId, wantStub?: boolean);
  GetAlbumArtEmbedded(artId?: AlbumArtId): IJSImage | null;
  GetFileInfo(): IFileInfo;
  IsInLibrary(): boolean;
  ShowAlbumArtViewer(artId?: AlbumArtId, wantStub?: boolean);
}
interface IMetadbHandleList {
  readonly Count: number;
  AddItem(handle: IMetadbHandle);
  AddItems(handleList: IMetadbHandleList);
  AttachImage(imagePath: string, artId?: AlbumArtId);
  CalcTotalDuration(): number;
  CalcTotalSize(): number;
  Clone(): IMetadbHandleList;
  CopyToClipboard(): boolean;
  DoDragDrop(effect: number): number;
  Dispose();
  Find(handle: IMetadbHandle): number;
  GetItem(idx: number): IMetadbHandle;
  GetLibraryRelativePaths(): VBArray<string>;
  GetOtherInfo(): string;
  GetQueryItems(query: string): IMetadbHandleList;
  InsertItem(idx: number, handle: IMetadbHandle);
  InsertItems(idx: number, handleList: IMetadbHandleList);
  MakeDifference(handleList: IMetadbHandleList);
  MakeIntersection(handleList: IMetadbHandleList);
  OptimiseFileLayout(minimise?: boolean);
  Randomise();
  RemoveAll();
  RemoveAttachedImage(artId?: AlbumArtId);
  RemoveAttachedImages();
  RemoveById(idx: number);
  RemoveDuplicates();
  RemoveDuplicatesByFormat(pattern: string);
  RemoveFromIdx(from: number, num: number);
  ReplaceItem(idx: number, handle: IMetadbHandle);
  RunContextCommand(command: string);
  SaveAs(path: string);
  SortByFormat(pattern: string, direction: number);
  SortByPath();
  SortByRelativePath();
  UpdateFileInfoFromJSON(str: string);
}
interface IPlayingItemLocation {
  readonly IsValid: boolean;
  readonly PlaylistIndex: number;
  readonly PlaylistItemIndex: number;
}
interface IProfiler {
  readonly Time: number;
  Reset();
  Print();
}
interface ISelectionHolder {
  SetSelection(handleList: IMetadbHandleList, type?: SelectionType);
  SetPlaylistSelectionTracking();
  SetPlaylistTracking();
}
interface ITextLayout {
  CalcTextHeight(maxWidth: number): number;
  Dispose();
}
interface IThemeManager {
  DrawThemeBackground(
    gr: IJSGraphics,
    x: number,
    y: number,
    w: number,
    h: number
  );
  GetThemeColour(propId: number): number;
  IsThemePartDefined(partId: number): boolean;
  SetPartAndStateID(partId: number, stateId?: number);
}
interface ITitleFormat {
  Dispose();
  Eval(): string;
  EvalActivePlaylistItem(playlistItemIndex: number): string;
  EvalPlaylistItem(playlistIndex: number, playlistItemIndex: number): string;
  EvalWithMetadb(handle: IMetadbHandle): string;
  EvalWithMetadbs(handleList: IMetadbHandleList): VBArray<string>;
}

/** ITooltip
 *
 * This will be used in the examples below:
 *
 * var tooltip = window.CreateTooltip();
 */
interface ITooltip {
  Text: string;
  TrackActive: boolean;

  Activate();
  Deactivate();
  /**
   * Use if you want multi-line tooltips.
   * @param w: maxWidth
   */
  SetMaxWidth(w: number);
  TrackPosition(x: number, y: number);
}

interface Console {
  GetLines(withTimestamp?: boolean): VBArray<string>;
  ClearBacklog();
}
const console: console;

interface fb {
  AlwaysOnTop: boolean;
  readonly ComponentPath: string;
  CursorFollowPlayback: boolean;
  readonly FoobarPath: string;
  readonly IsPaused: boolean;
  readonly IsPlaying: boolean;
  PlaybackFollowCursor: boolean;
  readonly PlaybackLength: number;
  PlaybackTime: number;
  readonly ProfilePath: string;
  ReplaygainMode: ReplaygainMode;
  StopAfterCurrent: boolean;
  Volume: number;

  // Shortcuts to main menu commands
  AddDirectory();
  AddFiles();
  Exit();
  LoadPlaylist();
  Next();
  Pause();
  Play();
  PlayOrPause();
  Prev();
  Random();
  SavePlaylist();
  ShowConsole();
  ShowPreferences();
  Stop();
  VolumeDown();
  VolumeMute();
  VolumeUp();

  AcquireSelectionHolder(): ISelectionHolder;
  AddLocationsAsync(windowId: number, paths: string[]): number;
  CheckClipboardContents(): boolean;
  CheckComponent(name: string): boolean;
  ClearPlaylist();
  CreateContextMenuManager(): IContextMenuManager;
  CreateHandleList(handle?: IMetadbHandle): IMetadbHandleList;
  CreateMainMenuManager(rootName: string): IMainMenuManager;
  GetClipboardContents(): IMetadbHandleList;
  /** return JSON array in string form. so you need to user JSON.parse on the result */
  GetDSPPresets(): string;
  GetFocusItem(): IMetadbHandle;
  GetLibraryItems(query: string): IMetadbHandleList;
  GetNowPlaying(): IMetadbHandle | null;
  /** return JSON array in string form. so you need to user JSON.parse on the result */
  GetOutputDevices(): string;
  GetSelection(flags: number): IMetadbHandleList;
  GetSelectionType(): SelectionType;
  IsLibraryEnabled(): boolean;
  /**
   *
   * @param command The full path to the command must be supplied. Cause is not important.
   * @return boolean Returns true if a matching command was found, false otherwise.
   */
  RunContextCommand(command: string): boolean;
  /**
   *
   * @param command The full path to the command must be supplied. Cause is not important.
   * @return boolean Returns true if a matching command was found, false otherwise.
   */
  RunMainMenuCommand(command: string): boolean;
  /**
   * See GetDSPPresets
   * @param idx
   */
  SetDSPPreset(idx: number);
  /**
   * See GetOutputDevices
   * @param outputId
   * @param deviceId
   */
  SetOutputDevice(outputId: string, deviceId: string);
  ShowLibrarySearchUI(query: string);
  TitleFormat(pattern: string): ITitleFormat;
}
declare const fb: fb;

interface plman {
  ActivePlaylist: number;
  PlaybackOrder: PlaybackOrder;
  readonly PlayingPlaylist: number;
  readonly PlaylistCount: number;
  readonly RecyclerCount: number;
}
declare const plman: plman;

interface utils {
  readonly Version: number;
  CalcTextWidth(
    text: string,
    fontName: string,
    fontSize: number,
    fontWeight?: DWRITE_FONT_WEIGHT,
    fontStyle?: DWrite_FONT_STYLE,
    fontStretch?: DWRITE_FONT_STRETCH
  ): number;
  CheckFont(name: string): boolean;
  ColourPicker(defaultColour: number): number;
  CreateFolder(path: string): boolean;
  CreateImage(w: number, h: number): IJSImage;
  CreateProfiler(name?: string): IProfiler;
  CreateTextLayout(
    text: string,
    fontName: string,
    fontSize: number,
    fontWeight?: number,
    fontStyle?: number,
    fontStretch?: number,
    textAlignment?: number,
    paragraphAlignment?: number,
    wordWrapping?: number,
    trimmingGranularity?: number
  ): ITextLayout;
  CreateTextLayout2(
    text: string,
    fonts: string,
    textAlignment?: DWRITE_TEXT_ALIGNMENT,
    paragraphAlignment?: DWRITE_PARAGRAPH_ALIGNMENT,
    wordWrapping?: DWRITE_WORD_WRAPPING,
    trimmingGranularity?: DWRITE_TRIMMING_GRANULARITY
  ): ITextLayout;
  DateStringToTimestamp(str: string): number;
  DetectCharset(path: string): number;
  DownloadFileAsync(windowId: number, url: string, path: string);
  FormatDuration(seconds: number): string;
  FormatFileSize(bytes: number): string;
  GetClipboardText(): string;
  GetFileSize(path: string): number;
  GetLastModified(path: string): number;
  GetSysnumber(idx: number): number;
  GetSystemMetrics(idx: number): number;
  /**
   *
   * @param pattern
   * @param excludeMask see type FILE_ATTRIBUTE
   * @param includeMask see type FILE_ATTRIBUTE
   */
  Glob(
    pattern: string,
    excludeMask?: number,
    includeMask?: number
  ): VBArray<string>;
  /**
   *
   * @param windowId
   * @param type
   * @param url
   * @param userAgentOrHeaders
   * @param postData
   * @param contentType
   * @return taskId for `on_http_request_done`
   */
  HTTPRequestAsync(
    windowId: number,
    type: number,
    url: string,
    userAgentOrHeaders: string,
    postData: string,
    contentType: string
  ): number;
  InputBox(
    prompt: string,
    title: string,
    defaultValue?: string,
    errorOnCancel?: boolean
  ): string;
  IsFile(path: string): boolean;
  IsFolder(path: string): boolean;
  IsKeyPressed(vkey: number): boolean;
  ListFiles(folder: string, recursive: boolean): VBArray<string>;
  ListFolders(folder: string, recursive: boolean): VBArray<string>;
  ListFonts(): VBArrays<string>;
  LoadImage(path: string): IJSImage | null;
  LoadImageAsync(windowId: number, path: string);
  LoadSVG(pathOrXML: string, maxWidth: number): IJSImage | null;
  /**
   *
   * @param prompt
   * @param title
   * @param flags combine MessageBoxButtons,MessageBoxIcons
   * @return MessageBoxReturnValues (see IDOK...IDNO)
   */
  MessageBox(prompt: string, title: string, flags: number): number;
  ReadINI(
    path: string,
    section: string,
    key: string,
    defaultValue?: string
  ): string;
  ReadTextFile(path: string, codepage?: number): string;
  ReadUTF8(path: string): string;
  RemovePath(path: string): boolean;
  ReplaceIllegalChars(str: string, modern?: boolean): string;
  Run(app: string, params?: string);
  /**
   *
   * @param windowId
   * @param app
   * @param params
   * @return taskId for `on_run_cmd_async_done`
   */
  RunCmdAsync(windowId: number, app: string, params: string): number;
  SetClipboardText(text: string);
  ShowPopupMessage(message: string, title?: string);
  /**
   * This offers a multi-line text edit area. Note that it always throws an error if cancelled so you must use try/catch.
   * @param prompt
   * @param title
   * @param defaultValue
   */
  TextBox(prompt: string, title: string, defaultValue?: string): string;
  WriteINI(path: string, section: string, key: string, value: string): boolean;
  /**
   * Files are written as UTF8 without BOM.
   * @param path
   * @param content
   */
  WriteTextFile(path: string, content: string): boolean;
}
declare const utils: utils;

interface Window {
  DPI: number;
  Height: number;
  ID: number;
  IsDefaultUI: boolean;
  IsVisible: boolean;
  MaxHeight: number;
  MaxWidth: number;
  MinHeight: number;
  MinWidth: number;
  Name: string;
  Width: number;
  ClearInterval(timerID: number);
  ClearTimeout(timerID: number);
  /**
   *
   * @param classList  https://docs.microsoft.com/en-gb/windows/win32/controls/parts-and-states
   */
  CreateThemeManager(classList: string): IThemeManager | null;
  CreatePopupMenu(): IMenuObj;
  CreateTooltip(fontName?: string, fontSizePx?: number): ITooltip;
  /**
   *
   * @param type
   * @return Returns a number which can used as the colour in many methods.
   */
  GetColourCUI(type: numberTypeCUI): number;
  /**
   *
   * @param type
   * @return Returns a number which can used as the colour in many methods.
   */
  GetColourDUI(type: numberTypeDUI): number;
  /**
   *
   * @param type
   * @return Returns a string which can be passed directly to IJSGraphics WriteText.
   */
  GetFontCUI(type: FontTypeCUI): string;
  /**
   *
   * @param type
   * @return Returns a string which can be passed directly to IJSGraphics WriteText.
   */
  GetFontDUI(type: FontTypeDUI): string;
  /**
   *
   * @param name
   * @param defaultValue
   * @return Returns the value of name from the panel properties.
   * If no value is present and defaultValue is not null or undefined, it will be stored and returned.
   */
  GetProperty<T extends number | string | boolean = string>(
    name: string
  ): T | null;
  GetProperty<T extends number | string | boolean>(
    name: string,
    defaultValue: T
  ): T extends number ? number : T extends string ? string : boolean;
  /**
   * Listen for notifications in other panels with on_notify_data.
   * @param name
   * @param info
   */
  NotifyOthers(
    name: string,
    info: string | number | string[] | number[] | Object
  );
  Reload(clearProperties?: boolean);
  Repaint();
  RepaintRect(x: number, y: number, w: number, h: number);
  SetCursor(id: SetCursorValues);
  SetInterval(func: () => void, delay: number): number;
  SetProperty(name: string, value: string | number | boolean | null): void;
  SetTimeout(func: () => void, delay: number): number;
  SetTooltipFont(fontName: string, fontSizePx: number);
  ShowConfigure();
  ShowProperties();
}
declare const window: Window & typeof globalThis;

/**
 * callback
 */
type on_always_on_top_changed = (state: boolean) => void;
type on_char = (code: number) => void;
type on_colours_changed = () => void;
type on_console_refresh = () => void;
type on_cursor_follow_playback_changed = (state: boolean) => void;
type on_download_file_done = (
  path: string,
  success: boolean,
  errorText: string
) => void;
type on_drag_drop = (
  action: IDropAction,
  x: number,
  y: number,
  mask: number
) => void;
type on_drag_enter = (
  action: IDropAction,
  x: number,
  y: number,
  mask: number
) => void;
type on_drag_leave = () => void;
type on_drag_over = (
  action: IDropAction,
  x: number,
  y: number,
  mask: number
) => void;
type on_dsp_preset_changed = () => void;
type on_focus = (isFocus: boolean) => void;
type on_font_changed = () => void;
type on_get_album_art_done = (
  handel: IMetadbHandle,
  artId: number,
  image: IJSImage
) => void;
type on_http_request_done = (
  taskId: number,
  success: boolean,
  responseText: string
) => void;
type on_item_focus_change = (
  playlistIndex: number,
  from: number,
  to: number
) => void;
type on_item_played = (handle: IMetadbHandle) => void;
/**
 * @vkey https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
 */
type on_key_down = (vkey: number) => void;
/**
 * @vkey https://docs.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes
 */
type on_key_up = (vkey: number) => void;
type on_library_items_added = (handleList: IMetadbHandleList) => void;
type on_library_items_changed = (
  handleList: IMetadbHandleList,
  fromHook: boolean
) => void;
type on_library_items_removed = (handleList: IMetadbHandleList) => void;
type on_library_items_removed = (handleList: IMetadbHandleList) => void;
type on_load_image_done = (imagePath: string, image: IJSImage | null) => void;
type on_locations_added = (
  taskId: number,
  handleList: IMetadbHandleList
) => void;
type on_main_menu = (index: number) => void;
type on_metadb_changed = (
  handleList: IMetadbHandleList,
  fromHook: boolean
) => void;
type on_mouse_lbtn_dblclk = (x: number, y: number, mask: number) => void;
type on_mouse_lbtn_down = (x: number, y: number, mask: number) => void;
type on_mouse_lbtn_up = (x: number, y: number, mask: number) => void;
type on_mouse_leave = () => void;
type on_mouse_mbtn_dblclk = (x: number, y: number, mask: number) => void;
type on_mouse_mbtn_down = (x: number, y: number, mask: number) => void;
type on_mouse_mbtn_up = (x: number, y: number, mask: number) => void;
type on_mouse_move = (x: number, y: number, mask: number) => void;
type on_mouse_rbtn_dblclk = (x: number, y: number, mask: number) => void;
type on_mouse_rbtn_down = (x: number, y: number, mask: number) => void;
type on_mouse_rbtn_up = (x: number, y: number, mask: number) => void;
type on_mouse_wheel = (step: number) => void;
type on_mouse_wheel_h = (step: number) => void;
type on_notify_data = (
  name: string,
  info: string | number | string[] | Object
) => void;
type on_output_device_changed = () => void;
type on_paint = (gr: IJSGraphics) => void;
type on_playback_follow_cursor_changed = (state: boolean) => void;
type on_playback_dynamic_info = () => void;
type on_playback_dynamic_info_track = (type: number) => void;
type on_playback_edited = (handle: IMetadbHandle) => void;
type on_playback_new_track = (handle: IMetadbHandle) => void;
/**
 * @newOrderIndex PlaybackOrder
 */
type on_playback_order_changed = (newOrderIndex: number) => void;
type on_playback_pause = (state: boolean) => void;
/**
 * @origin PlaybackQueueOrigin
 */
type on_playback_queue_changed = (origin: number) => void;
type on_playback_seek = (time: number) => void;
/**
 * @cmd PlayBackStartingCMD
 */
type on_playback_starting = (cmd: number, isPaused: boolean) => void;
/**
 * @reason PlaybackStopReason
 */
type on_playback_stop = (reason: number) => void;
type on_playback_time = (time: number) => void;
type on_playlist_items_added = (playlistIndex: number) => void;
type on_playlist_items_removed = (
  playlistIndex: number,
  newCount: number
) => void;
type on_playlist_items_reordered = (playlistIndex: number) => void;
type on_playlist_items_selection_change = () => void;
type on_playlist_stop_after_current_changed = (state: boolean) => void;
type on_playlist_switch = () => void;
type on_playlists_changed = () => void;
/**
 * @newMode ReplaygainMode
 */
type on_replaygain_mode_changed = (newMode: number) => void;
type on_run_cmd_async_done = (taskId: number) => void;
type on_script_unload = () => void;
type on_selection_changed = () => void;
type on_size = () => void;
type on_volume_change = (volume: number) => void;

/**
 * helper
 */
declare const pos2vol: (pos: number) => number;
declare const vol2pos: (v: number) => number;
declare const Point2Pixel: (pt: number, dpi: number) => number;
declare const RGB: (r: number, g: number, b: number) => number;
declare const RGBA: (r: number, g: number, b: number, a: number) => number;
declare const toRGB: (colour: number) => number;
declare const getAlpha: (colour: number) => number;
declare const getRed: (colour: number) => number;
declare const getGreen: (colour: number) => number;
declare const getBlue: (colour: number) => number;
declare const setAlpha: (colour: number, a: number) => number;
declare const setRed: (colour: number, r: number) => number;
declare const setGreen: (colour: number, g: number) => number;
declare const setBlue: (colour: number, b: number) => number;
declare const setBlue: (c1: number, c2: number, factor: number) => number;
declare const Liminance: (colour: number) => number;
declare const DetermineTextColour: (background: number) => number;
declare const DrawColouredText: (
  gr: IJSGraphics,
  text: string,
  font: string,
  defaultColour: number,
  x: number,
  y: number,
  w: number,
  h: number,
  textAlignment: number,
  paragraphAlignment: number,
  wordWrapping: number,
  trimmingGranularity: number
) => void;

declare const StripCode: (text: string, chr: string) => string;
declare const StripCodes: (text: string) => string;
type ColourStyle = { Start: number; Length: number; Colour: number };
declare const GetColourStyles: (
  text: string,
  defaultColour: number
) => ColourStyle[];
type FontStyle = {
  Start: number;
  Length: number;
  Name: string;
  Size: number;
  Style: number;
  Weight: number;
};
declare const GetFontStyles: (text: string, fontOjb: FontStyle) => FontStyle[];
declare const DrawRectangle: (
  gr: IJSGraphics,
  x: number,
  y: number,
  w: number,
  h: number,
  colour: number
) => void;
declare const EnableMenuIf: (
  condition: number
) => typeof MF_STRING | typeof MF_GRAYED;
declare const CheckMenuIf: (
  condition: number
) => typeof MF_CHECKED | typeof MF_STRING;
declare const GetMenuFlags: (enabled: boolean, checked: boolean) => number;
declare const CreateFontString: (
  name: string,
  size: number,
  bold: boolean
) => string;

declare const DWRITE_FONT_WEIGHT_THIN: 100;
declare const DWRITE_FONT_WEIGHT_EXTRA_LIGHT: 200;
declare const DWRITE_FONT_WEIGHT_ULTRA_LIGHT: 200;
declare const DWRITE_FONT_WEIGHT_LIGHT: 300;
declare const DWRITE_FONT_WEIGHT_SEMI_LIGHT: 350;
declare const DWRITE_FONT_WEIGHT_NORMAL: 400;
declare const DWRITE_FONT_WEIGHT_REGULAR: 400;
declare const DWRITE_FONT_WEIGHT_MEDIUM: 500;
declare const DWRITE_FONT_WEIGHT_DEMI_BOLD: 600;
declare const DWRITE_FONT_WEIGHT_SEMI_BOLD: 600;
declare const DWRITE_FONT_WEIGHT_BOLD: 700;
declare const DWRITE_FONT_WEIGHT_EXTRA_BOLD: 800;
declare const DWRITE_FONT_WEIGHT_ULTRA_BOLD: 800;
declare const DWRITE_FONT_WEIGHT_BLACK: 900;
declare const DWRITE_FONT_WEIGHT_HEAVY: 900;
declare const DWRITE_FONT_WEIGHT_EXTRA_BLACK: 950;
declare const DWRITE_FONT_WEIGHT_ULTRA_BLACK: 950;

declare const DWRITE_FONT_STYLE_NORMAL: 0;
declare const DWRITE_FONT_STYLE_OBLIQUE: 1;
declare const DWRITE_FONT_STYLE_ITALIC: 2;

declare const DWRITE_FONT_STRETCH_ULTRA_CONDENSED: 1;
declare const DWRITE_FONT_STRETCH_EXTRA_CONDENSED: 2;
declare const DWRITE_FONT_STRETCH_CONDENSED: 3;
declare const DWRITE_FONT_STRETCH_SEMI_CONDENSED: 4;
declare const DWRITE_FONT_STRETCH_NORMAL: 5;
declare const DWRITE_FONT_STRETCH_MEDIUM: 5;
declare const DWRITE_FONT_STRETCH_SEMI_EXPANDED: 6;
declare const DWRITE_FONT_STRETCH_EXPANDED: 7;
declare const DWRITE_FONT_STRETCH_EXTRA_EXPANDED: 8;
declare const DWRITE_FONT_STRETCH_ULTRA_EXPANDED: 9;

declare const DWRITE_TEXT_ALIGNMENT_LEADING: 0;
declare const DWRITE_TEXT_ALIGNMENT_TRAILING: 1;
declare const DWRITE_TEXT_ALIGNMENT_CENTER: 2;
declare const DWRITE_TEXT_ALIGNMENT_JUSTIFIED: 3;

declare const DWRITE_PARAGRAPH_ALIGNMENT_NEAR: 0;
declare const DWRITE_PARAGRAPH_ALIGNMENT_FAR: 1;
declare const DWRITE_PARAGRAPH_ALIGNMENT_CENTER: 2;

declare const DWRITE_WORD_WRAPPING_WRAP: 0;
declare const DWRITE_WORD_WRAPPING_NO_WRAP: 1;
declare const DWRITE_WORD_WRAPPING_EMERGENCY_BREAK: 2;
declare const DWRITE_WORD_WRAPPING_WHOLE_WORD: 3;
declare const DWRITE_WORD_WRAPPING_CHARACTER: 4;

declare const DWRITE_TRIMMING_GRANULARITY_NONE: 0;
declare const DWRITE_TRIMMING_GRANULARITY_CHARACTER: 1;
declare const DWRITE_TRIMMING_GRANULARITY_WORD: 2;

declare const WICBitmapTransformRotate0: 0;
declare const WICBitmapTransformRotate90: 1;
declare const WICBitmapTransformRotate180: 2;
declare const WICBitmapTransformRotate270: 3;
declare const WICBitmapTransformFlipHorizontal: 8;
declare const WICBitmapTransformFlipVertical: 16;

declare const MB_OK: 0;
declare const MB_OKCANCEL: 1;
declare const MB_ABORTRETRYIGNORE: 2;
declare const MB_YESNOCANCEL: 3;
declare const MB_YESNO: 4;

declare const MB_ICONHAND: 16;
declare const MB_ICONQUESTION: 32;
declare const MB_ICONEXCLAMATION: 48;
declare const MB_ICONASTERISK: 64;

declare const IDOK: 1;
declare const IDCANCEL: 2;
declare const IDABORT: 3;
declare const IDRETRY: 4;
declare const IDIGNORE: 5;
declare const IDYES: 6;
declare const IDNO: 7;

declare const MF_SEPARATOR: 0x00000800;
declare const MF_ENABLED: 0x00000000;
declare const MF_GRAYED: 0x00000001;
declare const MF_DISABLED: 0x00000002;
declare const MF_UNCHECKED: 0x00000000;
declare const MF_CHECKED: 0x00000008;
declare const MF_STRING: 0x00000000;
declare const MF_MENUBARBREAK: 0x00000020;
declare const MF_MENUBREAK: 0x00000040;
// declare const MF_BITMAP; // do not use
// declare const MF_OWNERDRAW // do not use
// declare const MF_POPUP // do not use

declare const TPM_LEFTALIGN: 0x0000;
declare const TPM_CENTERALIGN: 0x0004;
declare const TPM_RIGHTALIGN: 0x0008;
declare const TPM_TOPALIGN: 0x0000;
declare const TPM_VCENTERALIGN: 0x0010;
declare const TPM_BOTTOMALIGN: 0x0020;
declare const TPM_HORIZONTAL: 0x0000;
declare const TPM_VERTICAL: 0x0040;
declare const TPM_HORPOSANIMATION: 0x0400;
declare const TPM_HORNEGANIMATION: 0x0800;
declare const TPM_VERPOSANIMATION: 0x1000;
declare const TPM_VERNEGANIMATION: 0x2000;
declare const TPM_NOANIMATION: 0x4000;

declare const MK_LBUTTON: 0x0001;
declare const MK_RBUTTON: 0x0002;
declare const MK_SHIFT: 0x0004;
declare const MK_CONTROL: 0x0008;
declare const MK_MBUTTON: 0x0010;
declare const MK_XBUTTON1: 0x0020;
declare const MK_XBUTTON2: 0x0040;

declare const IDC_ARROW: 32512;
declare const IDC_IBEAM: 32513;
declare const IDC_WAIT: 32514;
declare const IDC_CROSS: 32515;
declare const IDC_UPARROW: 32516;
declare const IDC_SIZE: 32640;
declare const IDC_ICON: 32641;
declare const IDC_SIZENWSE: 32642;
declare const IDC_SIZENESW: 32643;
declare const IDC_SIZEWE: 32644;
declare const IDC_SIZENS: 32645;
declare const IDC_SIZEALL: 32646;
declare const IDC_NO: 32648;
declare const IDC_APPSTARTING: 32650;
declare const IDC_HAND: 32649;
declare const IDC_HELP: 32651;

declare const FILE_ATTRIBUTE_READONLY: 0x00000001;
declare const FILE_ATTRIBUTE_HIDDEN: 0x00000002;
declare const FILE_ATTRIBUTE_SYSTEM: 0x00000004;
declare const FILE_ATTRIBUTE_DIRECTORY: 0x00000010;
declare const FILE_ATTRIBUTE_ARCHIVE: 0x00000020;
declare const FILE_ATTRIBUTE_NORMAL: 0x00000080;
declare const FILE_ATTRIBUTE_TEMPORARY: 0x00000100;
declare const FILE_ATTRIBUTE_SPARSE_FILE: 0x00000200;
declare const FILE_ATTRIBUTE_REPARSE_POINT: 0x00000400;
declare const FILE_ATTRIBUTE_COMPRESSED: 0x00000800;
declare const FILE_ATTRIBUTE_OFFLINE: 0x00001000;
declare const FILE_ATTRIBUTE_NOT_CONTENT_INDEXED: 0x00002000;
declare const FILE_ATTRIBUTE_ENCRYPTED: 0x00004000;
// declare const FILE_ATTRIBUTE_DEVICE // do not use
// declare const FILE_ATTRIBUTE_VIRTUAL // do not use

declare const VK_F1: 0x70;
declare const VK_F2: 0x71;
declare const VK_F3: 0x72;
declare const VK_F4: 0x73;
declare const VK_F5: 0x74;
declare const VK_F6: 0x75;
declare const VK_BACK: 0x08;
declare const VK_TAB: 0x09;
declare const VK_RETURN: 0x0d;
declare const VK_SHIFT: 0x10;
declare const VK_CONTROL: 0x11;
declare const VK_ALT: 0x12;
declare const VK_ESCAPE: 0x1b;
declare const VK_PGUP: 0x21;
declare const VK_PGDN: 0x22;
declare const VK_END: 0x23;
declare const VK_HOME: 0x24;
declare const VK_LEFT: 0x25;
declare const VK_UP: 0x26;
declare const VK_RIGHT: 0x27;
declare const VK_DOWN: 0x28;
declare const VK_INSERT: 0x2d;
declare const VK_DELETE: 0x2e;
declare const VK_SPACEBAR: 0x20;

type AlbumArtId = typeof AlbumArtId[keyof typeof AlbumArtId];
declare const AlbumArtId: {
  front: 0;
  back: 1;
  disc: 2;
  icon: 3;
  artist: 4;
};

type numberTypeCUI = typeof numberTypeCUI[keyof typeof numberTypeCUI];
declare const numberTypeCUI: {
  text: 0;
  selection_text: 1;
  inactive_selection_text: 2;
  background: 3;
  selection_background: 4;
  inactive_selection_background: 5;
  active_item_frame: 6;
};

type numberTypeDUI = typeof numberTypeDUI[keyof typeof numberTypeDUI];
declare const numberTypeDUI: {
  text: 0;
  background: 1;
  highlight: 2;
  selection: 3;
};

type FontTypeCUI = typeof FontTypeCUI[keyof typeof FontTypeCUI];
declare const FontTypeCUI: {
  items: 0;
  labels: 1;
};

type FontTypeDUI = typeof FontTypeDUI[keyof typeof FontTypeDUI];
declare const FontTypeDUI: {
  defaults: 0;
  tabs: 1;
  lists: 2;
  playlists: 3;
  statusbar: 4;
  console: 5;
};

type PlayListLockFilterMask =
  typeof PlayListLockFilterMask[keyof typeof PlayListLockFilterMask];
declare const PlaylistLockFilterMask: {
  filter_add: 1;
  filter_remove: 2;
  filter_reorder: 4;
  filter_replace: 8;
  filter_rename: 16;
  filter_remove_playlist: 32;
  filter_default_action: 64;
};

type ReplayGainMode = typeof ReplaygainMode[keyof typeof ReplaygainMode];
declare const ReplaygainMode: {
  None: 0;
  Track: 1;
  Album: 2;
  Track_Album_By_Playback_Order: 3;
};

type PlaybackOrder = typeof PlaybackOrder[keyof typeof PlaybackOrder];
declare const PlaybackOrder: {
  Default: 0;
  Repeat_Playlist: 1;
  Repeat_Track: 2;
  Random: 3;
  Shuffle_tracks: 4;
  Shuffle_albums: 5;
  Shuffle_folders: 6;
};

type PlaybackQueueOrigin =
  typeof PlaybackQueueOrigin[keyof typeof PlaybackQueueOrigin];
declare const PlaybackQueueOrigin: {
  user_added: 0;
  user_removed: 1;
  playback_advance: 2;
};

type PlaybackStartingCMD =
  typeof PlaybackStartingCMD[keyof typeof PlaybackStartingCMD];
declare const PlaybackStartingCMD: {
  default: 0;
  play: 1;
  next: 2;
  prev: 3;
  settrack: 4;
  rand: 5;
  resume: 6;
};

type PlaybackStopReason =
  typeof PlaybackStopReason[keyof typeof PlaybackStopReason];
declare const PlaybackStopReason: {
  user: 0;
  eof: 1;
  starting_another: 2;
};

type SelectionType = typeof SelectionType[keyof typeof SelectionType];
declare const SelectionType: {
  undefined: 0;
  active_playlist_selection: 1;
  caller_active_playlist: 2;
  playlist_manager: 3;
  now_playing: 4;
  keyboard_shortcut_list: 5;
  media_library_viewer: 6;
};

type ImageEffect = typeof ImageEffect[keyof typeof ImageEffect];
declare const ImageEffect: {
  grayscale: 0;
  invert: 1;
  sepia: 2;
};

declare const colours: {
  AliceBlue: 0xfff0f8ff;
  AntiqueWhite: 0xfffaebd7;
  Aqua: 0xff00ffff;
  Aquamarine: 0xff7fffd4;
  Azure: 0xfff0ffff;
  Beige: 0xfff5f5dc;
  Bisque: 0xffffe4c4;
  Black: 0xff000000;
  BlanchedAlmond: 0xffffebcd;
  Blue: 0xff0000ff;
  BlueViolet: 0xff8a2be2;
  Brown: 0xffa52a2a;
  BurlyWood: 0xffdeb887;
  CadetBlue: 0xff5f9ea0;
  Chartreuse: 0xff7fff00;
  Chocolate: 0xffd2691e;
  Coral: 0xffff7f50;
  CornflowerBlue: 0xff6495ed;
  Cornsilk: 0xfffff8dc;
  Crimson: 0xffdc143c;
  Cyan: 0xff00ffff;
  DarkBlue: 0xff00008b;
  DarkCyan: 0xff008b8b;
  DarkGoldenrod: 0xffb8860b;
  DarkGray: 0xffa9a9a9;
  DarkGreen: 0xff006400;
  DarkKhaki: 0xffbdb76b;
  DarkMagenta: 0xff8b008b;
  DarkOliveGreen: 0xff556b2f;
  DarkOrange: 0xffff8c00;
  DarkOrchid: 0xff9932cc;
  DarkRed: 0xff8b0000;
  DarkSalmon: 0xffe9967a;
  DarkSeaGreen: 0xff8fbc8b;
  DarkSlateBlue: 0xff483d8b;
  DarkSlateGray: 0xff2f4f4f;
  DarkTurquoise: 0xff00ced1;
  DarkViolet: 0xff9400d3;
  DeepPink: 0xffff1493;
  DeepSkyBlue: 0xff00bfff;
  DimGray: 0xff696969;
  DodgerBlue: 0xff1e90ff;
  Firebrick: 0xffb22222;
  FloralWhite: 0xfffffaf0;
  ForestGreen: 0xff228b22;
  Fuchsia: 0xffff00ff;
  Gainsboro: 0xffdcdcdc;
  GhostWhite: 0xfff8f8ff;
  Gold: 0xffffd700;
  Goldenrod: 0xffdaa520;
  Gray: 0xff808080;
  Green: 0xff008000;
  GreenYellow: 0xffadff2f;
  Honeydew: 0xfff0fff0;
  HotPink: 0xffff69b4;
  IndianRed: 0xffcd5c5c;
  Indigo: 0xff4b0082;
  Ivory: 0xfffffff0;
  Khaki: 0xfff0e68c;
  Lavender: 0xffe6e6fa;
  LavenderBlush: 0xfffff0f5;
  LawnGreen: 0xff7cfc00;
  LemonChiffon: 0xfffffacd;
  LightBlue: 0xffadd8e6;
  LightCoral: 0xfff08080;
  LightCyan: 0xffe0ffff;
  LightGoldenrodYellow: 0xfffafad2;
  LightGray: 0xffd3d3d3;
  LightGreen: 0xff90ee90;
  LightPink: 0xffffb6c1;
  LightSalmon: 0xffffa07a;
  LightSeaGreen: 0xff20b2aa;
  LightSkyBlue: 0xff87cefa;
  LightSlateGray: 0xff778899;
  LightSteelBlue: 0xffb0c4de;
  LightYellow: 0xffffffe0;
  Lime: 0xff00ff00;
  LimeGreen: 0xff32cd32;
  Linen: 0xfffaf0e6;
  Magenta: 0xffff00ff;
  Maroon: 0xff800000;
  MediumAquamarine: 0xff66cdaa;
  MediumBlue: 0xff0000cd;
  MediumOrchid: 0xffba55d3;
  MediumPurple: 0xff9370db;
  MediumSeaGreen: 0xff3cb371;
  MediumSlateBlue: 0xff7b68ee;
  MediumSpringGreen: 0xff00fa9a;
  MediumTurquoise: 0xff48d1cc;
  MediumVioletRed: 0xffc71585;
  MidnightBlue: 0xff191970;
  MintCream: 0xfff5fffa;
  MistyRose: 0xffffe4e1;
  Moccasin: 0xffffe4b5;
  NavajoWhite: 0xffffdead;
  Navy: 0xff000080;
  OldLace: 0xfffdf5e6;
  Olive: 0xff808000;
  OliveDrab: 0xff6b8e23;
  Orange: 0xffffa500;
  OrangeRed: 0xffff4500;
  Orchid: 0xffda70d6;
  PaleGoldenrod: 0xffeee8aa;
  PaleGreen: 0xff98fb98;
  PaleTurquoise: 0xffafeeee;
  PaleVioletRed: 0xffdb7093;
  PapayaWhip: 0xffffefd5;
  PeachPuff: 0xffffdab9;
  Peru: 0xffcd853f;
  Pink: 0xffffc0cb;
  Plum: 0xffdda0dd;
  PowderBlue: 0xffb0e0e6;
  Purple: 0xff800080;
  Red: 0xffff0000;
  RosyBrown: 0xffbc8f8f;
  RoyalBlue: 0xff4169e1;
  SaddleBrown: 0xff8b4513;
  Salmon: 0xfffa8072;
  SandyBrown: 0xfff4a460;
  SeaGreen: 0xff2e8b57;
  SeaShell: 0xfffff5ee;
  Sienna: 0xffa0522d;
  Silver: 0xffc0c0c0;
  SkyBlue: 0xff87ceeb;
  SlateBlue: 0xff6a5acd;
  SlateGray: 0xff708090;
  Snow: 0xfffffafa;
  SpringGreen: 0xff00ff7f;
  SteelBlue: 0xff4682b4;
  Tan: 0xffd2b48c;
  Teal: 0xff008080;
  Thistle: 0xffd8bfd8;
  Tomato: 0xffff6347;
  Transparent: 0x00ffffff;
  Turquoise: 0xff40e0d0;
  Violet: 0xffee82ee;
  Wheat: 0xfff5deb3;
  White: 0xffffffff;
  WhiteSmoke: 0xfff5f5f5;
  Yellow: 0xffffff00;
  YellowGreen: 0xff9acd32;
};
