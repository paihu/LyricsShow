
declare global {
  interface IAudioChunk {
    ChannelConfig: number;
    ChannelCount: number;
    Data: VBArray; // You need to use toArray() on this before using.
    SampleCount: number;
    SampleRate: number;
  }

  interface IContextMenuManager {
    BuildMenu(menu: IMenuObj, base_id: number): void;
    Dispose(): void;
    ExecuteByID(id: number): boolean;
    InitContext(handleList: IMetadbHandleList): void;
    InitContextPlaylist(): void;
    InitNowPlaying(): void;
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
    Dispose(): void;
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

  interface IJSBitmap {
    readonly Height: number;
    readonly Width: number;

    Dispose(): void;
  }

  interface IJSGraphics {
    Clear(colour: number): void;
    DrawBitmap(
      image: IJSBitmap,
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
    ): void;
    DrawEllipse(
      centreX: number,
      centreY: number,
      radiusX: number,
      radiusY: number,
      lineWidth: number,
      colour: number
    ): void;
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
    ): void;

    DrawImageWithMask(
      image: IJSImage,
      mask: IJSImage,
      x: number,
      y: number,
      w: number,
      h: number
    ): void;

    DrawLine(
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      lineWidth: number,
      colour: number
    ): void;

    DrawRectangle(
      startX: number,
      startY: number,
      w: number,
      h: number,
      lineWidth: number,
      colour: number
    ): void;
    DrawRoundedRectangle(
      startX: number,
      startY: number,
      w: number,
      h: number,
      radiusX: number,
      radiusY: number,
      lineWidth: number,
      colour: number
    ): void;
    FillEllipse(
      centreX: number,
      centreY: number,
      radiusX: number,
      radiusY: number,
      colour: number
    ): void;
    FillGradientRectangle(
      startX: number,
      startY: number,
      w: number,
      h: number,
      direction: number,
      startColour: number,
      endColour: number
    ): void;
    FillGradientRectangleAdvanced(
      startX: number,
      startY: number,
      w: number,
      h: number,
      brushStr: string
    ): void;
    FillRectangle(
      startX: number,
      startY: number,
      w: number,
      h: number,
      colour: number
    ): void;
    FillRoundedRectangle(
      startX: number,
      startY: number,
      w: number,
      h: number,
      radiusX: number,
      radiusY: number,
      colour: number
    ): void;
    PopLayer(): void;
    PushLayer(x: number, y: number, w: number, h: number): void;
    WriteText(
      text: string,
      font: string,
      colour: number,
      startX: number,
      startY: number,
      w: number,
      h: number,
      textAlignment?: number,
      paragraphAlignment?: number,
      wordWrapping?: number,
      trimmingGranularity?: number
    ): void;
    WriteText2(
      text: string,
      font: string,
      colour: number,
      startX: number,
      startY: number,
      w: number,
      h: number,
      textAlignment?: number,
      paragraphAlignment?: number,
      wordWrapping?: number,
      trimmingGranularity?: number
    ): void;
    WriteTextLayout(
      textLayout: ITextLayout,
      colour: number | string,
      startX: number,
      startY: number,
      w: number,
      h: number,
      verticalOffset?: number
    ): void;
    WriteTextSimple(
      text: string,
      font: string,
      colour: number,
      startX: number,
      startY: number,
      w: number,
      h: number,
      textAlignment?: number,
      paragraphAlignment?: number,
      wordWrapping?: number,
      trimmingGranularity?: number
    ): void;
  }

  interface IJSImage {
    readonly Path: string;
    readonly Width: number;
    readonly Height: number;
    ApplyEffect(effect: ImageEffect): void;
    Clone(): IJSImage;
    CrreateBitmap(): IJSBitmap;
    Dispose(): void;
    /**
     *
     * @param options see WICBitmapTransform
     */
    FlipRotate(options: number): void;
    GetColourScheme(count: number): VBArray<string>;
    GetGraphics(): IJSGraphics;
    ReleaseGraphics(): void;
    Resize(w: number, h: number): void;
    SaveAs(path: string): boolean;
    StackBlur(radius: number): void;
  }
  interface IMainMenuManager {
    BuildMenu(parentMenu: IMenuObj, baseId: number): void;
    Dispose(): void;
    ExecuteByID(id: number): boolean;
  }
  interface IMenuObj {
    /**
     *
     * @param flags see AppendMenuItemFlags
     * @param itemId
     * @param text
     */
    AppendMenuItem(flags: number, itemId: number, text: string): void;
    AppendMenuSeparator(): void;
    /**
     *
     * @param parentMenu
     * @param flags see AppendMenuItemFlags
     * @param text
     */
    AppendTo(parentMenu: IMenuObj, flags: number, text: string): void;
    CheckMenuItem(itemId: number, check: boolean): void;
    CheckMenuRadioItem(
      firstItemId: number,
      lastItemId: number,
      selectedItemId: number
    ): void;
    SetDefault(item_id: number): void;
    Dispose(): void;
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
    Dispose(): void;
    GetAlbumArt(artId?: AlbumArtId, wantStub?: boolean): IJSImage | null;
    GetAlbumArtAsync(
      windowId: number,
      artId?: AlbumArtId,
      wantStub?: boolean
    ): void; // on_get_album_art_done
    GetAlbumArtEmbedded(artId?: AlbumArtId): IJSImage | null;
    GetAlbumArtThumbAsync(
      windowId: number,
      artId?: AlbumArtId,
      maxSize?: number
    ): void; // on_get_album_art_done
    GetFileInfo(): IFileInfo;
    IsInLibrary(): boolean;
    SetFirstPlayed(fitstPlayed: number): void;
    SetLastPlayed(lastPlayed: number): void;
    SetLoved(loved: boolean): void;
    SetPlayCount(playCount: number): void;
    SetRating(rating: number): void;
    SetSkipcount(skipCount: number): void;
    ShowAlbumArtViewer(artId?: AlbumArtId, wantStub?: boolean): void;
    ShowAlbumArtViewer2(artId?: AlbumArtId, type?: AlbumArtType): void;
  }
  interface IMetadbHandleList {
    readonly Count: number;
    AddItem(handle: IMetadbHandle): void;
    AddItems(handleList: IMetadbHandleList): void;
    AttachImage(imagePath: string, artId?: AlbumArtId): void;
    AttachImage2(imagePath: string, artId?: AlbumArtId, format?: number): void; // format: 0 = jpg,1 = webp
    CalcTotalDuration(): number;
    CalcTotalSize(): number;
    ClearStats(): void;
    Clone(): IMetadbHandleList;
    CopyToClipboard(): boolean;
    DoDragDrop(effect: number): number;
    Drop(count: number): void;
    Dispose(): void;
    Find(handle: IMetadbHandle): number;
    GetItem(idx: number): IMetadbHandle;
    GetLibraryRelativePaths(): VBArray<string>;
    GetOtherInfo(): string;
    GetQueryItems(query: string): IMetadbHandleList;
    GroupByTag(tag: string): void;
    InsertItem(idx: number, handle: IMetadbHandle): void;
    InsertItems(idx: number, handleList: IMetadbHandleList): void;
    MakeDifference(handleList: IMetadbHandleList): void;
    MakeIntersection(handleList: IMetadbHandleList): void;
    OptimiseFileLayout(minimise?: boolean): void;
    Randomise(): void;
    RefreshStats(): void;
    RemoveAll(): void;
    RemoveAttachedImage(artId?: AlbumArtId): void;
    RemoveAttachedImages(): void;
    RemoveById(idx: number): void;
    RemoveDuplicates(): void;
    RemoveDuplicatesByFormat(pattern: string): void;
    RemoveFromIdx(from: number, num: number): void;
    ReplaceItem(idx: number, handle: IMetadbHandle): void;
    Reverse(): void;
    RunContextCommand(command: string): void;
    SaveAs(path: string): void;
    SortByFormat(pattern: string, direction: number): void;
    SortByPath(): void;
    SortByRelativePath(): void;
    Take(count: number): IMetadbHandleList;
    UpdateFileInfoFromJSON(str: string): void;
  }
  interface IPlayingItemLocation {
    readonly IsValid: boolean;
    readonly PlaylistIndex: number;
    readonly PlaylistItemIndex: number;
  }
  interface IProfiler {
    readonly Time: number;
    Reset(): void;
    Print(): void;
  }
  interface ISelectionHolder {
    SetSelection(handleList: IMetadbHandleList, type?: SelectionType): void;
    SetPlaylistSelectionTracking(): void;
    SetPlaylistTracking(): void;
  }
  interface ITextLayout {
    CalcTextHeight(maxWidth: number): number;
    Dispose(): void;
  }
  interface IThemeManager {
    DrawThemeBackground(
      gr: IJSGraphics,
      x: number,
      y: number,
      w: number,
      h: number
    ): void;
    GetThemeColour(propId: number): number;
    IsThemePartDefined(partId: number): boolean;
    SetPartAndStateID(partId: number, stateId?: number): void;
  }
  interface ITitleFormat {
    Dispose(): void;
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
   * var tooltip = window.CreateTooltip():void;
   */
  interface ITooltip {
    Text: string;
    TrackActive: boolean;

    Activate(): void;
    Deactivate(): void;
    /**
     * Use if you want multi-line tooltips.
     * @param w: maxWidth
     */
    SetMaxWidth(w: number): void;
    TrackPosition(x: number, y: number): void;
  }

  interface Console {
    GetLines(withTimestamp?: boolean): VBArray<string>;
    ClearBacklog(): void;
    log(messate: string | number | boolean | Array<any> | object): void;
  }
  var console: Console;

  /**
   * global foobar object
   */
  interface fb {
    AlwaysOnTop: boolean;
    readonly ComponentPath: string;
    CursorFollowPlayback: boolean;
    readonly CustomVolume: number;
    readonly FoobarPath: string;
    readonly IsPaused: boolean;
    readonly IsPlaying: boolean;
    PlaybackFollowCursor: boolean;
    readonly PlaybackLength: number;
    PlaybackTime: number;
    readonly ProfilePath: string;
    ReplayGainMode: ReplayGainMode;
    StopAfterCurrent: boolean;
    readonly VersionString: string;
    Volume: number;

    // Shortcuts to main menu commands
    AddDirectory(): void;
    AddFiles(): void;
    Exit(): void;
    LoadPlaylist(): void;
    Next(): void;
    Pause(): void;
    Play(): void;
    PlayOrPause(): void;
    Prev(): void;
    Random(): void;
    SavePlaylist(): void;
    ShowConsole(): void;
    ShowPreferences(): void;
    Stop(): void;
    VolumeDown(): void;
    VolumeMute(): void;
    VolumeUp(): void;

    // AcquireSelectionHolder(): ISelectionHolder;
    AddLocationsAsync(windowId: number, paths: string[]): number;
    CheckClipboardContents(): boolean;
    CheckComponent(name: string): boolean;
    ClearPlaylist(): void;
    CreateContextMenuManager(): IContextMenuManager;
    CreateHandleList(handle?: IMetadbHandle): IMetadbHandleList;
    CreateMainMenuManager(rootName: string): IMainMenuManager;
    GetClipboardContents(): IMetadbHandleList;
    EnableAdvancedLogging(): void;
    /** return JSON array in string form. so you need to user JSON.parse on the result */
    /**
     * Checked // boolean
     * Disabled // boolean
     * FullPath // string, the same full path you'd supply to fb.RunMainMenuCommand
     * HiddenByDefault // boolean
     * Radio // boolean
     * Type // string "Fixed" or "Dynamic"
     * Visible // boolean
     */
    EnumerateMainMenuCommands(): void;
    GetActiveDsps(): VBArray;
    GetAlbumArtStub(artId?: AlbumArtId): IJSImage | null;
    GetAudioChukn(requestedLength: number, offset?: number): IAudioChunk;
    GetClipboardContents(): IMetadbHandleList;
    /** return JSON array in string form. so you need to user JSON.parse on the result */
    GetDSPPresets(): string;
    GetFocusItem(): IMetadbHandle;
    GetLibraryItems(query: string): IMetadbHandleList;
    GetNowPlaying(): IMetadbHandle | null;
    /** return JSON array in string form. so you need to user JSON.parse on the result */
    /**
     * active"  /boolean
     * device_id" // string
     * name" // string
     * output_id // string
     */
    GetOutputDevices(): string;
    GetSelection(flags?: number): IMetadbHandleList;
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
    SetDSPPreset(idx: number): void;
    /**
     * See GetOutputDevices
     * @param outputId
     * @param deviceId
     */
    SetOutputDevice(outputId: string, deviceId: string): void;
    ShowLibrarySearchUI(query: string): void;
    ShowPictureViewer(path: string): void;
    TitleFormat(pattern: string): ITitleFormat;
  }
  export var fb: fb;

  /**
   * global playlist manager object
   */
  interface plman {
    ActivePlaylist: number;
    PlaybackOrder: PlaybackOrder;
    readonly PlayingPlaylist: number;
    readonly PlaylistCount: number;
    readonly RecyclerCount: number;

    AddLocations(
      playlistIndex: number,
      paths: string[],
      select?: boolean
    ): void;
    AddPlaylistLock(
      playlistIndex: number,
      mask: PlayListLockFilterMask
    ): boolean;
    ClearPlaylist(playlistIndex: number): void;
    ClearPlaylistSelection(playlistIndex: number): void;
    CreateAutoPlaylist(
      playlistIndex: number,
      name: string,
      query: string,
      sort?: string,
      flags?: number
    ): number; // return -1 on failure  flags: 0 = not sorted, 1 = force sort
    CreatePlaylist(playlistIndex?: number, name?: string): number;
    DuplicatePlaylist(playlistIndex: number, name: string): number;
    ExecutePlaylistDefaultAction(
      playlistIndex: number,
      playlistItemIndex: number
    ): void;
    FindByGUID(str: string): void;
    FindOrCreatePlayList(name: string, unlocked: boolean): number;
    FindPlaylist(name: string): number; // return -1 if not found
    GetGUID(playlistIndex: number): string;
    GetPlaybackOrders(): VBArray; // use .toArray() to get the array
    GetPlayingIttemLocation(): IPlayingItemLocation;
    GetPlaylistFocusItemIndex(playlistIndex: number): number; // return -1 if not found
    GetPlaylistItemCount(playlistIndex: number): number;
    GetPlaylistItems(playlistIndex: number): IMetadbHandleList;
    GetPlaylistLockFilterMask(
      playlistIndex: number
    ): PlayListLockFilterMask | -1;
    GetPlaylistLockName(playlistIndex: number): string;
    GetPlaylistName(playlistIndex: number): string;
    GetPlaylistSelectedIndexes(playlistIndex: number): VBArray;
    GetPlaylistSelectedItems(playlistIndex: number): IMetadbHandleList;
    GetQueryItems(playlistIndex: number, query: string): IMetadbHandleList;
    GetRecyclerItems(index: number): IMetadbHandleList;
    GetRecyclerName(index: number): string;
    InsertPlaylistItems(
      playlistIndex: number,
      base: number,
      handleList: IMetadbHandleList,
      select?: boolean
    ): void;
    InsertPlaylistItemsFilter(
      playlistIndex: number,
      base: number,
      handleList: IMetadbHandleList,
      select?: boolean
    ): void;
    InvertSelection(playlistIndex: number): void;
    IsAutoPlaylist(playlistIndex: number): boolean;
    IsPlaylistItemSelected(
      playlistIndex: number,
      playlistItemIndex: number
    ): boolean;
    IsPlaylistLocked(playlistIndex: number): boolean;
    MovePlaylist(from: number, to: number): void;
    MovePlaylistSelection(playlistIndex: number, delta: number): void;
    MovePlaylistSlelectionV2(playlistIndex: number, newPos: number): void;
    RecyclerPurge(affectedItems: number[]): void;
    RecyclerRestore(index: number): void;
    RemovePlaylist(playlistIndex: number): void;
    RemovePlaylistLock(playlistIndex: number): boolean;
    RemovePlaylists(playlistIndexes: number[]): void;
    RemovePlaylistSelection(playlistIndex: number, crop: boolean): void;
    RemovePlaylistSwitch(playlistIndex: number): void;
    RenamePlaylist(playlistIndex: number, name: string): void;
    ReplacePlaylistItem(
      playlistIndex: number,
      playlistItemIndex: number,
      handle: IMetadbHandle
    ): void;
    SelectQueryItems(playListIndex: number, query: string): void;
    SetActivePlaylistContext(): void;
    SetPlaylistFocusItem(
      playlistIndex: number,
      playlistItemIndex: number
    ): void;
    SetPlaylistSelection(
      playlistIndex: number,
      affectedItems: number[],
      state: boolean
    ): void;
    SetPlaylistSelectionSingle(
      playlistIndex: number,
      playlistItemIndex: number,
      state: boolean
    ): void;
    ShowAutoPlaylistUI(playlistIndex: number): void;
    ShowPlaylistLockUI(playlistIndex: number): void;
    SortByFormat(
      playlistIndex: number,
      pattern: string,
      selectedItemsOnly?: boolean
    ): void;
    SortByFormatV2(
      playlistIndex: number,
      pattern: string,
      direction?: number
    ): void; // direction: 1 = ascending, -1 = descending
    SortPlaylistsByName(direction?: number): void; // direction: 1 = ascending, -1 = descending
    UndoBackup(playlistIndex: number): void;
  }
  var plman: plman;

  /**
   * global utils object
   */
  interface utils {
    readonly Version: number;
    readonly VersionString: string;
    CalcTextWidth(
      text: string,
      fontName: string,
      fontSize: number,
      fontWeight?: DWRITE_FONT_WEIGHT,
      fontStyle?: DWRITE_FONT_STYLE,
      fontStretch?: DWRITE_FONT_STRETCH
    ): number;
    CheckFont(name: string): boolean;
    ColourPicker(defaultColour: number): number;
    ConvertToAscii(str: string): string;
    CopyFile(from: string, to: string, override?: boolean): boolean;
    CopyFolder(
      from: string,
      to: string,
      override?: boolean,
      recursive?: boolean
    ): boolean;
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
    DownloadFileAsync(windowId: number, url: string, path: string): void; // on_download_file_done
    DownloadImageAsync(windowId: number, url: string): void; // on_download_image_done
    FormatDuration(seconds: number): string;
    FormatFileSize(bytes: number): string;
    GetClipboardText(): string;
    GetCountryFlag(countryorCode: string): string;
    GetFileSize(path: string): number;
    GetLastModified(path: string): number;
    GetSysColour(index: number): number;
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
    HashString(str: string): string;
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
    ListFonts(): VBArray<string>;
    LoadBitmap(path: string, maxSize?: number): IJSBitmap | null;
    LoadImage(path: string): IJSImage | null;
    LoadImageAsync(windowId: number, path: string): void;
    LoadSVG(pathOrXML: string, maxWidth: number): IJSImage | null;
    /**
     *
     * @param prompt
     * @param title
     * @param flags combine MessageBoxButtons,MessageBoxIcons
     * @return MessageBoxReturnValues (see IDOK...IDNO)
     */
    MessageBox(prompt: string, title: string, flags: number): number;
    Now(): number; // Math.round(new Date().getTime() / 1000)
    ReadINI(
      path: string,
      section: string,
      key: string,
      defaultValue?: string
    ): string;
    ReadTextFile(path: string, codepage?: number): string;
    ReadUTF8(path: string): string;
    RemoveFolderRecursive(path: string, option?: number): boolean;
    RemovePath(path: string): boolean;
    RenamePath(from: string, to: string): boolean;
    ReplaceIllegalChars(
      str: string,
      modern?: boolean,
      stripTrailingPeriods?: boolean
    ): string;
    Run(app: string, params?: string): void;
    /**
     *
     * @param windowId
     * @param app
     * @param params
     * @return taskId for `on_run_cmd_async_done`
     */
    RunCmdAsync(windowId: number, app: string, params: string): number;
    SetClipboardText(text: string): void;
    ShowPopupMessage(message: string, title?: string): void;
    /**
     * This offers a multi-line text edit area. Note that it always throws an error if cancelled so you must use try/catch.
     * @param prompt
     * @param title
     * @param defaultValue
     */
    TextBox(prompt: string, title: string, defaultValue?: string): string;
    TimestampToDateString(ts: number): string; // ts is unixepoch
    WriteINI(
      path: string,
      section: string,
      key: string,
      value: string
    ): boolean;
    /**
     * Files are written as UTF8 without BOM.
     * @param path
     * @param content
     */
    WriteTextFile(path: string, content: string): boolean;
  }
  var utils: utils;

  /**
   * global foobar window object
   */
  interface Window {
    DPI: number;
    Height: number;
    ID: number;
    IsDark: boolean;
    IsDefaultUI: boolean;
    IsVisible: boolean;
    MaxHeight: number;
    MaxWidth: number;
    MinHeight: number;
    MinWidth: number;
    Name: string;
    Width: number;
    ClearInterval(timerID: number): void;
    ClearTimeout(timerID: number): void;
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
    ): void;
    Reload(clearProperties?: boolean): void;
    Repaint(): void;
    RepaintRect(x: number, y: number, w: number, h: number): void;
    SetCursor(id: string): void;
    SetInterval(func: () => void, delay: number): number;
    SetPlaylistSelectionTracking(): void;
    SetPlaylistTracking(): void;
    SetProperty(name: string, value: string | number | boolean | null): void;
    SetSelection(handleList: IMetadbHandleList, tpe: SelectionType): void;
    SetTimeout(func: () => void, delay: number): number;
    SetTooltipFont(fontName: string, fontSizePx: number): void;
    ShowConfigure(): void;
    ShowProperties(): void;
  }
  var window: Window & typeof globalThis;

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
  var pos2vol: (pos: number) => number;
  var vol2pos: (v: number) => number;
  var Point2Pixel: (pt: number, dpi: number) => number;
  var RGB: (r: number, g: number, b: number) => number;
  var RGBA: (r: number, g: number, b: number, a: number) => number;
  var toRGB: (colour: number) => number;
  var getAlpha: (colour: number) => number;
  var getRed: (colour: number) => number;
  var getGreen: (colour: number) => number;
  var getBlue: (colour: number) => number;
  var setAlpha: (colour: number, a: number) => number;
  var setRed: (colour: number, r: number) => number;
  var setGreen: (colour: number, g: number) => number;
  var setBlue: (c1: number, c2: number, factor: number) => number;
  var Liminance: (colour: number) => number;
  var DetermineTextColour: (background: number) => number;
  var DrawColouredText: (
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

  var StripCode: (text: string, chr: string) => string;
  var StripCodes: (text: string) => string;
  type ColourStyle = { Start: number; Length: number; Colour: number };
  var GetColourStyles: (text: string, defaultColour: number) => ColourStyle[];
  type FontStyle = {
    Start: number;
    Length: number;
    Name: string;
    Size: number;
    Style: number;
    Weight: number;
  };
  var GetFontStyles: (text: string, fontOjb: FontStyle) => FontStyle[];
  var DrawRectangle: (
    gr: IJSGraphics,
    x: number,
    y: number,
    w: number,
    h: number,
    colour: number
  ) => void;
  var EnableMenuIf: (condition: number) => typeof MF_STRING | typeof MF_GRAYED;
  var CheckMenuIf: (condition: number) => typeof MF_CHECKED | typeof MF_STRING;
  var GetMenuFlags: (enabled: boolean, checked: boolean) => number;
  var CreateFontString: (name: string, size: number, bold: boolean) => string;

  type DWRITE_FONT_WEIGHT = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  var DWRITE_FONT_WEIGHT_THIN: 100;
  var DWRITE_FONT_WEIGHT_EXTRA_LIGHT: 200;
  var DWRITE_FONT_WEIGHT_ULTRA_LIGHT: 200;
  var DWRITE_FONT_WEIGHT_LIGHT: 300;
  var DWRITE_FONT_WEIGHT_SEMI_LIGHT: 350;
  var DWRITE_FONT_WEIGHT_NORMAL: 400;
  var DWRITE_FONT_WEIGHT_REGULAR: 400;
  var DWRITE_FONT_WEIGHT_MEDIUM: 500;
  var DWRITE_FONT_WEIGHT_DEMI_BOLD: 600;
  var DWRITE_FONT_WEIGHT_SEMI_BOLD: 600;
  var DWRITE_FONT_WEIGHT_BOLD: 700;
  var DWRITE_FONT_WEIGHT_EXTRA_BOLD: 800;
  var DWRITE_FONT_WEIGHT_ULTRA_BOLD: 800;
  var DWRITE_FONT_WEIGHT_BLACK: 900;
  var DWRITE_FONT_WEIGHT_HEAVY: 900;
  var DWRITE_FONT_WEIGHT_EXTRA_BLACK: 950;
  var DWRITE_FONT_WEIGHT_ULTRA_BLACK: 950;

  type DWRITE_FONT_STYLE = 0 | 1 | 2;
  var DWRITE_FONT_STYLE_NORMAL: 0;
  var DWRITE_FONT_STYLE_OBLIQUE: 1;
  var DWRITE_FONT_STYLE_ITALIC: 2;

  type DWRITE_FONT_STRETCH = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  var DWRITE_FONT_STRETCH_ULTRA_CONDENSED: 1;
  var DWRITE_FONT_STRETCH_EXTRA_CONDENSED: 2;
  var DWRITE_FONT_STRETCH_CONDENSED: 3;
  var DWRITE_FONT_STRETCH_SEMI_CONDENSED: 4;
  var DWRITE_FONT_STRETCH_NORMAL: 5;
  var DWRITE_FONT_STRETCH_MEDIUM: 5;
  var DWRITE_FONT_STRETCH_SEMI_EXPANDED: 6;
  var DWRITE_FONT_STRETCH_EXPANDED: 7;
  var DWRITE_FONT_STRETCH_EXTRA_EXPANDED: 8;
  var DWRITE_FONT_STRETCH_ULTRA_EXPANDED: 9;

  type DWRITE_TEXT_ALIGNMENT = 0 | 1 | 2 | 3;
  var DWRITE_TEXT_ALIGNMENT_LEADING: 0;
  var DWRITE_TEXT_ALIGNMENT_TRAILING: 1;
  var DWRITE_TEXT_ALIGNMENT_CENTER: 2;
  var DWRITE_TEXT_ALIGNMENT_JUSTIFIED: 3;

  type DWRITE_PARAGRAPH_ALIGNMENT = 0 | 1 | 2;
  var DWRITE_PARAGRAPH_ALIGNMENT_NEAR: 0;
  var DWRITE_PARAGRAPH_ALIGNMENT_FAR: 1;
  var DWRITE_PARAGRAPH_ALIGNMENT_CENTER: 2;

  type DWRITE_WORD_WRAPPING = 0 | 1 | 2 | 3 | 4;
  var DWRITE_WORD_WRAPPING_WRAP: 0;
  var DWRITE_WORD_WRAPPING_NO_WRAP: 1;
  var DWRITE_WORD_WRAPPING_EMERGENCY_BREAK: 2;
  var DWRITE_WORD_WRAPPING_WHOLE_WORD: 3;
  var DWRITE_WORD_WRAPPING_CHARACTER: 4;

  type DWRITE_TRIMMING_GRANULARITY = 0 | 1 | 2;
  var DWRITE_TRIMMING_GRANULARITY_NONE: 0;
  var DWRITE_TRIMMING_GRANULARITY_CHARACTER: 1;
  var DWRITE_TRIMMING_GRANULARITY_WORD: 2;

  var WICBitmapTransformRotate0: 0;
  var WICBitmapTransformRotate90: 1;
  var WICBitmapTransformRotate180: 2;
  var WICBitmapTransformRotate270: 3;
  var WICBitmapTransformFlipHorizontal: 8;
  var WICBitmapTransformFlipVertical: 16;

  var MB_OK: 0;
  var MB_OKCANCEL: 1;
  var MB_ABORTRETRYIGNORE: 2;
  var MB_YESNOCANCEL: 3;
  var MB_YESNO: 4;

  var MB_ICONHAND: 16;
  var MB_ICONQUESTION: 32;
  var MB_ICONEXCLAMATION: 48;
  var MB_ICONASTERISK: 64;

  var IDOK: 1;
  var IDCANCEL: 2;
  var IDABORT: 3;
  var IDRETRY: 4;
  var IDIGNORE: 5;
  var IDYES: 6;
  var IDNO: 7;

  var MF_SEPARATOR: 0x00000800;
  var MF_ENABLED: 0x00000000;
  var MF_GRAYED: 0x00000001;
  var MF_DISABLED: 0x00000002;
  var MF_UNCHECKED: 0x00000000;
  var MF_CHECKED: 0x00000008;
  var MF_STRING: 0x00000000;
  var MF_MENUBARBREAK: 0x00000020;
  var MF_MENUBREAK: 0x00000040;
  // var MF_BITMAP; // do not use
  // var MF_OWNERDRAW // do not use
  // var MF_POPUP // do not use

  var TPM_LEFTALIGN: 0x0000;
  var TPM_CENTERALIGN: 0x0004;
  var TPM_RIGHTALIGN: 0x0008;
  var TPM_TOPALIGN: 0x0000;
  var TPM_VCENTERALIGN: 0x0010;
  var TPM_BOTTOMALIGN: 0x0020;
  var TPM_HORIZONTAL: 0x0000;
  var TPM_VERTICAL: 0x0040;
  var TPM_HORPOSANIMATION: 0x0400;
  var TPM_HORNEGANIMATION: 0x0800;
  var TPM_VERPOSANIMATION: 0x1000;
  var TPM_VERNEGANIMATION: 0x2000;
  var TPM_NOANIMATION: 0x4000;

  var MK_LBUTTON: 0x0001;
  var MK_RBUTTON: 0x0002;
  var MK_SHIFT: 0x0004;
  var MK_CONTROL: 0x0008;
  var MK_MBUTTON: 0x0010;
  var MK_XBUTTON1: 0x0020;
  var MK_XBUTTON2: 0x0040;

  var IDC_ARROW: 32512;
  var IDC_IBEAM: 32513;
  var IDC_WAIT: 32514;
  var IDC_CROSS: 32515;
  var IDC_UPARROW: 32516;
  var IDC_SIZE: 32640;
  var IDC_ICON: 32641;
  var IDC_SIZENWSE: 32642;
  var IDC_SIZENESW: 32643;
  var IDC_SIZEWE: 32644;
  var IDC_SIZENS: 32645;
  var IDC_SIZEALL: 32646;
  var IDC_NO: 32648;
  var IDC_APPSTARTING: 32650;
  var IDC_HAND: 32649;
  var IDC_HELP: 32651;

  var FILE_ATTRIBUTE_READONLY: 0x00000001;
  var FILE_ATTRIBUTE_HIDDEN: 0x00000002;
  var FILE_ATTRIBUTE_SYSTEM: 0x00000004;
  var FILE_ATTRIBUTE_DIRECTORY: 0x00000010;
  var FILE_ATTRIBUTE_ARCHIVE: 0x00000020;
  var FILE_ATTRIBUTE_NORMAL: 0x00000080;
  var FILE_ATTRIBUTE_TEMPORARY: 0x00000100;
  var FILE_ATTRIBUTE_SPARSE_FILE: 0x00000200;
  var FILE_ATTRIBUTE_REPARSE_POINT: 0x00000400;
  var FILE_ATTRIBUTE_COMPRESSED: 0x00000800;
  var FILE_ATTRIBUTE_OFFLINE: 0x00001000;
  var FILE_ATTRIBUTE_NOT_CONTENT_INDEXED: 0x00002000;
  var FILE_ATTRIBUTE_ENCRYPTED: 0x00004000;
  // var FILE_ATTRIBUTE_DEVICE // do not use
  // var FILE_ATTRIBUTE_VIRTUAL // do not use

  var VK_F1: 0x70;
  var VK_F2: 0x71;
  var VK_F3: 0x72;
  var VK_F4: 0x73;
  var VK_F5: 0x74;
  var VK_F6: 0x75;
  var VK_BACK: 0x08;
  var VK_TAB: 0x09;
  var VK_RETURN: 0x0d;
  var VK_SHIFT: 0x10;
  var VK_CONTROL: 0x11;
  var VK_ALT: 0x12;
  var VK_ESCAPE: 0x1b;
  var VK_PGUP: 0x21;
  var VK_PGDN: 0x22;
  var VK_END: 0x23;
  var VK_HOME: 0x24;
  var VK_LEFT: 0x25;
  var VK_UP: 0x26;
  var VK_RIGHT: 0x27;
  var VK_DOWN: 0x28;
  var VK_INSERT: 0x2d;
  var VK_DELETE: 0x2e;
  var VK_SPACEBAR: 0x20;

  type AlbumArtId = (typeof AlbumArtId)[keyof typeof AlbumArtId];
  var AlbumArtId: {
    front: 0;
    back: 1;
    disc: 2;
    icon: 3;
    artist: 4;
  };

  type AlbumArtType = (typeof AlbumArtType)[keyof typeof AlbumArtType];
  var AlbumArtType: {
    embedded: 0;
    default: 1;
    stub: 2;
  };

  type numberTypeCUI = (typeof numberTypeCUI)[keyof typeof numberTypeCUI];
  var numberTypeCUI: {
    text: 0;
    selection_text: 1;
    inactive_selection_text: 2;
    background: 3;
    selection_background: 4;
    inactive_selection_background: 5;
    active_item_frame: 6;
  };

  type numberTypeDUI = (typeof numberTypeDUI)[keyof typeof numberTypeDUI];
  var numberTypeDUI: {
    text: 0;
    background: 1;
    highlight: 2;
    selection: 3;
  };

  type FontTypeCUI = (typeof FontTypeCUI)[keyof typeof FontTypeCUI];
  var FontTypeCUI: {
    items: 0;
    labels: 1;
  };

  type FontTypeDUI = (typeof FontTypeDUI)[keyof typeof FontTypeDUI];
  var FontTypeDUI: {
    defaults: 0;
    tabs: 1;
    lists: 2;
    playlists: 3;
    statusbar: 4;
    console: 5;
  };

  type PlayListLockFilterMask =
    (typeof PlayListLockFilterMask)[keyof typeof PlayListLockFilterMask];
  var PlayListLockFilterMask: {
    filter_add: 1;
    filter_remove: 2;
    filter_reorder: 4;
    filter_replace: 8;
    filter_rename: 16;
    filter_remove_playlist: 32;
    filter_default_action: 64;
  };

  type ReplayGainMode = (typeof ReplaygainMode)[keyof typeof ReplaygainMode];
  var ReplaygainMode: {
    None: 0;
    Track: 1;
    Album: 2;
    Track_Album_By_Playback_Order: 3;
  };

  type PlaybackOrder = (typeof PlaybackOrder)[keyof typeof PlaybackOrder];
  var PlaybackOrder: {
    Default: 0;
    Repeat_Playlist: 1;
    Repeat_Track: 2;
    Random: 3;
    Shuffle_tracks: 4;
    Shuffle_albums: 5;
    Shuffle_folders: 6;
  };

  type PlaybackQueueOrigin =
    (typeof PlaybackQueueOrigin)[keyof typeof PlaybackQueueOrigin];
  var PlaybackQueueOrigin: {
    user_added: 0;
    user_removed: 1;
    playback_advance: 2;
  };

  type PlaybackStartingCMD =
    (typeof PlaybackStartingCMD)[keyof typeof PlaybackStartingCMD];
  var PlaybackStartingCMD: {
    default: 0;
    play: 1;
    next: 2;
    prev: 3;
    settrack: 4;
    rand: 5;
    resume: 6;
  };

  type PlaybackStopReason =
    (typeof PlaybackStopReason)[keyof typeof PlaybackStopReason];
  var PlaybackStopReason: {
    user: 0;
    eof: 1;
    starting_another: 2;
  };

  type SelectionType = (typeof SelectionType)[keyof typeof SelectionType];
  var SelectionType: {
    undefined: 0;
    active_playlist_selection: 1;
    caller_active_playlist: 2;
    playlist_manager: 3;
    now_playing: 4;
    keyboard_shortcut_list: 5;
    media_library_viewer: 6;
  };

  type ImageEffect = (typeof ImageEffect)[keyof typeof ImageEffect];
  var ImageEffect: {
    grayscale: 0;
    invert: 1;
    sepia: 2;
  };

  var colours: {
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
}
export {};
