/**
 * These typings will shortly become available on NPM as part of `@castlabs/prestoplay`.
 * When they are, delete this file!
 */
declare module '@castlabs/prestoplay' {

  export namespace clpp {
    export interface IPlayerSurface {
    /**
     * Adds the given element to the container.
     * Throws an error if no container is available.
     *
     * @param element The element to add
     * @param opt_fill If true, the css fill class will be applied
     * @param opt_prepend If true, appends the element at the beginning
     */
      addElementToContainer(element: Element, opt_fill?: boolean, opt_prepend?: boolean): void
      /**
     * Returns the cast media player element on Chromecast Web Receiver.
     * Note that this will return an element only when using
     * `<cast-media-player>` instead of `<video>` or `<audio>` tag.
     */
      getCastElement(): Element|null
      /**
     * Returns the container element.
     * Returns null if container is disabled.
     */
      getContainer(): Element|null
      /**
     * Returns the primary media element or null.
     */
      getMedia(): HTMLMediaElement|null
      /**
     * Request that this object release all internal references.
     */
      release(): void
      /**
     * Removes an element from the container.
     */
      removeElementFromContainer(element: Element): void
    }
  
    export interface ITextDisplayer {
    /**
     * Returns the background color.
     */
      getBackgroundColor(): string|null
      /**
     * Returns the edge color.
     */
      getEdgeColor(): string|null
      /**
     * Returns the edge type.
     */
      getEdgeType(): clpp.text.EdgeType|null
      /**
     * Returns the font color.
     */
      getFontColor(): string|null
      /**
     * Returns the font family.
     */
      getFontFamily(): string|null
      /**
     * Returns the font size.
     */
      getFontSize(): string|null
      /**
     * Returns the font size percent.
     */
      getFontSizePercent(): number|null
      /**
     * Returns the window color, i.e. a box around a cue.
     */
      getWindowColor(): string|null
      /**
     * Sets the background color.
     *
     * @param val The background color as CSS expression.
     */
      setBackgroundColor(val: string): void
      /**
     * Sets the edge color.
     *
     * @param val The edge color as CSS expression.
     */
      setEdgeColor(val: string): void
      /**
     * Sets the edge type.
     *
     * @param val The edge type.
     */
      setEdgeType(val: clpp.text.EdgeType|null): void
      /**
     * Sets the font color.
     *
     * @param val The font color as CSS expression.
     */
      setFontColor(val: string): void
      /**
     * Sets the font family.
     *
     * @param val The font family as CSS expression.
     */
      setFontFamily(val: string): void
      /**
     * Sets the font size.
     * If defined, it takes precedence over the `fontSizePercent`.
     *
     * @param val The font size as CSS expression.
     */
      setFontSize(val: string): void
      /**
     * Sets the font size percent.
     * The font size percent is relative to the video height.
     * The actual font size will be adjusted automatically on video size change,
     * for example when entering fullscreen mode. Please note that
     * the native text displayer doesn't support this option at the moment.
     *
     * @param val The font size percent. Default value is `1/15`.
     */
      setFontSizePercent(val: number): void
      /**
     * Sets the window color, i.e. a box around a cue.
     * Please note that the HTML text displayer
     * doesn't support this option at the moment.
     *
     * @param val The window color as CSS expression.
     */
      setWindowColor(val: string): void
    }
  
    /**
   * The base interface for player plugins. A player plugin is a plugin that will
   * be created per player instance. The interface provides callbacks for the
   * basic player lifecycle
   */
    export interface PlayerPlugin {
    /**
     * Returns a plugin ID.
     * If a plugin ID is exposed, the plugin instance will be
     * registered as a player component.
     */
      id(): string
      /**
     * Callback that is triggered after content is loaded
     *
     * @param player The player
     * @param optArgs Optional arguments
     */
      onContentLoaded(player: clpp.Player, ...optArgs: any[]): void|Promise<void>
      /**
     * Callback that is triggered before content is loaded
     *
     * @param player The player
     * @param source The chosen source
     */
      onContentWillLoad(player: clpp.Player, source: clpp.Source): void
      /**
     * Callback that is triggered when the player is created, i.e. when an instance
     * of {@link clpp.Player} is created.
     *
     * @param player The player
     */
      onPlayerCreated(player: clpp.Player): void
      /**
     * Callback that is triggered when the player is destroyed.
     *
     * @param player The player
     */
      onPlayerWillDestroy(player: clpp.Player): void
      /**
     * Callback that is triggered when the player is released
     *
     * @param player The player
     */
      onPlayerWillRelease(player: clpp.Player): void
    }
  
    /**
   * Implementation of this factory are used to create new player plugins
   */
    export interface PlayerPluginFactory {
    /**
     * Create a new player plugin or return null.
     *
     * @param config The player configuration
     */
      create(config: clpp.PlayerConfiguration): clpp.PlayerPlugin|null
    }
  
    export type AbrConfiguration = {
    /**
     * The largest fraction of the estimated bandwidth we should use. We should
     * downgrade to avoid this.
     */
      bandwidthDowngradeTarget: number
      /**
     * The fraction of the estimated bandwidth which we should try to use when
     * upgrading.
     */
      bandwidthUpgradeTarget: number
      /**
     * The default bandwidth estimate to use if there is not enough data, in
     * bit/sec.
     */
      defaultBandwidthEstimate: number
      /**
     * If true, enable adaptation by the current AbrManager.  Defaults to true.
     */
      enabled: boolean
      /**
     * Restrictions used only for initial ABR selection. This can be used i.e.
     * in DRM multikey scenarios, to ensure that first selected track will be
     * playable on any platform.
     */
      initialRestrictions?: clpp.Restrictions
      /**
     * The restrictions to apply to ABR decisions.  These are "soft" restrictions.
     * Any track that fails to meet these restrictions will not be selected
     * automatically, but will still appear in the track list and can still be
     * selected via selectVariantTrack().  If no tracks meet these restrictions,
     * AbrManager should not fail, but choose a low-res or low-bandwidth variant
     * instead.
     */
      restrictions: clpp.Restrictions
      /**
     * The minimum amount of time that must pass between switches, in
     * seconds. This keeps us from changing too often and annoying the user.
     */
      switchInterval: number
      /**
     * By default ABR algorithm switches video quality as soon as he has enough
     * data to do it, initially ignoring `switchInterval` value. Set it to true
     * when initial educated switch should respect switch interval.
     */
      useSwitchIntervalForInitialSwitch: boolean
    }
  
    /**
   * Broadpeak plugin configuration.
   */
    export type BroadpeakConfiguration = {
    /**
     * The address of the analytics server to send metrics to.
     */
      analyticsAddress: string
      /**
     * The domain name list to use to identify url(s)
     * using broadpeak product (i.e "cdn.broadpeak.com,cdn2.broadpeak.com").
     * "*" specific value is used to declare that all given url are
     * using broadpeak product. Empty value "" is used to declare
     * that all given url are not using broadpeak value.
     */
      broadpeakDomainNames: string
      /**
     * Custom session parameters.
     */
      customParameters: Object
      /**
     * The address inside the home network of the device
     * where the nanoCDN is embedded. It can be
     * a list of hosts separated by "," (i.e "192.168.1.1,192.168.10.1")
     */
      nanoCDNHost: string
      /**
     * The Unique User Identifier.
     */
      uuid: string
    }
  
    /**
   * Connectivity check configuration.
   */
    export type ConnectivityCheckConfiguration = {
    /**
     * Attempt parameters.
     */
      attemptParameters?: clpp.net.AttemptParameters
      /**
     * HTTP method to use. If omitted, checker will default to HEAD.
     */
      method?: string
      /**
     * Connectivity check URL.
     */
      url: string
    }
  
    /**
   * Conviva plugin configuration.
   */
    export type ConvivaConfiguration = {
    /**
     * Connection type. As it cannot be determined efficiently by currently
     * available Web APIs, Castlabs Player does not put any defaults here.
     * 
     * Should be one of values: WiFi, Ethernet, 2G, 3G, 4G, OTHER.
     */
      connectionType?: string
      /**
     * Custom Tags per business requirement.
     */
      customTags?: Object
      /**
     * Unique customer key provided by Conviva.
     */
      customerKey: string
      /**
     * The default video server resource to report for the content.
     * Use when the video server resource cannot be directly inferred from
     * stream URL (by the Conviva SDK).
     * Examples: EDGECONVIVA SDKT-1, AKAMAI-FREE, LEVEL3-PREMIUM...
     */
      defaultResource?: string
      /**
     * Device brand. If omitted, value will be guessed based on available
     * `userAgent`.
     */
      deviceBrand?: string
      /**
     * Device category - should be one of the constants defined in
     * `Conviva.Constants.DeviceCategory`. If omitted, proper value will be
     * guessed based on available `userAgent`.
     */
      deviceCategory?: string
      /**
     * Device metadata object that can be passed directly to Conviva. If present,
     * player will pass it to Conviva SDK. If this argument is omitted or some
     * fields are missing, player will try to guess metadata based on available
     * `userAgent` and other configuration fields.
     * 
     * For all configuration possibilities, please check the
     * {@link https://community.conviva.com/site/one-sensor/sensors/javascript/index_one_sensor.gsp#device-tags | Conviva documentation}
     */
      deviceMetadata?: Object
      /**
     * Device type - should be one of the constants defined in
     * `Conviva.Constants.DeviceType`. If omitted, proper value will be guessed
     * based on available `userAgent`.
     */
      deviceType?: string
      /**
     * Defaults to false
     * If set to true, the implementation will report ad analytics
     */
      enableAdInsights: boolean
      /**
     * Player name that will be reported to Conviva. If omitted, SDK by default
     * reports itself as 'CastlabsPlayer'.
     */
      playerName?: string
      /**
     * The Conviva Touchstone service URL. Use debugging purposes only.
     * Don't set this option in production!
     */
      serviceUrl?: string
      /**
     * The viewer identity.
     */
      viewerId: string
    }
  
    /**
   * An object of this type can be used to setup the player with any DRM
   * backend that is supported by the underlying browsers.
   */
    export type DrmConfiguration = {
    /**
     * Parameters for requests retrying.
     */
      attemptParameters?: clpp.net.AttemptParameters
      /**
     * Configuration map specific for chosen DRM environment. For DRMtoday
     * configuration please refer to the manual.
     */
      customData?: Record<string, any>
      /**
     * Delays license request until content is actually played.
     */
      delayLicenseRequestUntilPlayed?: boolean
      /**
     * Specifies which EME API shall be used. If not explicitly set, we
     * will try to use the one that is more suitable on active platform.
     * Specify it to {@link clpp.drm.eme.EmeFactory.Apis.STANDARD} if you want to
     * play protected content on Safari using MSE.
     */
      emeApi?: clpp.drm.eme.EmeFactory.Apis
      /**
     * Enable the DRM session cache for SKD license request.
     * We encountered issues with FairPlay in native Safari when SKD
     * initialization is used.We do received multiple requests for the same key
     * request from the native engine and if we are not full-filling the requests,
     * it can cause a decryption error. The default implementation ignores the
     * session cache and will handle each `encrypted` event. In this case,
     * there might be duplicated requests triggered by the player for license keys
     * that were already fetched. This is done to avoid any potential decryption
     * errors. Setting this option to true will enable the session cache also for
     * SKD init data and avoid any redundant license requests. Note that you might
     * encounter more 3016 decode errors on Safari with native playback and SKD
     * initialization when enabling the session cache.
     */
      enableSessionCacheForSkd?: boolean
      /**
     * Enforces single session for Widevine to avoid unnecessary license requests.
     */
      enforceSingleSession?: boolean
      /**
     * DRM environment to use. By default, provided environments are: DRMtoday,
     * DRMtoday_STAGING. DRMtoday_TEST. You may also register your own
     * environments (please refer to the manual).
     */
      env: string
      /**
     * ID for offline playback of secure content.
     */
      offlineId?: string
      /**
     * Specifies which DRM system should be preferred during configuration (i.e.
     * to use Widevine on Edge Chromium).
     * Fallbacks to the other available system if a specified one is unavailable.
     * By default player tries to setup most secure system on given platform.
     */
      preferredDrmSystem?: clpp.drm.KeySystem
    }
  
    /**
   * DRM configuration for a single key system.
   */
    export type DrmInfo = {
    /**
     * Defaults to '', e.g., no specific robustness required.  Can be filled in
     * by advanced DRM config. 
     * 
     * A key-system-specific string that specifies a required security level.
     */
      audioRobustness: string|Array<string>
      /**
     * Defaults to false.  Can be filled in by advanced DRM config. 
     * 
     * True if the application requires the key system to support distinctive
     * identifiers.
     */
      distinctiveIdentifierRequired: boolean
      /**
     * Defaults to [], e.g., no override. 
     * 
     * A list of initialization data which override any initialization data found
     * in the content.  See also {@link clpp.InitDataOverride}.
     */
      initData: Array<clpp.InitDataOverride>
      /**
     * Defaults to [] 
     * 
     * If not empty, it contains the default key IDs for this key system, as
     * lowercase hex strings.
     */
      keyIds: Array<string>
      /**
     * Required. 
     * 
     * The key system, e.g., "com.widevine.alpha".
     */
      keySystem: clpp.drm.KeySystem
      /**
     * Filled in by DRM config if missing. 
     * 
     * The license server URI.
     */
      licenseServerUri: string
      /**
     * The ID of the period that these DRM infos belong
     * to.
     */
      periodId: string|null
      /**
     * Defaults to false.  Can be filled in by advanced DRM config. 
     * 
     * True if the application requires the key system to support persistent
     * state, e.g., for persistent license storage.
     */
      persistentStateRequired: boolean
      /**
     * Defaults to null, e.g., certificate will be requested from the license
     * server if required.  Can be filled in by advanced DRM config. 
     * 
     * A key-system-specific server certificate used to encrypt license requests.
     * Its use is optional and is meant as an optimization to avoid a round-trip
     * to request a certificate.
     */
      serverCertificate: Uint8Array
      /**
     * Defaults to '', e.g., no specific robustness required.  Can be filled in
     * by advanced DRM config. 
     * 
     * A key-system-specific string that specifies a required security level.
     */
      videoRobustness: string|Array<string>
    }
  
    export type DrmSupportType = {
    /**
     * Whether this key system supports persistent state.
     */
      persistentState: boolean
    }
  
    /**
   * Contains information about an EMSG MP4 box.
   */
    export type EmsgInfo = {
    /**
     * The time that the event ends (in presentation time).
     */
      endTime: number
      /**
     * The duration of the event (in units of timescale).
     */
      eventDuration: number
      /**
     * A field identifying this instance of the message.
     */
      id: number
      /**
     * Body of the message.
     */
      messageData: Uint8Array
      /**
     * The offset that the event starts, relative to the start of the segment
     * this is contained in (in units of timescale).
     */
      presentationTimeDelta: number
      /**
     * Identifies the message scheme.
     */
      schemeIdUri: string
      /**
     * The time that the event starts (in presentation time).
     */
      startTime: number
      /**
     * Provides the timescale, in ticks per second.
     */
      timescale: number
      /**
     * Specifies the value for the event.
     */
      value: string
    }
  
    /**
   * The type for event listener callback functions.
   */
    export type EventCallback = EventListener|((event: Record<string, any>) => any)
  
    /**
   * The main property is the `licenseUrl` to the DRM backend, but you would
   * usually also implement at least some of the network modifier. This can be
   * used for example to add some headers to the license request, or to access
   * and even modify the responses.
   */
    export type FairplayDrmSystem = {
    /**
     * The URL to the certificate.
     */
      certificateUrl: string
      /**
     * The server that handles an 'individualization-request'. If the server isn't
     * given, it will default to the license server.
     */
      individualizationServer: string
      /**
     * The URL to the license server.
     */
      licenseUrl: string
      /**
     * A set of callbacks to perform modifications on license/certificate requests
     * and/or responses.
     */
      modifiers?: clpp.drm.LicenseModifiers
    }
  
    /**
   * FreeWheel plugin configuration.
   */
    export type FreeWheelConfiguration = {
    /**
     * Key value pairs that will be passed to the context.
     */
      keyValues?: Record<string, string>
      /**
     * The network ID of the distributor.
     */
      networkId: number
      /**
     * Additional parameters that will be passed to the context.
     */
      parameters?: Array<clpp.FreeWheelParameter>
      /**
     * List of temporal slots which should be added to the context.
     */
      pods?: Array<clpp.FreeWheelPod>
      /**
     * Name of global profile.
     */
      profileId: string
      /**
     * Ad server url.
     */
      serverUrl: string
      /**
     * The ID of the site section which correspond to the ad request.
     */
      siteSectionId?: string|number
      /**
     * The id of the video asset which correspond to the ad request.
     */
      videoAssetId: string|number
    }
  
    /**
   * FreeWheel parameter.
   */
    export type FreeWheelParameter = {
    /**
     * Level of the parameters, must be one of values provided by FreeWheel SDK (
     * `PARAMETER_LEVEL_GLOBAL` or `PARAMETER_LEVEL_OVERRIDE`).
     */
      level: number
      /**
     * Name of the parameter to be set.
     */
      name: string
      /**
     * Value for the parameter
     */
      value: any
    }
  
    /**
   * FreeWheel pod definition.
   */
    export type FreeWheelPod = {
    /**
     * Accepted content types, use "," as delimiter.
     */
      acceptContentType?: string
      /**
     * Cuepoint sequence override.
     */
      cuepointSequence?: number
      /**
     * Custom ID of the slot.
     */
      id: string
      /**
     * Maximum duration of the slot allowed.
     */
      maxDuration?: number
      /**
     * Minimum duration of the slot allowed.
     */
      minDuration?: number
      /**
     * Time position of the slot in seconds.
     */
      position: number
      /**
     * Profile name of the slot.
     */
      slotProfile?: string
      /**
     * Type of slot.
     */
      type: clpp.ads.PodType
    }
  
    /**
   * HLS-SMPTE plugin configuration.
   */
    export type HlsSmpteConfiguration = {
    /**
     * Enforce the creation of the metadata track if not available.
     * Default is false.
     */
      patchMetadataTrack: boolean
      /**
     * Offset which is applied to cue timestamps. Default is 0.
     */
      timestampOffset: number
    }
  
    /**
   * HtmlCue component configuration.
   */
    export type HtmlCueConfiguration = {
    /**
     * Enable the resize observer. Default is true.
     * There are platforms where the video size is fixed (for example Smart TVs)
     * and the resize observer might be disabled to not cause unnecessary load.
     */
      enableResizeObserver: boolean
      /**
     * Stretch a subtitle image (like SMPTE-TT or IMSC1) to fit the surrounding
     * container.
     */
      stretchSmpteImage: boolean
    }
  
    /**
   * IMA plugin configuration.
   */
    export type ImaConfiguration = {
    /**
     * The ad tag url that is requested from the ad server.
     */
      adTagUrl: string
      /**
     * Maximum recommended bitrate. The value is in kbit/s.
     * Default value, -1, means the bitrate will be selected by the SDK.
     */
      bitrate: number
      /**
     * Enables preloading of video assets.
     */
      enablePreloading: boolean
      /**
     * Timeout (in milliseconds) when loading a video ad media file.
     * Use -1 for the default of 8 seconds.
     */
      loadVideoTimeout: number
      /**
     * If specified, the SDK will include media that matches the MIME type(s)
     * specified in the list and exclude media that does not match
     * the specified MIME type(s). If not specified, the SDK will pick
     * the media based on player capabilities.
     */
      mimeTypes: Array<string>
      /**
     * For VMAP and ad rules playlists, only play ad breaks scheduled
     * after this time (in seconds).
     */
      playAdsAfterTime: number
      /**
     * Specifies whether the UI elements that should be displayed.
     */
      uiElements: Array<string>
      /**
     * Render linear ads with full UI styling.
     */
      useStyledLinearAds: boolean
    }
  
    /**
   * Explicit initialization data, which override any initialization data in the
   * content. The initDataType values and the formats that they correspond to
   * are specified {@link https://bit.ly/EmeInitTypes here}.
   */
    export type InitDataOverride = {
    /**
     * Initialization data in the format indicated by initDataType.
     */
      initData: Uint8Array
      /**
     * A string to indicate what format initData is in.
     */
      initDataType: string
      /**
     * The key Id that corresponds to this initData.
     */
      keyId: string|null
      /**
     * The period ID
     */
      periodId: string|null
    }
  
    /**
   * Parameters passed to {@link clpp.drm.InitDataTransformer}.  They could
   * be used to customize the behavior of provided initDataTransformer modifier.
   */
    export type InitDataTransformerParams = {
    /**
     * The current DRM info
     */
      drmInfo: clpp.DrmInfo|null
      /**
     * The current DRM system configuration
     */
      drmSystemConfig: clpp.FairplayDrmSystem|clpp.PlayreadyDrmSystem|clpp.WidevineDrmSystem
      /**
     * EME API currently in use.
     */
      emeApi: clpp.drm.eme.EmeFactory.Apis
      /**
     * The initData from `encrypted` event
     */
      initData: Uint8Array
      /**
     * The initData type from `encrypted` event
     */
      initDataType: string
      /**
     * The current player configuration
     */
      playerConfig: clpp.PlayerConfiguration
      /**
     * The current session context
     */
      sessionContext: clpp.SessionContext
    }
  
    export type ManifestConfiguration = {
    /**
     * Retry parameters for manifest requests.
     */
      attemptParameters: clpp.net.AttemptParameters
      /**
     * If true, ignore the availabilityStartTime in the DASH manifest
     * and instead use the segments to determine the live edge.
     * This allows us to play streams that have a lot of drift.
     * If false, we can't play content where the manifest specifies
     * segments in the future. Defaults to true.
     */
      autoCorrectDrift?: boolean
      /**
     * A number, in seconds, that overrides the availability window in the
     * manifest, or NaN if the default value should be used.
     */
      availabilityWindowOverride: number
      /**
     * A default clock sync URI to be used with DASH live streams which do not
     * contain any clock sync information. The "Date" header from the HTTP
     * response from this URI will be used to determine the current time.
     * (According to the urn:mpeg:dash:utc:http-head:2014 scheme.)
     */
      clockSyncUri?: string
      /**
     * A fallback value if a variant hasn't a codec definition.
     * The value is a list of codecs separated by comma (video and audio).
     * If a stream is video or audio only, single codec should be defined.
     * Default is `avc1.42E01E,mp4a.40.2'`
     */
      hlsDefaultCodecs: string
      /**
     * If true will cause DASH parser to ignore DRM information specified
     * by the manifest and treat it as if it signaled no particular key
     * system and contained no init data. Defaults to false if not provided.
     */
      ignoreDrmInfo: boolean
      /**
     * If set (in seconds), it will override Smooth manifest update period. By
     * default, manifest for live content updates every max_segment_duration or
     * every 10 seconds (whichever value is smaller).
     */
      liveRefreshPeriod: number
      /**
     * If set, manifest parser will try to override existing PlayReady header to
     * specified version.
     * 
     * Supported values: `4.0.0.0`, `4.1.0.0`, `4.2.0.0`, `4.3.0.0`.
     */
      playreadyVersion: string
      /**
     * If true, xlink-related errors will result in a fallback to the tag's
     * existing contents. If false, xlink-related errors will be propagated
     * to the application and will result in a playback failure. Defaults to
     * false if not provided.
     */
      xlinkFailGracefully: boolean
    }
  
    /**
   * Mux Data plugin configuration.
   */
    export type MuxDataConfiguration = {
    /**
     * Your environment key.
     */
      envKey: string
      /**
     * The MUX data SDK
     */
      muxLib?: Object
      /**
     * Pass more or/and override MUX SDK options.
     */
      muxOptionsOverride: Record<string, any>
    }
  
    /**
   * The DRMtoday Onboard configuration.
   */
    export type OnboardConfiguration = {
    /**
     * The base URL of the DRMtoday Onboard host.
     */
      baseUrl: string
      /**
     * The Fairplay path. Default is 'fairplay'.
     */
      fairplayUrl: string
      /**
     * The Playready path. Default is 'playready'.
     */
      playreadyUrl: string
      /**
     * The Widevine path. Default is 'widevine'.
     */
      widevineUrl: string
    }
  
    /**
   * Platform information.
   */
    export type PlatformInfo = {
    /**
     * The current browser.
     */
      browser: string
      /**
     * The browser version.
     */
      browserVersion: clpp.PlatformVersion
      /**
     * The operating system name.
     */
      os: string
      /**
     * The operating system version.
     */
      osVersion: clpp.PlatformVersion
    }
  
    /**
   * A version with a human readable name and major, minor, patch, and build
   * properties.
   */
    export type PlatformVersion = {
    /**
     * The build version number.
     */
      build?: number
      /**
     * The major version number.
     */
      major: number
      /**
     * The minor version number.
     */
      minor?: number
      /**
     * The human readable name.
     */
      name: string
      /**
     * The patch version number.
     */
      patch?: number
    }
  
    /**
   * The player configuration
   */
    export type PlayerConfiguration = {
    /**
     * ABR configuration and settings.
     */
      abr?: Partial<clpp.AbrConfiguration>
      /**
     * Configures the autoplay behavior.
     */
      autoplay?: boolean
      /**
     * Broadpeak plugin configuration.
     */
      broadpeak?: Partial<clpp.BroadpeakConfiguration>
      /**
     * Connectivity check configuration is used to determine network connection.
     * If not configured, connectivity check will be disabled.
     */
      connectivityCheck?: Partial<clpp.ConnectivityCheckConfiguration>
      /**
     * Conviva plugin configuration.
     */
      conviva?: Partial<clpp.ConvivaConfiguration>
      /**
     * The drm configuration.
     */
      drm?: Partial<clpp.DrmConfiguration>|null
      /**
     * Defaults to true. 
     * 
     * If true, attempts to use HTML rendered subtitles instead of native.
     * The `clpp.htmlcue.HtmlCueComponent` component has to be loaded.
     */
      enableHtmlCue?: boolean
      /**
     * Defaults to false. 
     * 
     * Some native players, such as the Safari native player, respond with a
     * loadedmetadata event before the track model is initialized. This causes
     * the 'Player.load()' method to resolve before the tracks are fully
     * available. This can be acceptable, for instance if the track model is
     * queried dynamically or of the Application listens for track change events.
     * However, if the load promise should wait until data is loaded and the
     * tracks are initialized, this flag can be set to true. Note though, if
     * preload is set and for instance configured to only load metadata, the
     * load promise will only resolve once actual media data are loaded.
     */
      forceWaitForTracks?: boolean
      /**
     * FreeWheel ads configuration.
     */
      freewheel?: Partial<clpp.FreeWheelConfiguration>
      /**
     * HLS-SMPTE configuration.
     */
      hlssmpte?: Partial<clpp.HlsSmpteConfiguration>
      /**
     * HtmlCue component configuration.
     */
      htmlcue?: Partial<clpp.HtmlCueConfiguration>
      /**
     * Ads plugin configuration.
     */
      ima?: Partial<clpp.ImaConfiguration>
      /**
     * The castLabs license key.
     */
      license?: string
      /**
     * Defaults to false. 
     * 
     * Loop Playback.
     */
      loop?: boolean
      /**
     * Defaults to false. 
     * 
     * Enable low latency mode to playback live content as close to the live edge
     * as possible. This is an experimental feature.
     */
      lowLatencyMode?: boolean
      /**
     * Manifest configuration and settings.
     */
      manifest?: Partial<clpp.ManifestConfiguration>
      /**
     * Defaults to undefined. 
     * 
     * Initial muted state.
     */
      muted?: boolean
      /**
     * Mux Data configuration.
     */
      muxdata?: Partial<clpp.MuxDataConfiguration>
      /**
     * Defaults to false. 
     * 
     * It true, playback will be paused when the player/application is put into
     * background. Playback will be resumed once the player/application is put
     * back into foreground.
     */
      pauseWhenInBackground?: boolean
      /**
     * Defaults to 2.
     * The preferred number of audio channels.
     */
      preferredAudioChannelCount?: number
      /**
     * If defined, specifies
     * the preferred audio codecs in case multiple encodings are available in the
     * manifest. The selection is based on a prefix match on the base codec name,
     * e.g. 'mp4a'. By default the most efficient encoding is selected based on
     * the minimal average bandwidth. This setting can be used to manually prefer
     * specific codecs. When an array of values is passed (e.g. `['opus', 'mp4a']`
     * ) the highest priority has an element at index 0 (if it's found in the
     * supported codecs), then at index 1, etc.
     */
      preferredAudioCodec?: string|Array<string>
      /**
     * Defaults to ''. 
     * 
     * Language code for the preferred audio language.
     * Pass an array of languages if you want to define fallback languages.
     */
      preferredAudioLanguage?: string|Array<string>
      /**
     * Defaults to 'main'. 
     * 
     * The preferred role to use for audio (DASH only).
     */
      preferredAudioRole?: string
      /**
     * Defaults to ''. 
     * 
     * Language code for the preferred text language. If this is specified,
     * subtitles will be enabled at startup.
     * Pass an array of languages if you want to define fallback languages.
     */
      preferredTextLanguage?: string|Array<string>
      /**
     * The preferred role to use for text tracks.
     */
      preferredTextRole?: string
      /**
     * If defined, specifies
     * the preferred video codecs in case multiple encodings are available in the
     * manifest. The selection is based on a prefix match on the base codec name,
     * e.g. 'avc1'. By default the most efficient encoding is selected based on
     * the minimal average bandwidth. This setting can be used to manually prefer
     * specific codecs. When an array of values is passed (e.g. `['hvc1', 'vp9']`
     * ) the highest priority has an element at index 0 (if it's found in the
     * supported codecs), then at index 1, etc.
     */
      preferredVideoCodec?: string|Array<string>
      /**
     * Remote text tracks to load.
     */
      remoteTextTracks?: Array<clpp.RemoteTextTrack>
      /**
     * Limit the renditions that can be played.
     */
      restrictions?: Partial<clpp.Restrictions>
      /**
     * Safari-related configuration.
     */
      safari?: Partial<clpp.SafariConfiguration>
      /**
     * Source to play.
     */
      source?: clpp.Source|string|Array<(clpp.Source|string)>
      /**
     * Defaults to 0 for VoD assets and live edge for Live content 
     * 
     * Set the playback start time in seconds.
     */
      startTime?: number|null
      /**
     * The streaming configuration
     */
      streaming?: Partial<clpp.StreamingConfiguration>
      /**
     * The suggested presentation delay for live content in seconds. By default
     * this is not specified. The default live edge is
     * minBufferDuration * 3 in case of DASH and 3 * segmentDuration in case of
     * HLS. This parameter can be used to adjust the live edge. If set it will
     * take precedence.
     */
      suggestedPresentationDelay?: number
      /**
     * Text style specific configuration
     */
      textStyle?: Partial<clpp.TextStyleConfiguration>
      /**
     * Thumbnails plugin configuration.
     */
      thumbnails?: Partial<clpp.ThumbnailsConfiguration>
      /**
     * Tizen specific configuration
     */
      tizen?: Partial<clpp.TizenConfiguration>
      /**
     * TTML component configuration.
     */
      ttml?: Partial<clpp.TtmlConfiguration>
      /**
     * A unique identifier of a viewer. Its format may be arbitrary, but it must
     * be unique for each viewer.
     * 
     * 
     * This is mandatory if your castLabs license requires it.
     */
      viewerId?: string
      /**
     * Vimond plugin configuration.
     */
      vimond?: Partial<clpp.VimondConfiguration>
      /**
     * Defaults to null. 
     * 
     * Initial startup volume. Please note that on some platforms setting the
     * video element volume is not supported and will not have an effect. For
     * example in iOS devices, the volume is exclusively controlled through the
     * device volume.
     */
      volume?: number|null
      /**
     * The VR plugin configuration.
     */
      vr?: Partial<clpp.VrConfiguration>
      /**
     * Youbora plugin configuration.
     */
      youbora?: Partial<clpp.YouboraConfiguration>
    }
  
    /**
   * The player surface configuration
   */
    export type PlayerSurfaceConfiguration = {
    /**
     * The container element
     */
      containerEl: Element
      /**
     * The default crossorigin
     * configuration that will be applied to any media tag if its not specified in
     * the tag. Defaults to 'anonymous'
     */
      crossorigin: string
      /**
     * If true, no container will be
     * generated
     */
      disableContainer: boolean
    }
  
    /**
   * Playlist item.
   */
    export type PlaylistItem = {
    /**
     * The player configuration.
     */
      configuration: clpp.PlayerConfiguration
      /**
     * Optional. The description.
     */
      description?: string
      /**
     * Optional. The URL of the poster.
     */
      image?: string
      /**
     * Optional. The title.
     */
      title?: string
    }
  
    /**
   * The main property is the `licenseUrl` to the DRM backend, but you would
   * usually also implement at least some of the network modifier. This can be
   * used for example to add some headers to the license request, or to access
   * and even modify the responses.
   */
    export type PlayreadyDrmSystem = {
    /**
     * The EME audio robustness level.
     */
      audioRobustness: string|clpp.drm.PlayreadyRobustnessLevel|Array<null|clpp.drm.PlayreadyRobustnessLevel>
      /**
     * The server that handles an 'individualization-request'. If the server isn't
     * given, it will default to the license server.
     */
      individualizationServer?: string
      /**
     * The URL to the license server.
     */
      licenseUrl: string
      /**
     * A set of callbacks to perform modifications on license requests and/or
     * responses.
     */
      modifiers?: clpp.drm.LicenseModifiers
      /**
     * Flag which can enforce usage of legacy 'com.microsoft.playready' key
     * system on platforms which already support
     * 'com.microsoft.playready.recommendation'. Should be set to true if given
     * DRM provider does not support this key system properly.
     */
      useLegacySystem?: string
      /**
     * The EME video robustness level.
     */
      videoRobustness: string|clpp.drm.PlayreadyRobustnessLevel|Array<null|clpp.drm.PlayreadyRobustnessLevel>
    }
  
    /**
   * Thumbnails preload configuration.
   */
    export type PreloadConfiguration = {
    /**
     * If true, thumbnails will be downloaded even during video buffering.
     */
      preloadWhileBuffering?: boolean
      /**
     * Value indicating index of images downloaded in current wave
     * (i.e. 5 means in current wave we will preload images for indices 5, 10,
     * 15 and so on).
     */
      step: number
    }
  
    /**
   * Definition of track that can be loaded remotely.
   */
    export type RemoteTextTrack = {
    /**
     * Codec required for delivered text track.
     */
      codec?: string
      /**
     * Kind of subtitles.
     */
      kind: string
      /**
     * Optional label with basic track description.
     */
      label?: string
      /**
     * Subtitles language code.
     */
      language: string
      /**
     * Subtitles MIME type.
     */
      mimeType: string
      /**
     * Source for subtitles.
     */
      url: string
    }
  
    export type RenditionChoice = {
    /**
     * The bandwidth of the chosen rendition (null for text).
     */
      bandwidth: number|null
      /**
     * True if the choice was made by AbrManager for adaptation; false if it
     * was made by the application through selectTrack.
     */
      fromAdaptation: boolean
      /**
     * The bandwidth of the chosen rendition (null for audio and text).
     */
      height: number|null
      /**
     * The id of the rendition that was chosen.
     */
      id: string
      /**
     * The timestamp the choice was made, in seconds since 1970
     * (i.e. Date.now() / 1000).
     */
      timestamp: number
      /**
     * The associated track id.
     */
      trackId: string
      /**
     * The type of rendition chosen ('video', 'audio, or 'text').
     */
      type: string
      /**
     * The width of the chosen rendition (null for audio and text).
     */
      width: number|null
    }
  
    export type RestrictionInfo = {
    /**
     * Whether there are streams that are restricted due to app-provided
     * restrictions.
     */
      hasAppRestrictions: boolean
      /**
     * The key IDs that were missing.
     */
      missingKeys: Array<string>
      /**
     * The restricted EME key statuses that the streams had.  For example,
     * 'output-restricted' would mean streams couldn't play due to restrictions
     * on the output device (e.g. HDCP).
     */
      restrictedKeyStatuses: Array<string>
    }
  
    /**
   * An object of this type can be used apply restrictions and filters to
   * video renditions and force the player to exclude video tracks based on
   * these restrictions. All restrictions must be fulfilled for a track to be
   * playable.
   */
    export type Restrictions = {
    /**
     * The minimum bandwidth of a track in bit/sec.
     */
      maxBandwidth: number
      /**
     * The maximum height of a video track, in pixels.
     */
      maxHeight: number
      /**
     * The maximum number of total pixels in a video track (i.e. width * height).
     */
      maxPixels: number
      /**
     * The maximum width of a video track, in pixels.
     */
      maxWidth: number
      /**
     * The minimum bandwidth of a track in bit/sec.
     */
      minBandwidth: number
      /**
     * The minimum height of a video track, in pixels.
     */
      minHeight: number
      /**
     * The minimum number of total pixels in a video track (i.e. width * height).
     */
      minPixels: number
      /**
     * The minimum width of a video track, in pixels.
     */
      minWidth: number
    }
  
    /**
   * Safari-related configuration.
   */
    export type SafariConfiguration = {
    /**
     * By enabling this flag video track info and player stats for HLS will become
     * available on Safari where this info is not provided by default by
     * the native player.
     * 
     * 
     * This flag is experimental and may not work for some special cases, such
     * as playlists containing multiple video renditions for one resolution.
     * 
     * 
     * Enabling this flag may have a slight adverse effect on performance
     * due to potentially additional network requests at the start of playback.
     */
      enableHlsVideoTrackInfo?: boolean
    }
  
    /**
   * Contains basic information about a video segment.
   */
    export type SegmentReference = {
    /**
     * The bitrate in bps if available.
     */
      bandwidth: number|null
      /**
     * The end time in seconds.
     */
      end: number
      /**
     * The height in pixel if available.
     */
      height: number|null
      /**
     * Reference to the video rendition if available.
     */
      rendition: clpp.Rendition|null
      /**
     * The start time in seconds.
     */
      start: number
      /**
     * The width in pixel if available.
     */
      width: number|null
    }
  
    /**
   * Session context is used for passing additional data between license requests
   * and responses in scope of media session. User can store tokens or other
   * necessary data in `customData` field or setup delay in `ldlDelay` field.
   */
    export type SessionContext = {
    /**
     * Custom data. It is permitted to pass some DRM related data by users there.
     */
      customData: Record<string, any>
      /**
     * Delay for manual Limited Duration Licenses (in seconds). Setting this to >0
     * value will schedule internal LDL timer. This should be used primarily when
     * PlayReady is in use, as associated CDM does not trigger `license-renewal`
     * event automatically.
     */
      ldlDelay: number
    }
  
    /**
   * A single playback source
   */
    export type Source = {
    /**
     * Audio mime type. Relevant for HLS while casting.
     */
      audioMimeType?: string
      /**
     * Set to true for DRM protected content.
     */
      drmProtected?: boolean
      /**
     * Set to true for live content.
     */
      isLive?: boolean
      /**
     * A human readable asset name.
     */
      name?: string
      /**
     * The source type.
     */
      type?: clpp.Type|null
      /**
     * The source URL to your Manifest.
     */
      url: string
      /**
     * Video mime type. Relevant for HLS while casting.
     */
      videoMimeType?: string
    }
  
    export type StateChange = {
    /**
     * The number of seconds the player was in this state.  If this is the last
     * entry in the list, the player is still in this state, so the duration will
     * continue to increase.
     */
      duration: number
      /**
     * The state the player entered.  This could be 'buffering', 'playing',
     * 'paused', or 'ended'.
     */
      state: clpp.Player.State
      /**
     * The timestamp the state was entered, in seconds since 1970
     * (i.e. Date.now() / 1000).
     */
      timestamp: number
    }
  
    /**
   * Contains statistics and information about the current state of the player.
   * This is meant for applications that want to log quality-of-experience (QoE)
   * or other stats.  These values will reset when load() is called again.
   */
    export type Stats = {
    /**
     * The total time spent in a buffering state in seconds.
     */
      bufferingTime: number
      /**
     * The total number of corrupted frames dropped by the browser.  This may be
     * `NaN` if this is not supported by the browser.
     */
      corruptedFrames: number
      /**
     * The total number of frames decoded by the Player.  This may be NaN if this
     * is not supported by the browser.
     */
      decodedFrames: number
      /**
     * The total number of frames dropped by the Player.  This may be NaN if this
     * is not supported by the browser.
     */
      droppedFrames: number
      /**
     * The current estimated network bandwidth (in bit/sec).
     */
      estimatedBandwidth: number
      /**
     * The height of the current video track.
     */
      height: number
      /**
     * This is the number of seconds it took for the video element to have enough
     * data to begin playback.  This is measured from the time load() is called to
     * the time the 'loadeddata' event is fired by the media element.
     */
      loadLatency: number
      /**
     * The total time spent in a paused state in seconds.
     */
      pauseTime: number
      /**
     * The total time spent in a playing state in seconds.
     */
      playTime: number
      /**
     * A history of the state changes.
     */
      stateHistory: Array<clpp.StateChange>
      /**
     * The bandwidth required for the current streams (total, in bit/sec).
     */
      streamBandwidth: number
      /**
     * A history of the rendition changes.
     */
      switchHistory: Array<clpp.RenditionChoice>
      /**
     * The width of the current video track.
     */
      width: number
    }
  
    /**
   * The streaming configuration.
   */
    export type StreamingConfiguration = {
    /**
     * Defaults to false.
     * 
     * SCTE35 markers might be incomplete, i.e. unavailable opening
     * or closing tag. Thus, the start time or the end time of the cue
     * might be invalid. If true, player adds missing tags and fixes
     * timestamps. For now, support is limited to native HLS (Safari).
     */
      addMissingTimelineCues: boolean
      /**
     * Defaults to false. 
     * 
     * If true, always stream text tracks, regardless of whether or not they are
     * shown. This is necessary when using the browser's built-in controls, which
     * are not capable of signaling display state changes back to the Player.
     * Defaults to false.
     */
      alwaysStreamText: boolean
      /**
     * Retry parameters for segment requests.
     */
      attemptParameters: clpp.net.AttemptParameters
      /**
     * Defaults to 30. 
     * 
     * The maximum number of seconds of content that the Player will keep
     * in buffer behind the playhead when it appends a new media segment.
     */
      bufferBehind: number
      /**
     * The interval that the player waits before a segment update is scheduled
     * when the current buffer limits are reached
     */
      bufferLimitUpdateInterval?: number
      /**
     * Defaults to 10. 
     * 
     * The number of seconds of content that the Player will attempt to
     * buffer ahead of the playhead. This value must be greater than or equal to
     * the rebuffering goal.
     */
      bufferingGoal: number
      /**
     * Defaults to 10.
     * 
     * Fallback option for live edge chasing. In case player is as far from a live
     * edge as |chaseJumpDistance| (in seconds) indicates, instead of increasing
     * playback rate, player will seek to the live edge.
     * |chaseJumpDistance| must be greater than |startChasingAt|. Set this value
     * to |Infinity| to disable seek to the edge functionality.
     */
      chaseJumpDistance: number
      /**
     * Defaults to 1.15.
     * 
     * Playback rate which will be used for live edge chasing.
     * |chasingRate| cannot be lower than or equal to 1.
     */
      chasingRate: number
      /**
     * Defaults to false.
     * 
     * Disable support for chunked fragment loading. Segments will always be
     * loaded completely and appended as one chunk.
     */
      disableFragmentSupport: boolean
      /**
     * Defaults to false.
     * 
     * Disable support for merging chunks while loading fragments. This will
     * push fragments individually to the source buffer and can decrease the
     * time the decoder needs to get to the first frame
     */
      disableMergedFragments: boolean
      /**
     * Defaults to 1. 
     * 
     * By default, we will not allow seeking to exactly the duration of a
     * presentation.  This field is the number of seconds before duration we will
     * seek to when the user tries to seek to or start playback at the duration.
     * To disable this behavior, the config can be set to 0.  We recommend using
     * the default value unless you have a good reason not to.
     */
      durationBackoff: number
      /**
     * Defaults to false.
     * When set to |true|, live edge chasing algorithm will be enabled.
     */
      enableLiveEdgeChasing: boolean
      /**
     * If this is true, native TS support will be used where possible. Otherwise
     * we will transmux TS content even if not strictly necessary
     * for the assets to be played. The Player currently only supports CEA 708
     * captions by transmuxing, so this value is necessary for enabling them on
     * platforms with native TS support like Edge or Chromecast.
     * This value defaults to false.
     */
      forceNativeTS: boolean
      /**
     * TThe maximum distance (in seconds) before a gap when we'll automatically
     * jump. This value  defaults to `0.1`, except in Edge Legacy,
     * Tizen that value defaults value is `0.5`
     */
      gapDetectionThreshold: number
      /**
     * Defaults to false.
     * 
     * By default the streaming engine tries to account for drift between
     * media times exposed by the manifest and the actual segment media times.
     * This setting can be used to ignore drift or in other words always assume
     * that the manifest times and the segment media times are in alignment
     */
      ignoreDrift: boolean
      /**
     * Defaults to false. 
     * 
     * If true, the Player will ignore text stream failures and continue playing
     * other streams.
     */
      ignoreTextStreamFailures: boolean
      /**
     * Defaults to true. 
     * 
     * If true, jump large gaps in addition to small gaps.  The event will be
     * raised first.  Then, if the app doesn't call preventDefault() on the event,
     * the Player will jump the gap.  If false, then the event will be raised,
     * but the gap will not be jumped.
     */
      jumpLargeGaps: boolean
      /**
     * Defaults to 1 second 
     * 
     * Max offset between segment and media times in seconds. We are detecting
     * deltas between the segment times, i.e. the times for a segment calculated
     * from information from the manifest, and media times, i.e. the actual
     * presentation time when the segment is appended to the buffer. Usually
     * these values are in close alignment or can be adjusted using the
     * presentationTimeOffset in a a DASH manifest. If however the
     * timestampOffset is not set and we detect a delta larger than this value,
     * the player will adjust to that delta automatically.
     */
      maxSegmentToMediaOffset: number
      /**
     * Defaults to false.
     * 
     * If set to true, `hSpacing` and `vSpacing` values from PASP box will be
     * overwritten to 1:1. Currently only Chromium-based browsers respect PASP
     * box, so by overriding it we will have consistent behavior across all
     * browser vendors.
     */
      overridePasp: boolean
      /**
     * Defaults to false.
     * 
     * The Edge Chromium fails to decrypt a protected period
     * if the initial period is clear. Most likely Edge doesn't
     * create a protected rendering pipeline at the beginning.
     * Apply content workarounds to bypass this limitation.
     */
      patchEdgeWhenMixedContent: boolean
      /**
     * Defaults to true.
     * 
     * Desktop Safari has both MediaSource and their native HLS implementation.
     * Depending on the application's needs, it may prefer one over the other.
     * Warning when disabled: Where single-key DRM streams work fine, multi-keys
     * streams is showing unexpected behaviors (stall, audio playing with video
     * freezes, ...). Use with care.
     */
      preferNativeHlsOnSafari: boolean
      /**
     * Defaults to 2. 
     * 
     * The minimum number of seconds of content that the Player must
     * buffer before it can begin playback or can continue playback after it has
     * entered into a buffering state (i.e., after it has depleted one
     * more of its buffers).
     */
      rebufferingGoal: number
      /**
     * Defaults to false. 
     * 
     * If true, the text cues timestamps will be offset by the containing
     * segment start time (to compute the absolute timestamps of the cues, i.e.
     * relative to presentation start.).
     */
      relativeTextTimestamp: boolean
      /**
     * The amount of seconds that should be added when repositioning the playhead
     * after falling out of the availability window or seek. This gives the player
     * more time to buffer before falling outside again, but increases the forward
     * jump in the stream skipping more content. This is helpful for lower
     * bandwidth scenarios. Defaults to 5 if not provided.
     */
      safeSeekOffset: number
      /**
     * Defaults to 0.5. 
     * 
     * The limit (in seconds) for a gap in the media to be considered "small".
     * Small gaps are jumped automatically without events.  Large gaps result
     * in a Player event and can be jumped.
     */
      smallGapLimit: number
      /**
     * When set to |true|, the stall detector logic will run, skipping forward
     * |stallSkip| seconds whenever the playhead stops moving for |stallThreshold|
     * seconds.
     */
      stallEnabled: boolean
      /**
     * The maximum number of seconds that the player will skip forward when a
     * stall has been detected.
     */
      stallSkip: number
      /**
     * The maximum number of seconds that may elapse without the playhead moving
     * (when playback is expected) before it will be labeled as a stall.
     */
      stallThreshold: number
      /**
     * Defaults to false. 
     * 
     * If true, adjust the start time backwards so it is at the start of a
     * segment. This affects both explicit start times and calculated start time
     * for live streams. This can put us further from the live edge. Defaults to
     * false.
     */
      startAtSegmentBoundary: boolean
      /**
     * Defaults to 5.
     * 
     * How far from a live edge player might fall (in seconds). After reaching
     * this value, player will try to catch up to live edge by applying
     * |chasingRate|.
     * |startChasingAt| cannot be lower than or equal to |stopChasingAt|.
     */
      startChasingAt: number
      /**
     * Defaults to 2.
     * 
     * How far from a live edge (in seconds) player should stop applying
     * |chasingRate|.
     * |stopChasingAt| cannot be lower than 0.
     */
      stopChasingAt: number
    }
  
    /**
   * Text style configuration.
   */
    export type TextStyleConfiguration = {
    /**
     * The background color as CSS expression.
     * For example `green` or `rgba(0,0,0,.25)`.
     */
      backgroundColor: string
      /**
     * The edge color as CSS expression.
     * For example `green` or `rgba(0,0,0,.25)`.
     */
      edgeColor: string
      /**
     * The edge type.
     */
      edgeType: clpp.text.EdgeType
      /**
     * The font color as CSS expression.
     * For example `green` or `rgba(0,0,0,.25)`.
     */
      fontColor: string
      /**
     * The font family as CSS expression.
     * For example `sans` or `Arial, Helvetica, sans-serif`.
     */
      fontFamily: string
      /**
     * The font size as CSS expression.
     * If defined, it takes precedence over the `fontSizePercent`.
     * For example `1em`, `100%` or `24px`.
     */
      fontSize: string
      /**
     * The font size percent is relative to the video height.
     * The font size will be adjusted automatically on video size change,
     * for example when entering fullscreen mode.
     * Default value is `0.05`.
     * Please note that the native text displayer
     * doesn't support this option at the moment.
     */
      fontSizePercent: number
      /**
     * The window color as CSS expression.
     * For example `green` or `rgba(0,0,0,.25)`.
     * Please note that the HTML text displayer
     * doesn't support this option at the moment.
     */
      windowColor: string
    }
  
    /**
   * Configures the thumbnails plugin
   */
    export type ThumbnailsConfiguration = {
    /**
     * Duration of each thumbnail image in seconds. Required only for modes
     * `SINGLE` or `GRID`
     */
      duration: number
      /**
     * Boolean flag that, if specified, can be used to disable a plugin.
     * Plugins are enabled by default when they are loaded.
     */
      enabled?: boolean
      /**
     * A string in the format 'ROWSxCOLUMNS' used by the GRID mode.
     * E.g.: 10x10 when every grid image contains 10 rows x 10 columns.
     */
      gridSize: string
      /**
     * The mode which the thumbnails should be loaded.
     * Valid options are `SINGLE`, `GRID`, `WEBVTT` and `BIF`. If omitted, the
     * player will try to guess the correct mode based in the url
     */
      mode: string
      /**
     * Array of steps. For each step, an independent downloader is triggered.
     * The downloader preloads every n-th thumbnail (i.e. step).
     * The thumbnail set is limited to preloaded entries.
     */
      preload: Array<(clpp.PreloadConfiguration|number)>
      /**
     * The key to be replaced in the URL for each image.
     * Used for SINGLE and GRID modes.
     */
      templateKey?: string
      /**
     * The URL where the thumbnail resources are located
     */
      url: string
    }
  
    /**
   * Contains information about a cue in the timeline that will cause an event
   * to be raised when the playhead enters or exits it.  In DASH this is the
   * EventStream element. In HLS this is the EXT-X-DATERANGE tag.
   */
    export type TimelineCue = {
    /**
     * The presentation time (in seconds) that the cue should end.
     */
      endTime: number
      /**
     * The XML element that defines the Event.
     */
      eventElement: Element
      /**
     * Specifies an identifier for this instance of the cue.
     */
      id: string
      /**
     * Identifies the message scheme.
     */
      schemeIdUri: string
      /**
     * The presentation time (in seconds) that the cue should start.
     */
      startTime: number
      /**
     * The type of this timeline cue e.g. SCTE35
     */
      type: clpp.TimelineCueType
      /**
     * Specifies the value for the cue.
     */
      value: string
    }
  
    /**
   * Conviva plugin configuration.
   */
    export type TizenConfiguration = {
    /**
     * Defaults to false. 
     * 
     * If set to true the SDK will stream text along side the native player.
     * This can enable subtitles for use cases that are not supported by the
     * Native player e.g. Embedded subtitles with MPEG-DASH.
     */
      sideStreamText: boolean
    }
  
    /**
   * Track Accessibility describes the accessibility features provided
   * by a track.
   * In general accessibility features are features designed to help
   * bring the media to a larger audience, such as the vision-impaired
   * or hearing-impaired.
   */
    export type TrackAccessibility = {
    /**
     * ID of the accessibility feature, this may be defined only in DASH.
     */
      id?: string
      /**
     * The streaming protocol. Its values can be either "DASH" or "HLS".
     */
      protocol: string
      /**
     * Scheme of the accessibility feature, this may be defined only in DASH
     * and it corresponds to the `Accessibility@schemeIdUri` attribute.
     */
      scheme?: string
      /**
     * The type of the stream. Its values can be "video", "text" or "audio".
     */
      type: string
      /**
     * For HLS this corresponds to MCT Media Characteristic Tags
     * (e.g. "public.easy-to-read"), for DASH this corresponds to
     * `Accessibility@value` (e.g. "caption"). Defaults to an empty string.
     */
      value: string
    }
  
    /**
   * TTML component configuration.
   */
    export type TtmlConfiguration = {
    /**
     * The height of the root container in pixels, used to convert absolute values
     * in to relative ones. Default value is 480 pixels if a root container
     * is not defined in a TTML manifest.
     */
      containerHeight: number|null
      /**
     * The width of the root container in pixels, used to convert absolute values
     * in to relative ones. Default value is 720 pixels if a root container
     * is not defined in a TTML manifest.
     */
      containerWidth: number|null
      /**
     * The font size radix is used for pixels to EM conversion.
     * Cues have a responsive font size after conversion.
     * Next, the text displayer adjusts the parent font size based
     * on the video size. Adjust this parameter when a TTML manifest defines
     * a font size using pixels and the `ttp:cellResolution` parameter
     * is not defined. Default value is 16 pixels.
     */
      fontSizeRadix: number|null
    }
  
    /**
   * The Verimatrix VCAS Ultra configuration.
   */
    export type VerimatrixVcasConfiguration = {
    /**
     * Optional third-party authentication to the Subscriber Management System
     * (SMS).
     */
      authenticator?: string
      /**
     * The device's Verimatrix unique identifier (VUID)
     */
      deviceId: string
      /**
     * FairPlay assetId acquisition strategy.
     * Default: {@link clpp.verimatrix.Vcas.FairPlayAssetIdStrategy.KEYID}
     */
      fairPlayAssetIdStrategy?: clpp.verimatrix.Vcas.FairPlayAssetIdStrategy
      /**
     * The Fairplay certificate URL.
     */
      fairPlayCertificateUrl: string
      /**
     * The Fairplay license server URL.
     */
      fairPlayLicenseUrl: string
      /**
     * The unique identifier of the site to which the subscriber is associated.
     * Used only in conjunction with fairPlayAssetIdStrategy set to
     * `CONTENTID_SITEID`.
     */
      fairPlaySiteId?: string
      /**
     * Defines custom HTTP header names for passing `deviceId`
     * and `authenticator` to the license server. It's used when
     * `licenseRequestVuidLocation` is set to `HTTP_HEADER` otherwise ignored.
     * Default:
     * `     {        LicenseRequestHttpHeader.DEVICE_ID: 'DeviceId',        LicenseRequestHttpHeader.AUTHENTICATOR_HEADER: 'Authenticator'      }     `
     */
      httpHeaderNames?: Record<clpp.verimatrix.Vcas.LicenseRequestHttpHeader, string>
      /**
     * Method for passing `deviceId` and `authenticator` (if defined) to the
     * license server. They could be inserted into one of two potential locations
     * in the license acquisition request:
     * - `QUERY_STRING` - Base64 encoded query string parameters.
     * - `HTTP_HEADER` - custom HTTP request headers. If you use this method,
     * please configure header names accepted by your license server in
     * `httpHeaderNames`
     * Default: `QUERY_STRING`
     */
      licenseRequestVuidLocation?: clpp.verimatrix.Vcas.LicenseRequestVuidLocation
      /**
     * The Playready license server URL.
     */
      playReadyLicenseUrl: string
      /**
     * The Widevine license server URL.
     */
      widevineLicenseUrl: string
    }
  
    /**
   * Configuration section for Vimond analytics.
   * For more information please visit the
   * {@link https://vimond-experience-api.readme.io/docs/player-session-api|Vimond Player Session API}.
   */
    export type VimondConfiguration = {
    /**
     * The authentication token acquired from the Vimond Token Service.
     */
      authToken: string
      /**
     * Optional. Stop playback if can't connect to Vimond Player Session.
     * For example request timeout or request blocked by an ad block.
     * Default is true.
     */
      failIfUnreachable: boolean
      /**
     * Optional. Stop playback if Vimond Player Session returns 400/401/403/5xx.
     * Default is true.
     */
      failOnError: boolean
      /**
     * The response acquired from the Vimond Play Service.
     */
      playerEventRequest: clpp.VimondPlayerEventRequest
    }
  
    /**
   * Event template.
   */
    export type VimondPlayerEventBody = {
    /**
     * Client info.
     */
      client: clpp.VimondPlayerEventClient
      /**
     * Originator.
     * Filled by the integrator.
     */
      originator: string
      /**
     * Stream info.
     */
      progress: clpp.VimondPlayerEventProgress
      /**
     * Date when the play event is sent following the ISO 8601 Extended Format.
     * Filled by the plugin.
     */
      timestamp: string
    }
  
    export type VimondPlayerEventClient = {
    /**
     * Player's name.
     * Filled by the plugin.
     */
      buildName: string
      /**
     * Player's version.
     * Filled by the plugin.
     */
      buildVersion: string
      /**
     * End-user's device id.
     * Filled by the integrator.
     */
      deviceId: string
      /**
     * Data right management type.
     * Empty if unprotected content.
     * Filled by the plugin.
     */
      drm: string
      /**
     * Underling technology. For example 'silverlight'.
     * Filled by the integrator.
     */
      envPlatform: string
      /**
     * Version of the underling technology
     * Filled by the integrator.
     */
      envVersion: string
      /**
     * Page url on which the client played this asset.
     * Filled by the plugin.
     */
      pageUrl: string
      /**
     * Event which occurred during a playback session.
     * Filled by the plugin.
     */
      playerEvent: string
      /**
     * Values for this field are "playing", "pause" and null.
     * Filled by the plugin. Null if ended.
     */
      playerState: string|null
      /**
     * Stream url played by the client.
     * Filled by the plugin.
     */
      streamUrl: string
      /**
     * User agent of the browser.
     * Filled by the plugin.
     */
      userAgent: string
      /**
     * Mime type of the stream played by the client.
     * Filled by the plugin.
     */
      videoFormat: string
      /**
     * Network protocol of the stream.
     * Filled by the plugin.
     */
      videoProtocol: string
      /**
     * End-user's viewing session.
     * Filled by the integrator.
     */
      viewingSession: string
    }
  
    export type VimondPlayerEventLive = {
    /**
     * True if live resume possible. False otherwise.
     * Filled by the plugin if not defined. Default is True.
     */
      liveResumePossible: boolean
      /**
     * True if close to the live edge. False otherwise.
     * Filled by the plugin.
     */
      onLiveEdge: boolean
      /**
     * Current position of the stream following the ISO 8601 Extended Format.
     * Filled by the plugin.
     */
      position: string
    }
  
    export type VimondPlayerEventProgress = {
    /**
     * Event number used for synchronization purposes.
     * Filled by the plugin.
     */
      eventNumber: number
      /**
     * Live info.
     */
      live: clpp.VimondPlayerEventLive
      /**
     * Vod info.
     */
      vod: clpp.VimondPlayerEventVod
    }
  
    export type VimondPlayerEventRequest = {
    /**
     * Event template.
     */
      body: clpp.VimondPlayerEventBody
      /**
     * The first event is triggered on play.
     * The second event is triggered after 10 seconds.
     * Next, an event is triggered after X seconds from the last one.
     * Where X is the value of the `eventInterval`.
     */
      eventInterval: number
      /**
     * URL of the Vimond Player Session endpoint.
     */
      uri: string
    }
  
    export type VimondPlayerEventVod = {
    /**
     * Current position of the stream.
     * Filled by the plugin.
     */
      position: number
    }
  
    /**
   * VR plugin configuration.
   */
    export type VrConfiguration = {
    /**
     * Attach mouse listeners to the VR canvas to change the camera position.
     */
      attachMouseListener?: boolean
      /**
     * Enable VR plugin and 360 playback mode.
     */
      enable?: boolean
      /**
     * Set the default field of view of the camera.
     */
      fieldOfView?: number
      /**
     * Invert the mouse/touch movement for horizontal axis.
     */
      invertHorizontalControl?: boolean
      /**
     * Invert the mouse/touch movement for vertical axis.
     */
      invertVerticalControl?: boolean
      /**
     * Set the mouse/touch controls sensitivity. Must be a positive number.
     */
      sensitivity?: number
    }
  
    /**
   * The main property is the `licenseUrl` to the DRM backend, but you would
   * usually also implement at least some of the network modifier. This can be
   * used for example to add some headers to the license request, or to access
   * and even modify the responses.
   */
    export type WidevineDrmSystem = {
    /**
     * The EME audio robustness level. Please note that
     * you do not need to specify this usually and the player will find
     * an appropriate value based on the current platform and browser.
     */
      audioRobustness: clpp.drm.WidevineRobustnessLevel|Array<null|clpp.drm.WidevineRobustnessLevel>
      /**
     * Defaults to false. 
     * 
     * Set this to `true` if the application requires the key system to support
     * distinctive identifiers.
     */
      distinctiveIdentifierRequired: boolean
      /**
     * The server that handles an 'individualization-request'. If the server
     * isn't given, it will default to the license server.
     */
      individualizationServer: string
      /**
     * The URL to the license server
     */
      licenseUrl: string
      /**
     * A set of callbacks to perform modifications on license/certificate requests
     * and/or responses.
     */
      modifiers?: clpp.drm.LicenseModifiers
      /**
     * Defaults to false. 
     * 
     * Set this to `true` if the application requires the key system to support
     * persistent state, e.g., for persistent license storage.
     */
      persistentStateRequired: boolean
      /**
     * Defaults to null. 
     * 
     * The certificate will be requested from the license server if required. A
     * key-system-specific server certificate used to encrypt license requests.
     * Its use is optional and is meant as an optimization to avoid a round-trip
     * to request a certificate. Please note that the player already caches the
     * certificate to avoid the round-trip on the second request and there is
     * usually no need to explicitly specify the certificate here.
     */
      serverCertificate: Uint8Array|null
      /**
     * The EME video robustness level. Please note that
     * you do not need to specify this usually and the player will find
     * an appropriate value based on the current platform and browser.
     */
      videoRobustness: clpp.drm.WidevineRobustnessLevel|Array<null|clpp.drm.WidevineRobustnessLevel>
    }
  
    /**
   * Configuration section for Youbora analytics. In addition to the listed
   * options, all options defined by Nice People At Work are available and will be
   * passed over to Youboralib. Minimum configuration must include at least
   * `accountCode`. Please remember to include Youbora SDK in order to use Youbora
   * analytics. For more information please visit the
   * {@link https://documentation.npaw.com/integration-docs/docs/setting-options-and-metadata|NPAW Developer Site}.
   */
    export type YouboraConfiguration = {
    /**
     * A custom function that converts a {@link clpp.Error} to a payload for
     * Youbora. If it returns `null`, the error will not be sent.
     */
      errorFilter?: clpp.YouboraErrorFilter
    }
  
    /**
   * A function that converts a {@link clpp.Error} to a payload for Youbora
   * analytics service {@link clpp.YouboraErrorPayload}. If it returns `null`,
   * the error will not be sent.
   */
    export type YouboraErrorFilter = Function
  
    /**
   * A payload to be sent to Youbora Analytics service in order to report
   * an error that occurred during playback.
   */
    export type YouboraErrorPayload = {
    /**
     * The error code as string
     */
      code: string
      /**
     * The error message
     */
      message: string
      /**
     * Additional metadata further describing the error
     */
      metadata?: Object
      /**
     * The error severity
     */
      severity: clpp.Error.Severity
    }
  
    /**
   * Timeline cue types.
   */
    export enum TimelineCueType {
    /**
     * Identifies SCTE35 markers
     */
      SCTE35 = 'scte35',
      /**
     * Identifies an MPEG-DASH callback event
     */
      DASH_CALLBACK = 'mpeg-dash-callback-event',
      /**
     * Unknown or unsupported timeline cue type.
     */
      UNKNOWN = 'unknown',
    }
  
    /**
   * Stream types that can be used to specify content mime types
   * explicitly.
   */
    export enum Type {
    /**
     * This type identifies DASH content.
     */
      DASH = 'application/dash+xml',
      /**
     * Identifies HLS content and m3u8 playlists
     */
      HLS = 'application/x-mpegurl',
      /**
     * Identifies SmoothStreaming content
     */
      SMOOTH_STREAMING = 'application/vnd.ms-sstr+xml',
      /**
     * Identifies mp4 files
     */
      MP4 = 'video/mp4',
    }
  
    /**
   * Player event names.
   */
    export enum events {
    /**
     * Triggered on error events.
     * The detail will contains the {@link clpp.Error} that
     * exposes the reason for the buffering start.
     */
      ERROR = 'error',
      /**
     * Triggered when video meta data are loaded
     */
      LOADEDMETADATA = 'loadedmetadata',
      /**
     * Triggered when player ends buffering.
     * The detail will contains the
     * {@link clpp.events.BufferingDetails|BufferingDetails} that exposes the
     * reason for the buffering start.
     */
      BUFFERING_ENDED = 'bufferingended',
      /**
     * Triggered when player starts buffering.
     * The detail will contains the
     * {@link clpp.events.BufferingDetails|BufferingDetails} that exposes the
     * reason for the buffering start.
     */
      BUFFERING_STARTED = 'bufferingstarted',
      /**
     * Triggered when player changes the state.
     * The event provides {@link clpp.events.StateChangeDetails} in the
     * `detail` property.
     */
      STATE_CHANGED = 'statechanged',
      /**
     * Triggered when player or user changes the currently selected audio track.
     */
      AUDIO_TRACK_CHANGED = 'audiotrackchanged',
      /**
     * Triggered when player or user changes the currently selected text track.
     */
      TEXT_TRACK_CHANGED = 'texttrackchanged',
      /**
     * Triggered when the selected video rendition is changed. Note that
     * this is not necessarily triggered when the currently playing video track
     * is changed. It is triggered when a video track is selected to be downloaded
     * and appended to the buffer either manually or via the ABR algorithm. If you
     * are interested in the currently playing rendition, the one that is on screen,
     * listen to the {@link clpp.events#CLPP_BITRATE_CHANGED|CLPP_BITRATE_CHANGED}
     * event instead.
     */
      VIDEO_TRACK_CHANGED = 'videotrackchanged',
      /**
     * Triggered when the currently playing video rendition changes.
     */
      BITRATE_CHANGED = 'bitratechanged',
      /**
     * Triggered when player adds new tracks
     */
      TRACKS_ADDED = 'tracksadded',
      /**
     * Triggered when the players load method is called and the
     * player started to loaded the sources
     */
      LOAD_START = 'loadstart',
      /**
     * Triggered when the player and its components are about to be released
     */
      RELEASING = 'releasing',
      /**
     * Triggered when the player and its components are about to be released
     */
      RELEASED = 'released',
      /**
     * Triggered when the player and its components are about to be destroyed
     */
      DESTROYING = 'destroying',
      /**
     * Triggered when the player and its components are about to be destroyed
     */
      DESTROYED = 'destroyed',
      /**
     * Triggered when a video segment is appended or removed
     */
      VIDEO_BUFFER_CHANGED = 'videobufferchanged',
      /**
     * Triggered when an audio segment is appended or removed
     */
      AUDIO_BUFFER_CHANGED = 'audiobufferchanged',
      /**
     * Triggered when a video or audio segment was downloaded successfully
     * and considered by the players bandwidth estimation.
     */
      DOWNLOAD_TRACE = 'downloadtrace',
      /**
     * Triggered when the players DRM session is updated.
     */
      DRM_SESSION_UPDATE = 'drmsessionupdate',
      /**
     * Triggered when the DRM session for the load content has been
     * successfully persisted.
     */
      DRM_SESSION_PERSISTED = 'drmsessionpersisted',
      /**
     * Triggered when the DRM session sends a license renewal request
     */
      DRM_RENEWAL_STARTED = 'drmrenewalstarted',
      /**
     * Triggered when the DRM license expiration time is updated.
     */
      DRM_EXPIRATION_UPDATE = 'drmexpirationupdate',
      /**
     * Triggered when an attempt to autoplay the media was block by the platform.
     */
      AUTOPLAY_NOT_ALLOWED = 'autoplaynotallowed',
      /**
     * Triggered on play request, as a result of the play() method, or the
     * autoplay config.
     */
      PLAY = 'play',
      /**
     * Triggered when a seek operation begins. This event is passed directly from
     * video element.
     */
      SEEKING = 'seeking',
      /**
     * Triggered when a seek operation completes. This event is passed directly from
     * video element.
     */
      SEEKED = 'seeked',
      /**
     * Triggered when a seek operation begins is performed by an user.
     */
      USER_SEEKING = 'user-seeking',
      /**
     * Triggered when a seek operation completes is performed by an user.
     */
      USER_SEEKED = 'user-seeked',
      /**
     * Triggered when ad cue points were updated.
     */
      ADS_TIMELINE_CHANGED = 'ads-timeline-changed',
      /**
     * Triggered when ad metadata were loaded.
     */
      AD_LOADED = 'ad-loaded',
      /**
     * Triggered when an ad pod started.
     */
      AD_BREAK_STARTED = 'ad-break-started',
      /**
     * Triggered when an ad started.
     */
      AD_STARTED = 'ad-started',
      /**
     * Triggered when an ad has stalled playback to buffer.
     */
      AD_BUFFERING = 'ad-buffering',
      /**
     * Triggered when the ad's current time value changes.
     */
      AD_PROGRESS = 'ad-progress',
      /**
     * Triggered when the first quartile was successfully played out.
     */
      AD_FIRST_QUARTILE = 'ad-first-quartile',
      /**
     * Triggered when the second quartile was successfully played out.
     */
      AD_MIDPOINT = 'ad-midpoint',
      /**
     * Triggered when the third quartile was successfully played out.
     */
      AD_THIRD_QUARTILE = 'ad-third-quartile',
      /**
     * Triggered when an ad was paused.
     */
      AD_PAUSED = 'ad-paused',
      /**
     * Triggered when an ad was resumed.
     */
      AD_RESUMED = 'ad-resumed',
      /**
     * Triggered when an ad was skipped.
     */
      AD_SKIPPED = 'ad-skipped',
      /**
     * Triggered when an ad was clicked.
     */
      AD_CLICKED = 'ad-clicked',
      /**
     * Triggered when the impression URL has been pinged.
     */
      AD_IMPRESSION = 'ad-impression',
      /**
     * Triggered when an ad was played to the end.
     * Not triggered if an ad was skipped or an error occurred.
     */
      AD_COMPLETED = 'ad-completed',
      /**
     * Triggered when an ad ended.
     */
      AD_STOPPED = 'ad-stopped',
      /**
     * Triggered when an ad pod ended.
     */
      AD_BREAK_STOPPED = 'ad-break-stopped',
      /**
     * Triggered when casting started.
     */
      CASTING_STARTED = 'castingstarted',
      /**
     * Triggered when casting ended.
     */
      CASTING_ENDED = 'castingended',
      /**
     * Triggered when status of cast receiver changed.
     */
      CAST_STATUS_CHANGED = 'caststatuschanged',
      /**
     * Triggered when status of AirPlay availability changed.
     */
      AIRPLAY_STATUS_CHANGED = 'airplay-status-changed',
      /**
     * Triggered when a media element starts AirPlay playback.
     */
      AIRPLAY_CASTING_STARTED = 'airplay-casting-started',
      /**
     * Triggered when a media element stops AirPlay playback.
     */
      AIRPLAY_CASTING_ENDED = 'airplay-casting-ended',
      /**
     * Triggered a new cue have been added to the timeline
     */
      TIMELINE_CUE_ADDED = 'timeline-cue-added',
      /**
     * Triggered when a timeline cue is entered.
     */
      TIMELINE_CUE_ENTER = 'timeline-cue-enter',
      /**
     * Triggered when a timeline cue is exited.
     */
      TIMELINE_CUE_EXIT = 'timeline-cue-exit',
      /**
     * Triggered when a MPD type has changed from dynamic to static.
     */
      MPD_TYPE_CHANGED = 'mpd-type-changed',
      /**
     * Triggered when there is a response from Vimond Session API.
     */
      VIMOND_RESPONSE = 'vimond-response',
      /**
     * Triggered when the current playlist item has been changed.
     */
      PLAYLIST_ITEM_CHANGED = 'playlist-item-changed',
      /**
     * Triggered when a playlist item has been added, removed or moved.
     */
      PLAYLIST_MODIFIED = 'playlist-modified',
      /**
     * Triggered when CDN switch was successful.
     */
      CDN_SWITCH_SUCCESS = 'cdn-switch-success',
      /**
     * Online status changed.
     */
      ONLINE_STATUS_CHANGED = 'online-status-changed',
    }
  
    /**
   * Create a new instance.
   */
    export class BufferInfo {
    /**
     * Create a new instance.
     *
     * @param opt_delegate Optional delegate. If specified ranges
     *   from the delegate will be returned
     * @param opt_type Optional type. One of 'total', 'video,' 'audio',
     *   'text'.
     */
      constructor(opt_delegate?: TimeRanges, opt_type?: string)
      /**
     * Gets the last timestamp in buffer.
     */
      bufferEnd(): number|null
      /**
     * Gets the first timestamp in buffer.
     */
      bufferStart(): number|null
      /**
     * Computes how far ahead of the given timestamp is buffered. By default this
     * does not include gaps, hence only the amount of real buffered data is
     * returned.
     *
     * @param time 
     * @param opt_includeGaps If true, gaps will be included in
     *   the calculation.
     */
      bufferedAheadOf(time: number, opt_includeGaps?: boolean): number
      /**
     * Returns the time offset at which a specified time range ends.
     *
     * @param index The range number to return the ending time for.
     */
      end(index: number): number
      /**
     * Determines if the given time is inside a buffered range.
     * The default behavior includes gaps, meaning if the playhead is in a
     * gap, it is considered buffered.
     *
     * @param time The time
     * @param opt_includeGaps If false, gaps will not be
     *   included, meaning if the time is in a gap it will be considered
     *   un-buffered. The default is to consider gaps as buffered.
     * @param opt_smallGapLimit If there is a small gap between the
     *   position and the buffer start, consider it as buffered
     */
      isBuffered(time: number, opt_includeGaps?: boolean, opt_smallGapLimit?: number): boolean
      /**
     * Returns the time offset at which a specified time range begins.
     *
     * @param index The range number to return the starting time for.
     */
      start(index: number): number
    }
  
    /**
   * Create a new Error
   */
    export class Error extends window.Error {
    /**
     * Create a new Error
     *
     * @param severity The severity
     * @param category The error category
     * @param code The error code
     * @param opt_data Optional data. If this is a string, it
     *   will become part of the error message. The opt_data can contain a
     *   'message' property, which will be used as the error message
     * @param opt_error Optional cause. This will be available as the cause
     *   for this error.
     */
      constructor(severity: clpp.Error.Severity, category: clpp.Error.Category, code: clpp.Error.Code, opt_data?: Object|string, opt_error?: any)
      /**
     * The error category
     */
      category: clpp.Error.Category
      /**
     * Optional cause. If known, this refers to the original error that caused
     * this error to be thrown.
     */
      cause: any|null
      /**
     * The error code
     */
      code: clpp.Error.Code
      /**
     * Optional data that was provided when the error was raised. This might be
     * an empty object if no addition data was provided. Otherwise the data
     * provided here is specific to the error.
     */
      data: Object
      /**
     * The error severity
     */
      severity: clpp.Error.Severity
    }
  
    /**
   * Initialize the player and return a new instance if initialization was
   * successful. You may pass a {@link clpp.PlayerConfiguration}
   * object to configure the player. This defines the global player
   * configuration that contains the castlabs license and all configuration
   * properties that will be applied to all playback sessions.
   */
    export class Player {
    /**
     * Initialize the player and return a new instance if initialization was
     * successful. You may pass a {@link clpp.PlayerConfiguration}
     * object to configure the player. This defines the global player
     * configuration that contains the castlabs license and all configuration
     * properties that will be applied to all playback sessions.
     *
     * @param element The media element or the ID of the
     *   media element
     * @param opt_configuration The global
     *   player configuration
     * @param opt_viewConfiguration The global player view configuration.
     */
      constructor(element: HTMLMediaElement|string, opt_configuration?: clpp.PlayerConfiguration, opt_viewConfiguration?: clpp.PlayerSurfaceConfiguration)
      /**
     * Adds an event listener for the given event.
     * Optionally, scope can be passed in, in which case the callback function
     * will be bound/executed in the given scope.
     * This method returns a reference to the callback for
     * convenient removal of the listener.
     *
     * @param type The event name
     * @param listener The callback function
     *
     * @example // Add and remove a listener
     *
     *   const callback = () => {};
     *   target.addEventListener('event', callback);
     *   // ...
     *   target.removeEventListener('event', callback);
     */
      addEventListener(type: string, listener: clpp.EventCallback): void
      /**
     * Destroy this player instance.
     * The instance will not be usable after it was destroyed.
     */
      destroy(): Promise<void>
      /**
     * Returns the ads manager or null if not available.
     * The ads manager is available when {@clpp.Player.load} is resolved.
     */
      getAdsManager(): clpp.ads.IAdsManager
      /**
     * Returns an instance of {@link clpp.BufferInfo} which is an extended version
     * of the native {@link TimeRanges} from the browser and adds some utility
     * functions that you can use to query for instance how much data is buffered
     * ahead of the playback position.
     *
     * @param opt_type Optional track type. If
     *   provided and supported by the current player backend, this returns the
     *   buffer info for the given track type. If this is not supported by the
     *   current player, the total time range will be returned instead. The
     *   results {@link clpp.BufferInfo#type} property can be checked to see what
     *   ranges were returned
     */
      getBufferInfo(opt_type?: clpp.Track.Type|string): clpp.BufferInfo
      /**
     * Returns the player configuration.
     */
      getConfiguration(): clpp.PlayerConfiguration
      /**
     * Returns DRM info for the currently loaded source.
     */
      getDrmInfo(): clpp.DrmInfo|null
      /**
     * Returns the duration in seconds.
     */
      getDuration(): number
      /**
     * Returns source loaded by player.
     */
      getLoadedSource(): clpp.Source|null
      /**
     * Get the network engine instance.
     */
      getNetworkEngine(): clpp.net.NetworkEngine
      /**
     * Get speed of the playback, where 1 means "normal" speed.
     */
      getPlaybackRate(): number
      /**
     * Access registered player plugins.
     *
     * @param id The plugin ID
     */
      getPlugin(id: string): clpp.PlayerPlugin|null
      /**
     * Returns current position in seconds.
     */
      getPosition(): number
      /**
     * Returns the presentation start time in UNIX Epoch time (seconds elapsed
     * since the Unix epoch) or `null` if the stream is not live or the
     * presentation start time is not available.
     * This value should be consistent with the live DASH stream's
     * `MPD@availabilityStartTime`, or in the case of HLS, values calculated if
     * the {@link https://datatracker.ietf.org/doc/html/rfc8216#section-4.3.2.6 | EXT-X-PROGRAM-DATE-TIME}
     * tag is present in the playlist.
     * Note: Unix time is a date and time representation. It measures time by
     * the number of seconds that have elapsed since 00:00:00 UTC on 1 January
     * 1970, the Unix epoch, without adjustments made due to leap seconds. More
     * information can be found on {@link https://en.wikipedia.org/wiki/Unix_time | Unix time - Wikipedia}.
     */
      getPresentationStartTime(): number|null
      /**
     * Gets the time range (in seconds) where it is allowed to seek.
     * If the player has not loaded content, this will return a range from 0 to 0.
     */
      getSeekRange(): Object
      /**
     * Current sources.
     */
      getSources(): Array<clpp.Source>|null
      /**
     * Gets player/playback state.
     */
      getState(): clpp.Player.State
      /**
     * Returns statistics and information about the current state of the player.
     */
      getStats(): clpp.Stats|null
      /**
     * Returns the player surface.
     */
      getSurface(): clpp.IPlayerSurface|null
      /**
     * Get the text displayer.
     */
      getTextDisplayer(): clpp.ITextDisplayer
      /**
     * Returns an array of timeline cues.
     */
      getTimelineCues(): Array<clpp.TimelineCue>
      /**
     * Returns track manager.
     */
      getTrackManager(): clpp.TrackManager|null
      /**
     * On the Tizen platform the `http://tizen.org/privilege/tv.audio` privilege
     * is required.
     */
      getVolume(): number|null
      /**
     * Returns true if playback ended. False otherwise.
     */
      isEnded(): boolean
      /**
     * Returns true for live presentations. False for VOD.
     */
      isLive(): boolean
      /**
     * On the Tizen platform the `http://tizen.org/privilege/tv.audio` privilege
     * is required.
     */
      isMuted(): boolean|null
      /**
     * Returns true if playback is paused. False otherwise.
     */
      isPaused(): boolean
      /**
     * Tell the player to load given content.
     * 
     * You may load content by passing a `string`, a {@link clpp.Source}, an array
     * of sources or player configuration. If multiple sources are passed to a
     * `load` method, player will play first source, that can be played on given
     * platform. Please refer to examples below for more details.
     * 
     * If the player already playing another source, it will release itself first
     * before loading the new source.
     *
     * @example // Passing a string
     *
     * player.load('http://example.com/manifest.mpd');
     *
     * @example // Passing a clpp.Source object
     *
     * player.load({
     *   url: 'http://example.com/manifest.mpd',
     *   type: clpp.Type.DASH
     * });
     *
     * @example // Passing an array
     *
     * player.load([
     *   // By passing an array, player will load first content that it is able
     *   // to load on given platform (i.e. we cannot load protected DASH on
     *   // Safari). You can mix strings and clpp.Source objects here.
     *   {
     *     url: 'http://example.com/manifest.mpd',
     *     type: clpp.Type.DASH,
     *     drmProtected: true
     *   },
     *   {
     *     url: 'http://example.com/manifest.m3u8',
     *     type: clpp.Type.HLS,
     *     drmProtected: true
     *   },
     *   'http://example.com/other.mp4'
     * ]);
     *
     * @example // Passing configuration
     *
     * player.load({
     *   // under source prop you may pass your manifest URL in all possible ways
     *   // as before: string, clpp.Source object or array of strings /
     *   // clpp.Source objects.
     *   source: 'http://example.com/manifest.mpd',
     * 
     *   // Other configuration options. Passing them allows to extend/modify
     *   // initial configuration passed during player's initialization.
     *   startTime: 4,
     *   preferredTextLanguage: 'en'
     * });
     */
      load(configuration: string|clpp.Source|Array<(string|clpp.Source)>|clpp.PlayerConfiguration): Promise<void>
      /**
     * Returns player ID.
     */
      namespace(): string
      /**
     * Removes an event listener.
     *
     * @param name The event name
     * @param callback The callback function
     *
     * @example // Remove a listener
     *
     *   const listener = player.on(clpp.events.STATE_CHANGED, () => {});
     *   ...
     *   player.off(clpp.events.STATE_CHANGED, listener);
     */
      off(name: string, callback: clpp.EventCallback): boolean
      /**
     * Adds an event listener for the given event.
     * Optionally, scope can be passed in, in which case the callback function
     * will be bound/executed in the given scope.
     * This method returns a reference to the callback for
     * convenient removal of the listener via {@link clpp.Player.off}.
     *
     * @param name The event name
     * @param callback The callback function
     * @param opt_callbackScope The callback scope
     *
     * @example // Listen to state change (PRESTOPlay player event)
     *
     *   const listener = player.on(clpp.events.STATE_CHANGED, event => {
     *     const state = event.detail.currentState;
     *     const previousState = event.detail.previousState;
     *     // ...
     *   });
     *   // ...
     *   player.off(clpp.events.STATE_CHANGED, listener);
     *
     * @example // Listen to timeupdate (HTML5 media event)
     *
     *   const listener = player.on('timeupdate', () => {
     *      // ...
     *   });
     *   // ...
     *   player.off('timeupdate', listener);
     */
      on(name: string, callback: clpp.EventCallback, opt_callbackScope?: Object): clpp.EventCallback
      /**
     * Adds a one time event listener for the given event.
     * The listener will be removed once the event was triggered.
     * Otherwise at works the same as {@link clpp.Player.on}.
     *
     * @param name The event name
     * @param callback The callback function
     * @param opt_callbackScope The callback scope
     *
     * @example // Listen to fist timeupdate (HTML5 media event)
     *
     *   const listener = player.one('timeupdate', () => {
     *      // first timeupdate
     *   });
     */
      one(name: string, callback: clpp.EventCallback, opt_callbackScope?: Object): clpp.EventCallback
      /**
     * Pauses playback.
     */
      pause(): Promise<void>
      /**
     * Starts playback.
     * A promise is returned that resolves if starting playback was successful.
     * The promise might be rejected if playback could not be started. This could
     * be because the browsers auto-play configuration prevents playback start
     * without a user interaction or because no source was loaded.
     */
      play(): Promise<void>
      /**
     * Registers a player plugin factory.
     *
     * @param factory The player plugin factory
     */
      static registerPlugin(factory: clpp.PlayerPluginFactory): void
      /**
     * Release the player instance resources.
     * The player can load another source after it was released.
     */
      release(): Promise<void>
      /**
     * Removes a specified component from the player.
     * Please note that this operation will only run if the player has been
     * released or is in IDLE state.
     *
     * @param component Component constructor
     *
     * @example 
     *
     * let player = new clpp.Player(...);
     * player.use(clpp.smooth.SmoothComponent);
     * player.load('https://example.com/smooth/Manifest');
     * ...
     * player.release().then(function () {
     *   player.remove(clpp.smooth.SmoothComponent);
     *   player.use(clpp.dash.DashComponent);
     *   player.load('https://example/dash/manifest.mpd');
     * });
     */
      remove(component: Function): boolean
      /**
     * Remove an event listener.
     *
     * @param type The event name
     * @param listener The callback function
     */
      removeEventListener(type: string, listener: clpp.EventCallback): void
      /**
     * Resets the ABR history and switches again to automatic bandwidth/quality.
     */
      resetAbr(): void
      /**
     * Seeks to a position in seconds.
     *
     * @param time The time in seconds to seek to
     */
      seek(time: number): Promise<void>
      /**
     * Sets the CDN error callback.
     * The callback is triggered when network error occurs during trying to
     * download a segment or manifest. If player cannot download a segment or a
     * manifest several times (according to attempt parameters specified in
     * configuration) this callback can be used to provide an alternative manifest
     * to silently switch to it.
     * CDN error callback currently works for MSE playback, thus cannot be used
     * for HLS on Safari.
     *
     * @example // Example
     *
     * player.setCdnErrorCallback(async (manifest, error) => {
     *   if (error.code === clpp.Error.Code.TIMEOUT) {
     *     // Custom business logic.
     *     const newUrl = await findAnAlternative(manifest);
     *     return newUrl;
     *   }
     * });
     */
      setCdnErrorCallback(callback: Function|null): void
      /**
     * Sets the DRM custom data modifier.
     * The callback is trigger
     * when connecting to an AirPlay device and
     * when disconnecting from it.
     * This is especially useful when you want to generate
     * a new auth token for the upcoming license acquisition.
     * The AirPlay plugin has be enabled in order
     * to track AirPlay status.
     *
     * @param modifier The callback which can adjust DRM custom data
     *   before the upcoming license acquisition.
     *
     * @example // New auth token
     *
     * player.setDrmCustomDataModifier(async customData => {
     *   customData.authToken = await generateNewAuthToken ();
     * });
     */
      setDrmCustomDataModifier(modifier: Function): void
      /**
     * On the Tizen platform the `http://tizen.org/privilege/tv.audio` privilege
     * is required.
     *
     * @param muted The muted state
     */
      setMuted(muted: boolean): void
      /**
     * Set the network engine.
     *
     * @param engine The network engine
     */
      setNetworkEngine(engine: clpp.net.NetworkEngine): void
      /**
     * Set speed of the playback, where 1 means "normal" speed.
     *
     * @param rate The rate
     *
     * @example // Play at double speed.
     *
     *   player.setPlaybackRate(2);
     *
     * @example // Play at half speed.
     *
     *   player.setPlaybackRate(0.5);
     *
     * @example // Play at normal speed.
     *
     *   player.setPlaybackRate(1);
     */
      setPlaybackRate(rate: number): void
      /**
     * Use this to set the volume of the video as a value between 0 and 1. Please
     * note that on some platforms setting the volume is not permitted. For
     * example on iOS where the playback volume is controlled exclusively through
     * the device volume settings. On these platforms a call to this method will
     * not have any effect.
     * 
     * Please also note that on the Tizen platform the
     * `http://tizen.org/privilege/tv.audio` privilege is required.
     *
     * @param volume The volume as a value between 0 and 1
     */
      setVolume(volume: number): void
      /**
     * Registers specified component to player.
     * Please note that every component is automatically unregistered during
     * player disposal, so desired components should be installed again.
     *
     * @param component component constructor.
     *
     * @example 
     *
     * let player = new clpp.Player(...);
     * player.use(clpp.smooth.SmoothComponent);
     * player.destroy();
     * player = new clpp.Player(...);
     * player.use(clpp.smooth.SmoothComponent); // need to add component again
     */
      use(component: Function): void
    }
  
    export class Playlist {
    /**
     * @param player The player instance.
     * @param onItemWillChange The callback triggered right before changing a playlist item.
     *   Adjust the playlist item if needed. For example update the auth token.
     */
      constructor(player: clpp.Player, onItemWillChange?: Function)
      /**
     * Adds an event listener for the given event.
     * Optionally, scope can be passed in, in which case the callback function
     * will be bound/executed in the given scope.
     * This method returns a reference to the callback for
     * convenient removal of the listener.
     *
     * @param type The event name
     * @param listener The callback function
     *
     * @example // Add and remove a listener
     *
     *   const callback = () => {};
     *   target.addEventListener('event', callback);
     *   // ...
     *   target.removeEventListener('event', callback);
     */
      addEventListener(type: string, listener: clpp.EventCallback): void
      /**
     * Add an item at the end of the playlist.
     *
     * @param item The new playlist item
     */
      append(item: clpp.PlaylistItem): void
      /**
     * Remove all playlist items.
     */
      clear(): void
      /**
     * Get the current item, advancing if it's time to.
     */
      getCurrent(): clpp.PlaylistItem|null
      /**
     * Return the position of the current playlist item.
     */
      getPosition(): number
      /**
     * Return the internal list of playlist items.
     */
      getQueue(): Array<clpp.PlaylistItem>
      /**
     * Get the upcoming item.
     */
      getUpcoming(): clpp.PlaylistItem|null
      /**
     * Go to a specific playlist item.
     *
     * @param position The index of the playlist item
     * @param reload True if force reload. False otherwise. Default is false.
     */
      goTo(position: number, reload?: boolean): void
      /**
     * Add an item at the current position in the playlist.
     *
     * @param item The new playlist item
     * @param index The index where the playlist item needs to be inserted
     */
      insert(item: clpp.PlaylistItem, index: number): void
      /**
     * Checks if playing through the playlist.
     */
      isStarted(): boolean
      /**
     * Go to the next playlist item.
     */
      next(): void
      /**
     * Remove an event listener.
     *
     * @param name The event name
     * @param callback The callback function
     *
     * @example // Remove a listener
     *
     *   const listener = playlist.on(clpp.events.PLAYLIST_MODIFIED, () => {});
     *   ...
     *   playlist.off(clpp.events.PLAYLIST_MODIFIED, listener);
     */
      off(name: string, callback: clpp.EventCallback): boolean
      /**
     * Adds an event listener for the given event.
     * Optionally, scope can be passed in, in which case the callback function
     * will be bound/executed in the given scope.
     * This method returns a reference to the callback for
     * convenient removal of the listener via {@link clpp.Playlist.off}.
     *
     * @param name The event name
     * @param callback The callback function
     * @param opt_callbackScope The callback scope
     *
     * @example // Listen to playlist modified
     *
     *   const listener = playlist.on(clpp.events.PLAYLIST_MODIFIED, () => {
     *     // ...
     *   });
     *   playlist.off(clpp.events.PLAYLIST_MODIFIED, listener);
     *
     * @example // Listen to playlist item change
     *
     *   const listener = playlist.on(clpp.events.PLAYLIST_ITEM_CHANGED,
     *     event => {
     *     // ...
     *   });
     *   playlist.off(clpp.events.PLAYLIST_ITEM_CHANGED, listener);
     */
      on(name: string, callback: clpp.EventCallback, opt_callbackScope?: Object): clpp.EventCallback
      /**
     * Override if different behavior needed.
     * Default behavior is go to immediately
     * the next playlist item on playback end.
     */
      onEnded(): void
      /**
     * Adds a one time event listener for the given event.
     * The listener will be removed once the event was triggered.
     * Otherwise at works the same as {@link clpp.Player.on}.
     *
     * @param name The event name
     * @param callback The callback function
     * @param opt_callbackScope The callback scope
     *
     * @example // Listen to fist playlist modification
     *
     *   const listener = player.one(clpp.events.PLAYLIST_MODIFIED, () => {
     *      // first playlist modification
     *   });
     */
      one(name: string, callback: clpp.EventCallback, opt_callbackScope?: Object): clpp.EventCallback
      /**
     * Go to the previous playlist item.
     */
      previous(): void
      /**
     * Remove an item from the playlist.
     * An error is thrown when removing the current item.
     *
     * @param index The index of the playlist item
     */
      remove(index: number): void
      /**
     * Remove an event listener.
     *
     * @param type The event name
     * @param listener The callback function
     */
      removeEventListener(type: string, listener: clpp.EventCallback): void
      /**
     * Play through the playlist.
     */
      start(): void
      /**
     * Stop iterating the playlist.
     */
      stop(): void
    }
  
    export class Rendition {
    /**
     * @param id id
     * @param track track
     */
      constructor(id: string, track: clpp.Track)
      /**
     * The  bitrate (in bps) for this track.
     */
      bandwidth: number|null
      codec: string|null
      drmInfo: string|null
      /**
     * The height in pixel of this track if this is a video track and
     * information about the size is available
     */
      height: number|null
      id: string
      /**
     * Rendition id that appeared in original manifest.
     */
      originalId: string|null
      /**
     * Back reference to a track.
     */
      track: clpp.Track
      /**
     * The width in pixel of this track if this is a video track and
     * information about the size is available
     */
      width: number|null
    }
  
    export class Track {
    /**
     * @param id The unique track ID.
     * @param type The track type
     */
      constructor(id: string, type: clpp.Track.Type)
      /**
     * Accessibility features of this track.
     */
      accessibility: Array<clpp.TrackAccessibility>
      /**
     * The count of the audio track channels.
     */
      channelsCount: number|null
      /**
     * The frame rate of this track.
     * Only defined if this is a video track
     * and frame rate information is available.
     */
      frameRate: number|null
      /**
     * The unique track ID.
     * Please note that the uniqueness is relevant for
     * all tracks of the same type, i.e. all video tracks should have
     * distinguishable IDs, but might share IDs with audio tracks.
     */
      id: string
      /**
     * The track kind.
     * This can be for instance be 'captions' or 'subtitles'.
     */
      kind: string|null
      /**
     * An optional label associated with this track.
     */
      label: string|null
      /**
     * The language associated with this track.
     */
      language: string|null
      /**
     * The MIME type of this track.
     */
      mimeType: string|null
      /**
     * Renditions of this track.
     */
      renditions: Array<clpp.Rendition>
      /**
     * The roles of the track, e.g. 'main', 'caption', or 'commentary'.
     */
      roles: Array<string>
      /**
     * The URL to the source of this track.
     * This is usually set for side-loaded remote text tracks.
     */
      src: string|null
      /**
     * The track type.
     */
      type: clpp.Track.Type
      toString(): string
    }
  
    export class TrackManager {
    /**
     * @param track sideload track to load.
     */
      addTextTrack(track: clpp.RemoteTextTrack): Promise<void>
      /**
     * True if this platform supports selection of video tracks.
     * If false, any attempts to select video tracks or renditions
     * will be ignored.
     */
      canSelectVideoTracks(): boolean
      /**
     * @param filter filter object containing desired rendition
     *   properties.
     */
      findAudioRendition(filter: Object): clpp.Rendition|undefined
      /**
     * @param filter filter object containing desired track properties.
     */
      findAudioTrack(filter: Object): clpp.Track|undefined
      /**
     * @param filter filter object containing desired rendition
     *   properties.
     */
      findTextRendition(filter: Object): clpp.Rendition|undefined
      /**
     * @param filter filter object containing desired track properties.
     */
      findTextTrack(filter: Object): clpp.Track|undefined
      /**
     * @param filter filter object containing desired rendition
     *   properties.
     */
      findVideoRendition(filter: Object): clpp.Rendition|undefined
      /**
     * @param filter filter object containing desired track properties.
     */
      findVideoTrack(filter: Object): clpp.Track|undefined
      getAudioRendition(): clpp.Rendition|null
      getAudioTrack(): clpp.Track|null
      getAudioTracks(): Array<clpp.Track>
      getLoadingAudioRendition(): clpp.Rendition|null
      getLoadingTextRendition(): clpp.Rendition|null
      getLoadingVideoRendition(): clpp.Rendition|null
      getTextRendition(): clpp.Rendition|null
      getTextTrack(): clpp.Track|null
      getTextTracks(): Array<clpp.Track>
      getVideoRendition(): clpp.Rendition|null
      getVideoTrack(): clpp.Track|null
      getVideoTracks(): Array<clpp.Track>
      isAbrEnabled(): boolean
      /**
     * @param rendition The rendition
     * @param clearBuffer clear buffer
     */
      setAudioRendition(rendition: clpp.Rendition, clearBuffer?: boolean): void
      /**
     * @param track The track
     */
      setAudioTrack(track: clpp.Track|null): void
      /**
     * @param rendition The rendition
     * @param clearBuffer clear buffer
     */
      setTextRendition(rendition: clpp.Rendition, clearBuffer?: boolean): void
      /**
     * @param track The track
     */
      setTextTrack(track: clpp.Track|null): void
      /**
     * @param rendition The rendition
     * @param clearBuffer clear buffer
     */
      setVideoRendition(rendition: clpp.Rendition, clearBuffer?: boolean): void
      /**
     * @param track The track
     */
      setVideoTrack(track: clpp.Track|null): void
    }
  
    namespace Error {
      export enum Category {
      /**
       * Errors from the network stack.
       */
        NETWORK = 1,
        /**
       * Errors parsing text streams.
       */
        TEXT = 2,
        /**
       * Errors parsing or processing audio or video streams.
       */
        MEDIA = 3,
        /**
       * Errors parsing the Manifest.
       */
        MANIFEST = 4,
        /**
       * Errors related to streaming.
       */
        STREAMING = 5,
        /**
       * Errors related to DRM.
       */
        DRM = 6,
        /**
       * Miscellaneous errors from the player.
       */
        PLAYER = 7,
        /**
       * Errors related to cast.
       */
        CAST = 8,
        /**
       * Errors related to plugins.
       */
        PLUGIN = 9,
        /**
       * Errors related to ads.
       */
        ADS = 10,
      }
    
      export enum Code {
      /**
       * A network request was made using an unsupported URI scheme.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        UNSUPPORTED_SCHEME = 1000,
        /**
       * An HTTP network request returned an HTTP status that indicated a failure.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        BAD_HTTP_STATUS = 1001,
        /**
       * An HTTP network request was made but no response was received. There are
       * several different reasons why this may occur. It could be caused by
       * CORS, an SSL problem, the browser being offline or a mixed content error.
       * See the {@link https://demo.castlabs.com/#/docs/errors | chapter on Errors}
       * for more info.
       * Additionally, there are two special cases, when no response is received,
       * but a different error code will be used instead. Error code `1003` is used
       * for network timeouts, and code `7001` is used when the request
       * is aborted by the player itself.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        HTTP_ERROR = 1002,
        /**
       * A network request timed out.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        TIMEOUT = 1003,
        /**
       * A network request was made with a malformed data URI.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        MALFORMED_DATA_URI = 1004,
        /**
       * A network request was made with a data URI using an unknown encoding.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        UNKNOWN_DATA_URI_ENCODING = 1005,
        /**
       * A request modifier threw an error. The {@link clpp.Error#cause|cause}
       * contains the original error.
       */
        REQUEST_MODIFIER_ERROR = 1006,
        /**
       * A response modifier threw an error. The {@link clpp.Error#cause|cause}
       * contains the original error.
       */
        RESPONSE_MODIFIER_ERROR = 1007,
        /**
       * A testing network request was made with a malformed URI.
       * This error is only used by unit and integration tests.
       */
        MALFORMED_TEST_URI = 1008,
        /**
       * An unexpected network request was made to the FakeNetworkingEngine.
       * This error is only used by unit and integration tests.
       */
        UNEXPECTED_TEST_REQUEST = 1009,
        /**
       * The number of retry attempts have run out.
       * This is an internal error and shouldn't be propagated.
       */
        ATTEMPTS_EXHAUSTED = 1010,
        /**
       * The text parser failed to parse a text stream due to an invalid header.
       */
        INVALID_TEXT_HEADER = 2000,
        /**
       * The text parser failed to parse a text stream due to an invalid cue.
       */
        INVALID_TEXT_CUE = 2001,
        /**
       * Was unable to detect the encoding of the response text.  Suggest adding
       * byte-order-markings to the response data.
       */
        UNABLE_TO_DETECT_ENCODING = 2003,
        /**
       * The response data contains invalid Unicode character encoding.
       */
        BAD_ENCODING = 2004,
        /**
       * The XML parser failed to parse an xml stream, or the XML lacks mandatory
       * elements for TTML.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        INVALID_XML = 2005,
        /**
       * MP4 segment does not contain TTML.
       */
        INVALID_MP4_TTML = 2007,
        /**
       * MP4 segment does not contain VTT.
       */
        INVALID_MP4_VTT = 2008,
        /**
       * When examining media in advance, we were unable to extract the cue time.
       * This should only be possible with HLS, where we do not have explicit
       * segment start times. The {@link clpp.Error#cause|cause}
       * is the underlying exception or Error object.
       */
        UNABLE_TO_EXTRACT_CUE_START_TIME = 2009,
        /**
       * An error occurred while fetching or appending a text stream.
       * The {@link clpp.Error#data|data} is the underlying exception
       * or Error object.
       */
        FETCH_OR_APPEND_ERROR = 2010,
        /**
       * MP4 lacks mandatory elements for VTT & TTML.
       */
        INVALID_MP4 = 2011,
        /**
       * Unable to find a text parser which can handle the given mime type.
       * Please check whether TTML or VTT component is installed.
       */
        TEXT_PARSER_MISSING = 2012,
        /**
       * Thumbnail file(s) failed to load.
       */
        THUMBNAILS_FAILED_TO_LOAD = 2013,
        /**
       * Some component tried to read past the end of a buffer.  The segment index,
       * init segment, or PSSH may be malformed.
       */
        BUFFER_READ_OUT_OF_BOUNDS = 3000,
        /**
       * Some component tried to parse an integer that was too large to fit in a
       * JavaScript number without rounding error.  JavaScript can only natively
       * represent integers up to 53 bits.
       */
        JS_INTEGER_OVERFLOW = 3001,
        /**
       * The EBML parser used to parse the WebM container encountered an integer,
       * ID, or other field larger than the maximum supported by the parser.
       */
        EBML_OVERFLOW = 3002,
        /**
       * The EBML parser used to parse the WebM container encountered a floating-
       * point field of a size not supported by the parser.
       */
        EBML_BAD_FLOATING_POINT_SIZE = 3003,
        /**
       * The MP4 SIDX parser found the wrong box type.
       * Either the segment index range is incorrect or the data is corrupt.
       * The following properties of the error are exposed in the
       * {@link clpp.Error#data|data} object:
       */
        MP4_SIDX_WRONG_BOX_TYPE = 3004,
        /**
       * The MP4 SIDX parser encountered an invalid timescale.
       * The segment index data may be corrupt.
       */
        MP4_SIDX_INVALID_TIMESCALE = 3005,
        /**
       * The MP4 SIDX parser encountered a type of SIDX that is not supported.
       */
        MP4_SIDX_TYPE_NOT_SUPPORTED = 3006,
        /**
       * The WebM Cues parser was unable to locate the Cues element.
       * The segment index data may be corrupt.
       */
        WEBM_CUES_ELEMENT_MISSING = 3007,
        /**
       * The WebM header parser was unable to locate the Ebml element.
       * The init segment data may be corrupt.
       */
        WEBM_EBML_HEADER_ELEMENT_MISSING = 3008,
        /**
       * The WebM header parser was unable to locate the Segment element.
       * The init segment data may be corrupt.
       */
        WEBM_SEGMENT_ELEMENT_MISSING = 3009,
        /**
       * The WebM header parser was unable to locate the Info element.
       * The init segment data may be corrupt.
       */
        WEBM_INFO_ELEMENT_MISSING = 3010,
        /**
       * The WebM header parser was unable to locate the Duration element.
       * The init segment data may be corrupt or may have been incorrectly encoded.
       * Shaka requires a duration in WebM DASH content.
       */
        WEBM_DURATION_ELEMENT_MISSING = 3011,
        /**
       * The WebM Cues parser was unable to locate the Cue Track Positions element.
       * The segment index data may be corrupt.
       */
        WEBM_CUE_TRACK_POSITIONS_ELEMENT_MISSING = 3012,
        /**
       * The WebM Cues parser was unable to locate the Cue Time element.
       * The segment index data may be corrupt.
       */
        WEBM_CUE_TIME_ELEMENT_MISSING = 3013,
        /**
       * A MediaSource operation failed.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        MEDIA_SOURCE_OPERATION_FAILED = 3014,
        /**
       * A MediaSource operation threw an exception.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        MEDIA_SOURCE_OPERATION_THREW = 3015,
        /**
       * The video element reported an error.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        VIDEO_ERROR = 3016,
        /**
       * A MediaSource operation threw QuotaExceededError and recovery failed. The
       * content cannot be played correctly because the segments are too large for
       * the browser/platform. This may occur when attempting to play very high
       * quality, very high bitrate content on low-end devices.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        QUOTA_EXCEEDED_ERROR = 3017,
        /**
       * Mux.js did not invoke the callback signifying successful transmuxing.
       */
        TRANSMUXING_FAILED = 3018,
        /**
       * General error raised by the MP4 parser or entities that process MP4 data.
       */
        MP4_PARSER_ERROR = 3019,
        /**
       * An error occurred while loading media. The detail property contains the URL
       * of the media or manifest segment that failed to load. This error is posted
       * when the player has no detailed information about the actual failure.
       */
        MEDIA_LOAD_ERROR = 3100,
        /**
       * An error raised when the requested track type is invalid. Valid track types
       * must be one of {@link clpp.Track.Type}.
       */
        INVALID_TRACK_TYPE = 3101,
        /**
       * An error raised when the requested track is unknown.
       */
        UNKNOWN_TRACK = 3102,
        /**
       * A media segment could not be decrypted. This can happen e.g for
       * HLS + AES-128 content.
       */
        MEDIA_DECRYPTION_ERROR = 3103,
        /**
       * An error raised when the play is not allowed.
       */
        PLAY_NOT_ALLOWED = 3200,
        /**
       * The Player was unable to guess the manifest type based on file extension
       * or MIME type. To fix, try one of the following:
       * 
       *   Set an explicit type in the {@link clpp.Source} when calling
       *       {@link clpp.Player#load}.
       *   Rename the manifest so that the URI ends in a well-known extension.
       *   Configure the server to send a recognizable Content-Type header.
       *   Configure the server to accept a HEAD request for the manifest.
       * 
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        UNABLE_TO_GUESS_MANIFEST_TYPE = 4000,
        /**
       * The DASH Manifest contained invalid XML markup.
       */
        DASH_INVALID_XML = 4001,
        /**
       * The DASH Manifest contained a Representation with insufficient segment
       * information.
       */
        DASH_NO_SEGMENT_INFO = 4002,
        /**
       * The DASH Manifest contained an AdaptationSet with no Representations.
       */
        DASH_EMPTY_ADAPTATION_SET = 4003,
        /**
       * The DASH Manifest contained an Period with no AdaptationSets.
       */
        DASH_EMPTY_PERIOD = 4004,
        /**
       * The DASH Manifest does not specify an init segment with a WebM container.
       */
        DASH_WEBM_MISSING_INIT = 4005,
        /**
       * The DASH Manifest contained an unsupported container format.
       */
        DASH_UNSUPPORTED_CONTAINER = 4006,
        /**
       * The embedded PSSH data has invalid encoding.
       */
        DASH_PSSH_BAD_ENCODING = 4007,
        /**
       * There is an AdaptationSet whose Representations do not have any common
       * key-systems.
       */
        DASH_NO_COMMON_KEY_SYSTEM = 4008,
        /**
       * Having multiple key IDs per Representation is not supported.
       */
        DASH_MULTIPLE_KEY_IDS_NOT_SUPPORTED = 4009,
        /**
       * The DASH Manifest specifies conflicting key IDs.
       */
        DASH_CONFLICTING_KEY_IDS = 4010,
        /**
       * The manifest contains a period with no playable streams.
       * Either the period was originally empty, or the streams within cannot be
       * played on this browser or platform.
       */
        UNPLAYABLE_PERIOD = 4011,
        /**
       * There exist some streams that could be decoded, but restrictions imposed
       * by the application or the key system prevent us from playing.  This may
       * happen under the following conditions:
       * 
       *   The application has given restrictions to the Player that restrict
       *       at least one content type completely (e.g. no playable audio).
       *   The key system has imposed output restrictions that cannot be met
       *       (such as HDCP) and there are no unrestricted alternatives.
       * 
       */
        RESTRICTIONS_CANNOT_BE_MET = 4012,
        /**
       * No valid periods were found in the manifest.  Please check that your
       * manifest is correct and free of typos.
       */
        NO_PERIODS = 4014,
        /**
       * HLS playlist doesn't start with a mandatory #EXTM3U tag.
       */
        HLS_PLAYLIST_HEADER_MISSING = 4015,
        /**
       * HLS tag has an invalid name that doesn't start with '#EXT'
       * 
       *  error.data[0] is the invalid tag.
       */
        INVALID_HLS_TAG = 4016,
        /**
       * HLS playlist has both Master and Media/Segment tags.
       */
        HLS_INVALID_PLAYLIST_HIERARCHY = 4017,
        /**
       * A Representation has an id that is the same as another Representation in
       * the same Period.  This makes manifest updates impossible since we cannot
       * map the updated Representation to the old one.
       */
        DASH_DUPLICATE_REPRESENTATION_ID = 4018,
        /**
       * HLS manifest has several #EXT-X-MAP tags. We can only
       * support one at the moment.
       */
        HLS_MULTIPLE_MEDIA_INIT_SECTIONS_FOUND = 4020,
        /**
       * HLS parser was unable to guess mime type of a stream.
       * 
       *  error.data[0] is the stream file's extension.
       */
        HLS_COULD_NOT_GUESS_MIME_TYPE = 4021,
        /**
       * One of the required attributes was not provided.
       * HLS manifest is invalid.
       * 
       *  error.data[0] is the missing attribute's name.
       */
        HLS_REQUIRED_ATTRIBUTE_MISSING = 4023,
        /**
       * One of the required tags was not provided.
       * HLS manifest is invalid.
       * 
       *  error.data[0] is the missing tag's name.
       */
        HLS_REQUIRED_TAG_MISSING = 4024,
        /**
       * HLS parser was unable to guess codecs of a stream.
       * 
       *  error.data[0] is the list of all codecs for the variant.
       */
        HLS_COULD_NOT_GUESS_CODECS = 4025,
        /**
       * HLS parser has encountered encrypted content with unsupported
       * KEYFORMAT attributes.
       */
        HLS_KEYFORMATS_NOT_SUPPORTED = 4026,
        /**
       * The manifest parser only supports xlink links with xlink:actuate="onLoad".
       */
        DASH_UNSUPPORTED_XLINK_ACTUATE = 4027,
        /**
       * The manifest parser has hit its depth limit on xlink link chains.
       */
        DASH_XLINK_DEPTH_LIMIT = 4028,
        /**
       * HLS parser was unable to parse segment start time from the media.
       */
        HLS_COULD_NOT_PARSE_SEGMENT_START_TIME = 4030,
        /**
       * The content container or codecs are not supported by this browser. For
       * example, this could happen if the content is WebM, but your browser does
       * not support the WebM container, or if the content uses HEVC, but your
       * browser does not support the HEVC codec.  This can also occur for
       * multicodec or multicontainer manifests if none of the codecs or containers
       * are supported by the browser.
       */
        CONTENT_UNSUPPORTED_BY_BROWSER = 4032,
        /**
       * Microsoft smooth streaming invalid manifest XML
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *  {@code uri} - The provided manifest URI
       * 
       */
        SMOOTH_INVALID_MANIFEST_XML = 4033,
        /**
       * Microsoft smooth streaming empty presentation i.e. no stream were found
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *  {@code uri} - The provided manifest URI
       * 
       */
        SMOOTH_EMPTY_PRESENTATION = 4034,
        /**
       * The Smooth Streaming plugin experienced an error while processing media
       * data. The {@link clpp.Error#data} property contains an object with the
       * following properties:
       * 
       *    {@code error} - The error object
       * 
       */
        SMOOTH_MEDIA_PROCESSING_ERROR = 4035,
        /**
       * The smooth streaming manifest version is invalid
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *    {@code error} - The error object
       * 
       */
        SMOOTH_INVALID_VERSION = 4036,
        /**
       * The Smooth Streaming parser found an invalid |StreamFragmentElement|.
       * Invalid here means that it didn't complied with the specs.
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *  {@code error} - The error object
       * 
       */
        SMOOTH_INVALID_FRAGMENT_METADATA = 4037,
        /**
       * One of the required attributes was not provided.
       * Smooth Streaming manifest is invalid.
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *  {@code error} - The error object
       * 
       */
        SMOOTH_REQUIRED_ATTRIBUTE_MISSING = 4038,
        /**
       * A media segment could not be processed because it's truncated.
       * The {@link clpp.Error#data} property contains an object with the following
       * properties:
       * 
       *  {@code error} - The error object
       * 
       */
        SMOOTH_TRUNCATED_MEDIA_FILE = 4039,
        /**
       * External text tracks cannot be added to live streams.
       */
        CANNOT_ADD_EXTERNAL_TEXT_TO_LIVE_STREAM = 4040,
        /**
       * We do not support playing encrypted transport streams (TS) with MSE.
       */
        HLS_MSE_ENCRYPTED_TS_NOT_SUPPORTED = 4041,
        /**
       * The StreamingEngine called onChooseStreams() but the callback receiver
       * did not return the correct number or type of Streams.
       * This can happen when there is multi-Period content where one Period is
       * video+audio and another is video-only or audio-only.  We don't support this
       * case because it is incompatible with MSE.  When the browser reaches the
       * transition, it will pause, waiting for the audio stream.
       */
        INVALID_STREAMS_CHOSEN = 5005,
        /**
       * The manifest indicated protected content, but the manifest parser was
       * unable to determine what key systems should be used.
       */
        NO_RECOGNIZED_KEY_SYSTEMS = 6000,
        /**
       * None of the requested key system configurations are available.  This may
       * happen under the following conditions:
       * 
       *    Configuration for the target system is missing.
       *    The key system is not supported.
       *    The key system does not support the features requested (e.g.
       *        persistent state).
       *    A user prompt was shown and the user denied access.
       *    The key system is not available from unsecure contexts. (ie.
       *             requires HTTPS) See https://goo.gl/EEhZqT.
       * 
       */
        REQUESTED_KEY_SYSTEM_CONFIG_UNAVAILABLE = 6001,
        /**
       * The browser found one of the requested key systems, but it failed to
       * create an instance of the CDM for some unknown reason.
       * The errors cause might contain the original error if there was one thrown
       * by the browser. If there was an error message it will be in
       * the {@code message} property of the data object
       */
        FAILED_TO_CREATE_CDM = 6002,
        /**
       * The browser found one of the requested key systems and created an instance
       * of the CDM, but it failed to attach the CDM to the video for some unknown
       * reason.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        FAILED_TO_ATTACH_TO_VIDEO = 6003,
        /**
       * The CDM rejected the server certificate supplied by the application.
       * The certificate may be malformed or in an unsupported format.
       * The player will try to recover from such an error automatically if this
       * happened with a pre-configured server certificate. In that case this
       * error will be posted as a recoverable error. However, if the certificate
       * returned by the DRM backend could not be loaded, a fatal error will be
       * posted.
       */
        INVALID_SERVER_CERTIFICATE = 6004,
        /**
       * The CDM refused to create a session for some unknown reason.
       * 
       *  error.data.message is an error message string from the browser or null
       */
        FAILED_TO_CREATE_SESSION = 6005,
        /**
       * The CDM was unable to generate a license request for the init data it was
       * given. The init data may be malformed or in an unsupported format.
       * 
       *  error.cause contains a reference to the original error
       */
        FAILED_TO_GENERATE_LICENSE_REQUEST = 6006,
        /**
       * The license request failed. This could be a timeout, a network failure, or
       * a rejection by the server. The {@link clpp.Error#cause|cause} contains the
       * underlying network error. The following properties of the network error
       * are exposed in the {@link clpp.Error#data|data} object:
       */
        LICENSE_REQUEST_FAILED = 6007,
        /**
       * The license response was rejected by the CDM.  The server's response may be
       * invalid or malformed for this CDM.
       * 
       *  error.data[0] is an error message string from the browser.
       */
        LICENSE_RESPONSE_REJECTED = 6008,
        /**
       * The manifest does not specify any DRM info, but the content is encrypted.
       * Either the manifest or the manifest parser are broken.
       */
        ENCRYPTED_CONTENT_WITHOUT_DRM_INFO = 6010,
        /**
       * No license server was given for the key system signaled by the manifest.
       * A license server URI is required for every key system.
       */
        NO_LICENSE_SERVER_GIVEN = 6012,
        /**
       * A required offline session was removed.  The content is not playable.
       */
        OFFLINE_SESSION_REMOVED = 6013,
        /**
       * The license has expired.  This is triggered when all keys in the key
       * status map have a status of 'expired'.
       */
        EXPIRED = 6014,
        /**
       * The requested DRM environment is unavailable. This happens if you configure
       * this player to use a DRM environment that hasn't be register with the
       * player.
       * Please make sure the configured DRM environment is actually added to player
       * before using it. For more details see https://bit.ly/3piaFqf
       */
        REQUESTED_DRM_ENVIRONMENT_UNAVAILABLE = 6015,
        /**
       * An error was thrown while executing the init data transformation.
       * error.data[0] is the original error.
       */
        INIT_DATA_TRANSFORM_ERROR = 6016,
        /**
       * The DRM certificate request failed. The {@code cause} if the error
       * will contain an error of the {@link clpp.Error.Category#NETWORK} category
       * with more information about the failed request.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        CERTIFICATE_REQUEST_FAILED = 6100,
        /**
       * Raised specifically by Fairplay DRM when the extracted content ID is an
       * empty string. Check your implementation of the
       * {@link clpp.drm.FairplayDrmSystem}s {@code extractContentId}
       * modifier or HLS #EXT-X-KEY:URI content.
       */
        NO_CONTENT_ID = 6101,
        /**
       * A server certificate wasn't given when it is required.  FairPlay requires
       * setting an explicit server certificate in the configuration.
       */
        SERVER_CERTIFICATE_REQUIRED = 6102,
        /**
       * An extractContentId modifier threw an error. Check your implementation of
       * the {@link clpp.drm.FairplayDrmSystem}s {@code extractContentId}
       * modifier.
       */
        EXTRACT_CONTENT_ID_MODIFIER_ERROR = 6103,
        /**
       * Raised when an attempt to persist a media key session failed.
       */
        FAILED_TO_PERSIST_SESSION = 6200,
        /**
       * Raised when an attempt to remove a offline media key session failed.
       */
        FAILED_TO_REMOVE_SESSION = 6201,
        /**
       * Raised when trying to use and invalid session storage implementation.
       */
        INVALID_SESSION_STORAGE_IMPLEMENTATION = 6202,
        /**
       * The call to Player.load() was interrupted by a call to Player.release()
       * or another call to Player.load().
       */
        LOAD_INTERRUPTED = 7000,
        /**
       * An internal error which indicates that an operation was aborted.
       * For example the load promise might be rejected with this error when
       * another load call has been executed.
       */
        OPERATION_ABORTED = 7001,
        /**
       * The call to Player.load() failed because the Player does not have a video
       * element. The video element must be provided to the constructor.
       */
        NO_VIDEO_ELEMENT = 7002,
        /**
       * The player could not load the configured {@link clpp.Source}.
       * Either the player is missing some capabilities (e.g. from one or more
       * unloaded player components/plugins) or it's limited by the current
       * platform.
       */
        CANNOT_LOAD_SOURCE = 7003,
        /**
       * Player failed to initialize because no Media Element
       * with the provided ID was found.
       */
        MEDIA_ELEMENT_NOT_FOUND = 7004,
        /**
       * Player failed to initialize because Media Element
       * is invalid.
       * E.g. it is not an HTMLMediaElement.
       */
        INVALID_MEDIA_ELEMENT = 7005,
        /**
       * Player failed to initialize because container element
       * passed via the `containerEl` option is not valid.
       * E.g. it is not a direct parent of the video element.
       */
        INVALID_CONTAINER_ELEMENT = 7006,
        /**
       * The provided {@link clpp.PlayerConfiguration} is invalid
       */
        INVALID_CONFIGURATION = 7100,
        /**
       * The provided {@link clpp.PlayerConfiguration#license} does not exist
       * or is invalid
       */
        INVALID_LICENSE = 7101,
        /**
       * No DOM element or element ID was provided when initializing the player
       */
        NO_ELEMENT = 7102,
        /**
       * Error raised when viewer ID is mandatory for the supplied license but it
       * has not been provided.
       * Viewer ID should be supplied via the
       * {@link clpp.PlayerConfiguration#viewerId|viewerId} config.
       * In case when DRMtoday DRM is used the viewer ID is automatically
       * taken from the {@link clpp.DrmConfiguration|drm.customData.userId}
       * config.
       */
        USER_ID_NOT_PROVIDED = 7103,
        /**
       * Error raised when a key required to decrypt a media segment could not be
       * loaded (e.g. AES key).
       */
        KEY_LOAD_ERROR = 7104,
        /**
       * An internal (AVPlay) tizen error occurred.
       * 
       *  Please, refer to this link for more details about the nature of the
       * error.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        TIZEN_INTERNAL_ERROR = 7200,
        /**
       * An internal Chromecast CAF receiver error.
       * 
       * Please refer to
       * {@link https://developers.google.com/cast/docs/caf_receiver/error_codes|CAF description}
       * for detailed info.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        CAF_INTERNAL_ERROR = 7300,
        /**
       * An internal Cast Sender error.
       * The {@link clpp.Error#data|data} property contains an object with the
       * following properties:
       */
        INTERNAL_CAST_ERROR = 8000,
        /**
       * Cast API is not ready. Please check is Cast SDK included and does browser
       * support SDK.
       */
        CAST_API_NOT_READY = 8001,
        /**
       * Error indicating receivers are not currently available.
       */
        NO_RECEIVERS_AVAILABLE = 8002,
        /**
       * Already casting error.
       */
        ALREADY_CASTING = 8003,
        /**
       * Cannot perform action as required cast session is not available.
       */
        NO_CAST_SESSION = 8004,
        /**
       * This error is raised when trying to use the castLabs Conviva analytics
       * plugin without loading the Conviva SDK script.
       */
        CONVIVA_SDK_NOT_LOADED = 9000,
        /**
       * The provided conviva analytics configuration is invalid.
       */
        CONVIVA_INVALID_CONFIGURATION = 9001,
        /**
       * Miscellaneous conviva plugin runtime error.
       */
        CONVIVA_RUNTIME_ERROR = 9002,
        /**
       * Error code that indicates that the player was trying to initialize
       * a WebGL context and failed.
       */
        GL_CONTEXT_ERROR = 9003,
        /**
       * Error code that indicates that the player not able to compile a shader
       */
        GL_SHADER_ERROR = 9004,
        /**
       * Youbora plugin is loaded, but required SDK has not been included.
       */
        YOUBORA_SDK_MISSING = 9100,
        /**
       * Passed configuration is insufficient to configure Youbora properly.
       * Check if required fields, like `accountCode`, are passed.
       */
        YOUBORA_INVALID_CONFIGURATION = 9101,
        /**
       * The version of the provided Youbora SDK is not supported.
       */
        YOUBORA_SDK_VERSION_NOT_SUPPORTED = 9102,
        /**
       * Passed configuration is insufficient to configure Vimond properly.
       * Check if required fields, like `playServiceResponse`, are passed.
       */
        VIMOND_INVALID_CONFIGURATION = 9200,
        /**
       * Generic Vimond Player Session error.
       */
        VIMOND_SESSION_ERROR = 9201,
        /**
       * Passed configuration is insufficient to configure Mux Data properly.
       * Check if required fields, like `envKey`, are passed.
       */
        MUXDATA_INVALID_CONFIGURATION = 9300,
        /**
       * Mux data plugin is loaded, but required SDK has not been included.
       */
        MUX_SDK_MISSING = 9301,
        /**
       * An error occurred during the Mux Data session initialization.
       */
        MUXDATA_INIT_ERROR = 9302,
        /**
       * IMA SDK, required for ad insertion, has not been included on the page.
       */
        IMA_SDK_MISSING = 10000,
        /**
       * The provided IMA configuration is invalid.
       */
        IMA_INVALID_CONFIGURATION = 10001,
        /**
       * Cannot currently run IMA on given platform (i.e. platform does not support
       * multiple video elements).
       */
        IMA_UNSUPPORTED_PLATFORM = 10002,
        /**
       * The ads manager failed when playing an ad.
       */
        AD_ERROR = 10003,
        /**
       * Broadpeak SDK has not been included on the page.
       */
        BROADPEAK_SDK_MISSING = 11000,
        /**
       * An error occurred when creating Broadpeak session.
       */
        BROADPEAK_SESSION_ERROR = 11001,
        /**
       * FreeWheel SDK has not been included on the page.
       */
        FREEWHEEL_SDK_MISSING = 12000,
        /**
       * The provided FreeWheel configuration is invalid.
       */
        FREEWHEEL_INVALID_CONFIGURATION = 12001,
        /**
       * The streaming engine failed when applying content workarounds.
       */
        CONTENT_TRANSFORMATION_FAILED = 14000,
      }
    
      export enum Severity {
      /**
       * An error occurred that the player will try to recover from. If retrying
       * continues to fail, the player might still issue a FATAL error. A good
       * example for this is a failing download. The first failure might be reported
       * as a recoverable error, but if the download continues to fail, the error
       * will turn into a fatal error.
       */
        RECOVERABLE = 1,
        /**
       * A fatal error that the player can not recover from. Usually this stops
       * playback and loading and you want to release the player before you try
       * again.
       */
        FATAL = 2,
      }
    }
  
    namespace Player {
    /**
     * Enum with all possible player states.
     */
      export enum State {
      /**
       * 0 - when player has been created or released
       */
        IDLE = 0,
        /**
       * 1 - when player receives the api command to load the movie until it starts
       * requesting the first fragment
       */
        PREPARING = 1,
        /**
       * 2 - when player doesn't have enough data to play the content for any
       * reasons
       */
        BUFFERING = 2,
        /**
       * 3 - when player starts playing content
       */
        PLAYING = 3,
        /**
       * 4 - when player is stopped
       */
        PAUSED = 4,
        /**
       * 5 - when video is ended
       */
        ENDED = 5,
        /**
       * 6 - when player encounters an error
       */
        ERROR = 6,
        /**
       * 7 - Used exclusively to indicate previous state, when it has no state yet
       */
        UNSET = 7,
      }
    }
  
    namespace Track {
    /**
     * Constants to identify primary track types
     */
      export enum Type {
      /**
       * Video tracks
       */
        VIDEO = 'video',
        /**
       * Audio tracks
       */
        AUDIO = 'audio',
        /**
       * Text tracks
       */
        TEXT = 'text',
        /**
       * Metadata tracks
       */
        METADATA = 'metadata',
      }
    }
  
    namespace adobe {
      export class AdobeAnalyticsPlugin {
        static Id: string
      }
    }
  
    namespace ads {
      export interface IAd {
      /**
       * The ad manager name.
       */
        getAdManagerName(): string
        /**
       * The ad manager version.
       */
        getAdManagerVersion(): string
        /**
       * The source ad server of the ad, or the empty string
       * if this information is unavailable.
       */
        getAdSystem(): string
        /**
       * The advertiser name, or the empty string if this information is
       * unavailable.
       */
        getAdvertiserName(): string
        /**
       * Identifies the API needed to execute the ad.
       * This corresponds with the apiFramework specified in vast.
       */
        getApiFramework(): string|null
        /**
       * Returns the click through url.
       */
        getClickThroughUrl(): string|null
        /**
       * Retrieves the ID of the selected creative for the ad.
       */
        getCreativeId(): string
        /**
       * The duration of the ad.
       */
        getDuration(): number
        /**
       * The ID of the ad, or empty string if this information is unavailable.
       */
        getId(): string
        /**
       * Returns the media bitrate of the ad.
       */
        getMediaBitrate(): number
        /**
       * The media height of the ad.
       */
        getMediaHeight(): number
        /**
       * Returns the url of the media file.
       */
        getMediaUrl(): string|null
        /**
       * The media width of the ad.
       */
        getMediaWidth(): number
        /**
       * The index of the ad pod in the ad playlist.
       * For a preroll pod, returns 0.
       * For midrolls, returns 1, 2,..., N.
       * For a postroll pod, returns -1.
       * Defaults to 0 if this ad is not part of a pod,
       * or this pod is not part of a playlist.
       */
        getPodIndex(): number
        /**
       * The content time offset at which the current ad pod was scheduled.
       * For preroll pod, 0 is returned.
       * For midrolls, the scheduled time is returned.
       * For postroll, -1 is returned.
       * Defaults to 0 if this ad is not part of a pod,
       * or the pod is not part of an ad playlist.
       */
        getPodTimeOffset(): number
        /**
       * The type of the ad pod.
       */
        getPodType(): clpp.ads.PodType
        /**
       * The position of the ad within the ad pod.
       */
        getPositionInSequence(): number
        /**
       * The total number of ads contained within this pod, including bumpers.
       * Defaults to 1 if this ad is not part of a pod.
       */
        getSequenceLength(): number
        /**
       * The number of seconds of playback before the ad becomes skippable.
       * -1 is returned for non skippable ads or if this is unavailable.
       */
        getSkipTimeOffset(): number
        /**
       * The technology of the ad, for example client side or server side.
       */
        getTechnology(): clpp.ads.Technology
        /**
       * The title, empty if not specified.
       */
        getTitle(): string
        /**
       * Ad IDs used for wrapper ads. The IDs returned starts at the inline ad
       * (innermost) and traverses to the outermost wrapper ad. An empty array is
       * returned if there are no wrapper ads.
       */
        getWrapperAdIds(): Array<string>
        /**
       * Ad systems used for wrapper ads. The ad systems returned starts at the
       * inline ad and traverses to the outermost wrapper ad. An empty array is
       * returned if there are no wrapper ads.
       */
        getWrapperAdSystems(): Array<string>
        /**
       * Selected creative IDs used for wrapper ads. The creative IDs returned
       * starts at the inline ad and traverses to the outermost wrapper ad. An empty
       * array is returned if there are no wrapper ads.
       */
        getWrapperCreativeIds(): Array<string>
        /**
       * Whether the ad is a bumper ad.
       */
        isBumper(): boolean
      }
    
      export interface IAdsManager {
      /**
       * Gets the current time of the current ad that is playing.
       * If the ad is not loaded yet or has finished playing, the API would return
       * -1.
       */
        getPosition(): number
        /**
       * Gets the volume for the current ad.
       */
        getVolume(): number
        /**
       * Pauses the current ad that is playing.
       * This function will be no-op when the ad is not loaded yet or is done
       * playing.
       */
        pause(): void
        /**
       * Resumes the current ad that is loaded and paused.
       * This function will be no-op when the ad is not loaded yet or is done
       * playing.
       */
        resume(): void
        /**
       * Sets the volume for the current ad.
       *
       * @param volume The volume to set, from 0 (muted) to 1 (loudest).
       */
        setVolume(volume: number): void
        /**
       * Skips the current ad when {@link clpp.IAd.getSkipTimeOffset} is reached.
       * When called under other circumstances, skip has no effect.
       * After the skip is completed the AdsManager fires
       * an {@link clpp.events.AD_SKIPPED} event.
       */
        skip(): void
      }
    
      export interface IAdsManagerFactory {
      /**
       * Creates an ads manager.
       *
       * @param player The proxy player.
       */
        create(player: clpp.Player): clpp.ads.IAdsManager
        /**
       * Checks if this factory creates an ads manager that can play specified
       * ads.
       *
       * @param player Player instance
       * @param config The player configuration.
       */
        isSupported(player: clpp.Player, config: clpp.PlayerConfiguration): boolean
        /**
       * The factory name.
       */
        name(): string
      }
    
      export interface IAdsTimeline {
      /**
       * An array of offsets in seconds indicating
       * when a scheduled ad break will play.
       * A preroll is represented by 0, and a postroll is represented by -1.
       * An empty array indicates the ad or ad pod has no schedule
       * and can be played at any time.
       * Access specific ad metadata on {@link clpp.events.AD_STARTED}.
       */
        getCuePoints(): Array<number>
        /**
       * Returns true if a postroll is scheduled; false otherwise.
       */
        hasPostroll(): boolean
        /**
       * Returns true if a preroll is scheduled; false otherwise.
       */
        hasPreroll(): boolean
      }
    
      /**
     * Enum with all possible ad error types.
     */
      export enum ErrorType {
      /**
       * 0 - An error occurred when loading cue points or ad metadata.
       */
        LOAD = 0,
        /**
       * 1 - An error occurred when playing ad.
       */
        PLAY = 1,
        /**
       * 2 - Other error
       */
        OTHER = 2,
      }
    
      /**
     * Enum with all possible ad pod types.
     */
      export enum PodType {
      /**
       * 0 - Pre roll
       */
        PREROLL = 0,
        /**
       * 1 - Mid roll
       */
        MIDROLL = 1,
        /**
       * 2 - Post roll
       */
        POSTROLL = 2,
      }
    
      /**
     * Enum with all possible ad technologies.
     */
      export enum Technology {
      /**
       * 0 - Client side
       */
        CLIENT_SIDE = 0,
        /**
       * 1 - Server side
       */
        SERVER_SIDE = 1,
      }
    }
  
    namespace airplay {
      export class AirPlayPlugin {
        static Id: string
        /**
       * Check if AirPlay available.
       */
        canCast(): boolean
        /**
       * Check if casting active.
       */
        isCasting(): boolean
        /**
       * Show the airplay target selection menu.
       */
        showCastMenu(): void
      }
    }
  
    namespace broadpeak {
      export class BroadpeakPlugin {
        static Id: string
        /**
       * Check if Broadpeak SDK is available.
       */
        static isSdkMissing(): boolean
      }
    }
  
    namespace cast {
      export class CastProxy {
      /**
       * @param player player instance to use. This instance will be
       *   an entry point controlling content.
       * @param receiverAppId id of receiver application. If blank, casting
       *   will not be available, but the proxy will still function otherwise.
       * @param onResumeLocal Callback function to add specific logic that should be
       *   executed after session ends. If not provided, default callback
       *   implementation will start playback locally, unless we were in ENDED/IDLE
       *   state.
       */
        constructor(player: clpp.Player, receiverAppId: string, onResumeLocal?: Function)
        /**
       * Add message listener to 'urn:x-cast:castlabs' namespace.
       */
        addMessageListener(listener: Function): void
        /**
       * Checks if casting option is now available. Depends on existence of Cast API
       * and receivers availability.
       */
        canCast(): boolean
        /**
       * Start casting. If player has some loaded content, it will be casted.
       * Otherwise, we will start empty session.
       *
       * @param opt_playerConfig optional
       *   configuration to cast. If omitted, player will try to cast current
       *   content.
       */
        cast(opt_playerConfig?: clpp.PlayerConfiguration): Promise<void>
        /**
       * Change receiver id. It will close current session, if any.
       *
       * @param newAppId new receiver application id.
       */
        changeReceiverId(newAppId: string): Promise<void>
        /**
       * Clear all Cast content metadata.
       */
        clearContentMetadata(): void
        /**
       * Destroys proxy. Keep in mind that underlying player will be still
       * functional.
       */
        destroy(): Promise<void>
        /**
       * Force the receiver app to shut down by disconnecting.
       */
        forceDisconnect(): void
        /**
       * Gets currently set Cast content metadata or `null` if none is set.
       */
        getContentMetadata(): clpp.cast.CastUtils.SenderMetadataObject|null
        /**
       * Gets name of currently connected receiver.
       */
        getReceiverName(): string
        /**
       * Checks if we are currently casting.
       */
        isCasting(): boolean
        /**
       * Remove message listener to 'urn:x-cast:castlabs' namespace.
       */
        removeMessageListener(listener: Function): void
        /**
       * Sends custom message to chromecast receiver.
       *
       * @param message message to send.
       */
        sendMessage(message: Object|string): Promise<void>
        /**
       * Set the Cast content's artist.
       * Also sets the metadata type to music track.
       * You should set metadata before calling cast/load.
       */
        setContentArtist(artist: string): void
        /**
       * Set the Cast content's thumbnail image.
       * You should set metadata before calling cast/load.
       */
        setContentImage(imageUrl: string): void
        /**
       * Set Cast content metadata to one of the `chrome.cast.media.*Metadata`
       * objects (See {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media#.MetadataType}),
       * or clear it by passing `null`.
       * Note: You must set content metadata before calling cast/load, otherwise
       * it will have no effect. Correctly setting metadata is crucial for some
       * functionalities, especially for live streams, to work correctly.
       *
       * @param metadata A Cast metadata object, one of the `chrome.cast.media.*Metadata` objects
       *   (See {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media#.MetadataType})
       *   or `null` to clear the metadata.
       */
        setContentMetadata(metadata: clpp.cast.CastUtils.SenderMetadataObject|null): void
        /**
       * Set the Cast content's release date.
       * Given string must be compliant with ISO 8601 (YYYY-MM-DD).
       * You should set metadata before calling cast/load.
       */
        setContentReleaseDate(date: string): void
        /**
       * Set the Cast content's title.
       * You should set metadata before calling cast/load.
       */
        setContentTitle(title: string): void
        /**
       * Gives a possibility to intercept player configuration during casting to
       * modify it if necessary. Intercepting function takes player config as an
       * argument. Function should return new configuration in synchronous or
       * asynchronous way. If nothing is returned, player will use original config.
       *
       * @example 
       *
       * castProxy.setPlayerConfigInterceptor(async (config) => {
       *   // use your business logic to obtain new authToken
       *   const authToken = await getAuthTokenForContent(config);
       *   config.drm.customData.authToken = authToken;
       *   return config;
       * });
       */
        setPlayerConfigInterceptor(interceptor: clpp.cast.CastUtils.PlayerConfigInterceptor|null): void
      }
    
      export class CastUtils {
      
      }
    
      export class Receiver {
      /**
       * Add custom message listener to 'urn:x-cast:castlabs' namespace.
       *
       * @param listener custom message listener.
       */
        addMessageListener(listener: Function): void
        /**
       * Get a Cast metadata object set by user, one of the
       * `cast.framework.messages.*MediaMetadata` objects.
       */
        getContentMetadata(): clpp.cast.CastUtils.ReceiverMetadataObject|null
        /**
       * Returns singleton instance of cast receiver.
       */
        static getInstance(): clpp.cast.Receiver
        /**
       * Binds instance of player to cast receiver. Ideally this should be called
       * before invoking `start()`.
       *
       * @param player player instance.
       */
        init(player: clpp.Player): void
        /**
       * Checks if Cast API is available and receiver is ready to handle casting.
       */
        isApiReady(): boolean
        /**
       * Remove listener to cast system events.
       * Event type should be one of {@link https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.system#.EventType | cast.framework.system.EventType}.
       */
        off(type: any, handler: Function): void
        /**
       * Add listener to cast system events.
       * Event type should be one of {@link https://developers.google.com/cast/docs/reference/web_receiver/cast.framework.system#.EventType | cast.framework.system.EventType}.
       */
        on(type: any, handler: Function): void
        /**
       * Remove custom message listener to 'urn:x-cast:castlabs' namespace.
       *
       * @param listener custom message listener.
       */
        removeMessageListener(listener: Function): void
        /**
       * Send custom message through 'urn:x-cast:castlabs' namespace.
       *
       * @param message message to send,
       * @param senderId sender id. If not set, message will be
       *   broadcasted to all connected senders.
       */
        sendMessage(message: any, senderId?: string): void
        /**
       * Gives a possibility to intercept a `LoadRequestData` instance before
       * passing it to Chromecast. Interceptor function takes load request data as
       * an argument. Function may return modified load request data in synchronous
       * or asynchronous way. If nothing is returned, player will use original
       * reference.
       *
       * @example 
       *
       * // Add embedded ads to media
       * receiver.setLoadRequestDataInterceptor((loadRequestData) => {
       *   const mediaInfo = loadRequestData.media;
       *   mediaInfo.breakClips = [
       *     {
       *       id: 'bc1',
       *       title: third_party.getBreakClipTitle('bc1'),
       *       posterUrl: third_party.getBreakClipPosterUrl('bc1'),
       *       duration: third_party.getBreakClipDuration('bc1')
       *     },
       *     {
       *       id: 'bc2',
       *       ...
       *     },
       *     {
       *       id: 'bc3',
       *       ...
       *     },
       *     {
       *       id: 'bc4',
       *       ...
       *     }
       *   ];
       *   mediaInfo.breaks = [
       *     {
       *       id: 'b1',
       *       breakClipIds: ['bc1', 'bc2'],
       *       position: 0,
       *       isEmbedded: true
       *     },
       *     {
       *       id: 'b2',
       *       breakClipIds: ['bc3', 'bc4'],
       *       position: 10 * 60,
       *       isEmbedded: true
       *     }
       *   ];
       * 
       *   return loadRequestData;
       * });
       */
        setLoadRequestDataInterceptor(interceptor: clpp.cast.CastUtils.LoadRequestDataInterceptor|null): void
        /**
       * Gives a possibility to intercept player configuration during casting to
       * modify it if necessary. Intercepting function takes player config as an
       * argument. Function should return new configuration in synchronous or
       * asynchronous way. If nothing is returned, player will use original config.
       *
       * @example 
       *
       * receiver.setPlayerConfigInterceptor(async (config) => {
       *   // use your business logic to obtain new authToken
       *   const authToken = await getAuthTokenForContent(config);
       *   config.drm.customData.authToken = authToken;
       *   return config;
       * });
       */
        setPlayerConfigInterceptor(interceptor: clpp.cast.CastUtils.PlayerConfigInterceptor|null): void
        /**
       * Starts receiver application.
       */
        start(): void
        /**
       * Shutdown receiver application and removes bound player instance.
       */
        stop(): void
      }
    
      namespace CastUtils {
      /**
       * Callback function used to modify load request data before play.
       * Intercepting function shall take
       * `cast.framework.messages.LoadRequestData` as an argument and return
       * modified `cast.framework.messages.LoadRequestData` in synchronous or
       * asynchronous way.
       */
        export type LoadRequestDataInterceptor = Function
      
        /**
       * Callback function used to modify player config before play. It can be used
       * both on sender and receiver side. Intercepting function shall take
       * {@link clpp.PlayerConfiguration} as an argument and return modified
       * {@link clpp.PlayerConfiguration} in synchronous or asynchronous way.
       */
        export type PlayerConfigInterceptor = Function
      
        /**
       * Union type helper for describing one of the metadata objects used by Google
       * Cast SDKs. Describes the media content. When used on the Cast Web Receiver
       * the value should be one of the `cast.framework.messages.*MediaMetadata`
       * objects. See:
       * 
       * {@link https://developers.google.com/cast/docs/reference/caf_receiver/cast.framework.messages#.MetadataType}
       * 
       * Use {@link clpp.cast.CastUtils.SenderMetadataObject} instead for the Cast
       * Web Sender.
       */
        export type ReceiverMetadataObject = any
      
        /**
       * Union type helper for describing one of the metadata objects used by Google
       * Cast SDKs. Describes the media content. When used on the Cast Web Sender
       * the value should be one of the `chrome.cast.media.*Metadata` objects. See:
       * 
       * {@link https://developers.google.com/cast/docs/reference/web_sender/chrome.cast.media#.MetadataType}
       * 
       * Use {@link clpp.cast.CastUtils.ReceiverMetadataObject} instead for the Cast
       * Web Receiver.
       */
        export type SenderMetadataObject = any
      }
    }
  
    namespace conviva {
      export class ConvivaPlugin {
        static Id: string
        /**
       * Report app event.
       * Use this API to report any Global Events associated to application (not
       * associated to playback).
       *
       * @example 
       *
       * const conviva = player.getPlugin(clpp.conviva.ConvivaPlugin.Id);
       * 
       * if (conviva) {
       *   const eventType = 'share-click';
       *   const eventDetail = {
       *     location: 'Toolbar',
       *     shareService: 'Facebook'
       *   };
       * 
       *   conviva.reportAppEvent(eventType, eventDetail);
       * }
       */
        reportAppEvent(eventType: string, opt_eventDetail?: Object): boolean
      }
    }
  
    namespace crypto {
      export class CryptoComponent {
      
      }
    }
  
    namespace dash {
      export class DashComponent {
      
      }
    }
  
    namespace drm {
    /**
     * Callback function that can be used to extract the Fairplay Content ID.
     * It takes the current {@link clpp.extern.PlayerConfiguration}, `initData` and
     * a {@link clpp.drm.SessionContext}. Returns an extracted Content ID string.
     * This callback needs to be created only if you are using custom DRM
     * environment and your Fairplay server expects different Content ID than
     * that defined in default Apple implementation. If not provided, the default
     * method will be used to extract the Content ID
     * (see {@link clpp.utils.FairplayUtils.extractContentId}).
     * For DRMtoday the |SDK| automatically provides an implementation for this
     * callback.
     * If DRMtoday is a backend then the default implementation returns the content
     * ID as:
     * `
     * ?assetId=foo&variantId=bar
     * `
     * Asset ID and variant ID should be defined in the initData, however they can
     * be also defined in the configuration and in this case have higher precedence
     * than those extracted from initData.
     * If DRMtoday is not a backend then the default implementation returns the
     * hostname part from HLS `#EXT-X-KEY:URI`.
     * E.g. if FPS encrypted playlist has the HLS #EXT-X-KEY tag:
     * ``#EXT-X-KEY:METHOD=SAMPLE-AES,URI="skd://d192ebad-5097",
     * KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"
     * ``
     * then the Content ID will be:
     * `
     * d192ebad-5097
     * `
     * You can also use `customData` object in the {@link clpp.drm.SessionContext}
     * to pass some additional data to license request/response modifiers if needed.
     */
      export type ContentIdExtractor = Function
    
      /**
     * A function that takes the current {@link clpp.PlayerConfiguration},
     * a {@link clpp.net.Request} and {@link clpp.SessionContext}. It is
     * permitted to modify the requests' properties and use context to pass some
     * additional data between requests & responses. It is also permitted to return
     * a promise; in this case, the promise will be resolved first before the
     * modifier chain continues.
     */
      export type DrmRequestModifier = Function
    
      /**
     * A function that takes the current {@link clpp.PlayerConfiguration},
     * a {@link clpp.net.Response} and {@link clpp.SessionContext}. It is
     * permitted to modify the responses' properties and use context to pass some
     * additional data between requests & responses. It is also permitted to return
     * a promise; in this case, the promise will be resolved first before the
     * modifier chain continues.
     */
      export type DrmResponseModifier = Function
    
      /**
     * A function that takes the {@link clpp.InitDataTransformerParams} object
     * which provides:
     * 
     * initData and initDataType from `encrypted` event;
     * the current player configuration ({@link clpp.PlayerConfiguration});
     * the current DRM system configuration
     * ({@link clpp.drm.DrmSystemConfiguration});
     * the current DRM info ({@link clpp.DrmInfo});
     * the current session context ({@link clpp.SessionContext}) which could
     * be used to get and store some customData for later use within
     * licenseRequest and/or licenseResponse modifiers.
     * 
     * It should return valid initData to pass to the currently used CDM to generate
     * a license request.
     */
      export type InitDataTransformer = Function
    
      /**
     * A set of modifier functions that can be added to the DRM system.
     */
      export type LicenseModifiers = {
      /**
       * A callback function that will be triggered to prepare the certificate
       * request.
       */
        certificateRequest?: clpp.drm.DrmRequestModifier
        /**
       * A callback function that will be triggered to interpret the certificate
       * response.
       */
        certificateResponse?: clpp.drm.DrmResponseModifier
        /**
       * A callback function that will be triggered to extract the Content ID.
       * (only used with Fairplay DRM)
       */
        extractContentId?: clpp.drm.ContentIdExtractor
        /**
       * A callback function that will be triggered before the request.
       */
        licenseRequest?: clpp.drm.DrmRequestModifier
        /**
       * A callback function that will be triggered with the response.
       */
        licenseResponse?: clpp.drm.DrmResponseModifier
        /**
       * A callback function that will be triggered to transform init data from
       * the manifest/media before it is passed to the browser's CDM.
       */
        transformInitData?: clpp.drm.InitDataTransformer
      }
    
      /**
     * Key system identifiers for various DRM systems.
     */
      export enum KeySystem {
      /**
       * Placeholder for empty / unspecified key system
       */
        NONE = 'none',
        /**
       * DRM Key system identifier for Clear Key
       */
        CLEAR_KEY = 'org.w3.clearkey',
        /**
       * DRM Key system identifier for Widevine
       */
        WIDEVINE = 'com.widevine.alpha',
        /**
       * DRM Key system identifier for Playready
       */
        PLAYREADY = 'com.microsoft.playready',
        /**
       * DRM Key system identifier for Fairplay
       */
        FAIRPLAY = 'com.apple.fps',
        /**
       * DRM Key system identifier for Primetime
       */
        PRIMETIME = 'com.adobe.primetime',
      }
    
      /**
     * Robustness levels used for Playready DRM.
     */
      export enum PlayreadyRobustnessLevel {
      /**
       * For clients under development or under test.
       * Not suitable for commercial content in a commercial scenario.
       */
        SL150 = '150',
        /**
       * Software security level.
       */
        SL2000 = '2000',
        /**
       * Hardware security level.
       */
        SL3000 = '3000',
      }
    
      /**
     * Robustness levels used for Widevine DRM.
     */
      export enum WidevineRobustnessLevel {
      /**
       * EME Level 1, Widevine Level 3
       */
        SW_SECURE_CRYPTO = 'SW_SECURE_CRYPTO',
        /**
       * EME Level 2, Widevine Level 3
       */
        SW_SECURE_DECODE = 'SW_SECURE_DECODE',
        /**
       * EME Level 3, Widevine Level 2
       */
        HW_SECURE_CRYPTO = 'HW_SECURE_CRYPTO',
        /**
       * EME Level 4, Widevine Level 1
       */
        HW_SECURE_DECODE = 'HW_SECURE_DECODE',
        /**
       * EME Level 5, Widevine Level 1
       */
        HW_SECURE_ALL = 'HW_SECURE_ALL',
      }
    
      export class DrmEnvironment {
        constructor(name: string)
        setDrmSystem(systemName: clpp.drm.KeySystem, drmSystem: clpp.PlayreadyDrmSystem|clpp.FairplayDrmSystem|clpp.WidevineDrmSystem): void
      }
    
      export class HeaderDrm {
      /**
       * @param wvLicenseUrl The Widevine License URL
       * @param prLicenseUrl The PlayReady License URL
       * @param fpLicenseUrl The FairPlay License URL
       * @param fpCertificateUrl The FairPlay Certificate URL
       * @param fpContentIdStrategy The strategy of FairPlay content ID extraction
       */
        constructor(wvLicenseUrl: string, prLicenseUrl: string, fpLicenseUrl: string, fpCertificateUrl: string, fpContentIdStrategy: clpp.drm.HeaderDrm.FairPlayContentIdStrategy)
        /**
       * The name of the DRM environment.
       */
        static NAME: string
        /**
       * Extracts the content ID accordingly to the
       * {@link clpp.drm.HeaderDrm.FairPlayContentIdStrategy}.
       * Override this method if you need a custom behavior.
       *
       * @param playerConfig The player configuration
       * @param initData The init data
       */
        extractFairPlayContentId(playerConfig: clpp.PlayerConfiguration, initData: Uint8Array): string
        /**
       * Appends custom headers and adds the SPC as a form-data payload.
       *
       * @param playerConfig The player configuration
       * @param request The request
       */
        onFairPlayLicenseRequest(playerConfig: clpp.PlayerConfiguration, request: clpp.net.Request): void
        /**
       * Removes CKC tags from the response if needed.
       *
       * @param playerConfig The player configuration
       * @param response The response
       */
        onFairPlayLicenseResponse(playerConfig: clpp.PlayerConfiguration, response: clpp.net.Response): void
        /**
       * Appends custom headers.
       *
       * @param playerConfig The player configuration
       * @param request The request
       */
        onLicenseRequest(playerConfig: clpp.PlayerConfiguration, request: clpp.net.Request): void
      }
    
      export class HeaderDrmComponent {
      
      }
    
      namespace DrmToday {
      /**
       * DRMtoday environments.
       * 
       * Use these constants to specify which DRMtoday environment you are using
       * when preparing the player for DRM protected playback with DRMtoday
       */
        export enum Environment {
        /**
         * The DRMtoday production environment.
         */
          PRODUCTION = 'PRODUCTION',
          /**
         * The DRMtoday staging environment.
         */
          STAGING = 'STAGING',
          /**
         * The DRMtoday test environment.
         */
          TEST = 'TEST',
        }
      
        /**
       * DRMtoday Widevine Server Certificates.
       * 
       * Use these constants to specify a specific DRMtoday Widevine Server
       * Certificate to be used.
       */
        export enum WidevineCertificates {
        /**
         * The DRMtoday widevine certificate version 1 for the production environment
         */
          V1_PROD = 'V1_PROD',
          /**
         * The DRMtoday widevine certificate version 1 for the staging environment
         */
          V1_STAGING = 'V1_STAGING',
          /**
         * The DRMtoday widevine certificate version 2
         */
          V2 = 'V2',
        }
      }
    
      namespace HeaderDrm {
      /**
       * Strategy of the FairPlay content ID extraction.
       */
        export enum FairPlayContentIdStrategy {
        /**
         * Extract the hostname from the SKD URL.
         */
          HOSTNAME = 'hostname',
          /**
         * Pass the full SKD URL.
         */
          FULL_SKD = 'full-skd',
        }
      }
    
      namespace eme {
        export class EmeFactory {
        
        }
      
        namespace EmeFactory {
        /**
         * Existing EME Managers implementations.
         */
          export enum Apis {
          /**
           * Standard EME manager. Built on top of current EME standard.
           */
            STANDARD = 'STANDARD',
            /**
           * EME manager based on Apple-prefixed EME implementation. Used by default
           * on Apple devices.
           */
            APPLE = 'APPLE',
            /**
           * EME manager built on version v0.1b of EME standard. Used by default only
           * when necessary (i.e. on old Tizen / WebOS devices).
           */
            WEBKIT = 'WEBKIT',
            /**
           * Manager made to fulfill EME API on non-supported platforms. Shall not be
           * used intentionally.
           */
            NOP = 'NOP',
          }
        }
      }
    }
  
    namespace events {
    /**
     * A container that holds information about a bitrate change event.
     * The object is send with
     * {@link clpp.events#BITRATE_CHANGED|BITRATE_CHANGED} events.
     */
      export type BitrateChangeDetails = {
      /**
       * The bandwidth (in bps) of the currently playing rendition. Note that this
       * information might not always be available.
       */
        bandwidth: number|null
        /**
       * The height in pixel of the currently playing video rendition.
       */
        height: number
        /**
       * The video rendition if one could be found.
       */
        rendition: clpp.Rendition|null
        /**
       * The width in pixel of the currently playing video rendition.
       */
        width: number
      }
    
      /**
     * Container object that contains meta-data for a buffering event.
     * The object is send with
     * {@link clpp.events.BUFFERING_STARTED|BUFFERING_STARTED} and
     * {@link clpp.events.BUFFERING_ENDED|BUFFERING_ENDED} events. Please
     * note that the bufferedTimeMs will be -1 for a CLPP_BUFFERING_STARTED event.
     */
      export type BufferingDetails = {
      /**
       * The time the player spend in buffering state or -1 for
       * BUFFERING_STARTED events
       */
        bufferedTimeMS: number
        /**
       * One of the {@link clpp.events.BufferingReasons|BufferingReasons}
       * constants that indicate the reason for the buffering event
       */
        reason: number
      }
    
      /**
     * Container object that is send with state change events.
     */
      export type StateChangeDetails = {
      /**
       * The current player state.
       */
        currentState: clpp.Player.State
        /**
       * The previous player state.
       */
        previousState: clpp.Player.State
        /**
       * Optional reason for the state transition. This is set for transitions into
       * the BUFFERING state, in which case the value is one of
       * {@link clpp.events.BufferingReasons|BufferingReasons}.
       */
        reason?: number
        /**
       * The time since the last state change event.
       */
        timeSinceLastStateChangeMS: number
      }
    
      /**
     * Container object that covers video track changed and information about the
     * currently selected.
     * The object is send with
     * {@link clpp.events#VIDEO_TRACK_CHANGED|VIDEO_TRACK_CHANGED}
     * events.
     */
      export type VideoTrackChangeDetails = {
      /**
       * True if the track change was triggered by the ABR algorithm, false for
       * manual track selections.
       */
        abrSelection: boolean
        /**
       * The bandwidth (in bps) of the currently playing rendition. Note that this
       * information might not always be available.
       */
        bandwidth: number|null
        /**
       * The height in pixel of the currently playing video rendition.
       */
        height: number
        /**
       * The vide track if one could be found for the currently playing rendition.
       */
        track: clpp.Track
        /**
       * The width in pixel of the currently playing video rendition.
       */
        width: number
      }
    
      /**
     * Constants that express the reason why the player transitioned in to the
     * {@link clpp.Player.State#BUFFERING|BUFFERING} state.
     */
      export enum BufferingReasons {
      /**
       * The player is buffering because of a seek event
       */
        SEEKING = 1,
        /**
       * The player is buffering because not enough data is available
       */
        NO_DATA = 2,
      }
    }
  
    namespace freewheel {
      export class FreeWheelPlugin {
      /**
       * ID of the ad container.
       */
        static AD_CONTAINER_ID: string
        /**
       * FreeWheel plugin ID.
       */
        static Id: string
        /**
       * Gets the ad container.
       */
        getAdContainer(): Element|null
        /**
       * Gets the video element from the ad container.
       */
        getAdVideo(): HTMLVideoElement|null
      }
    }
  
    namespace hls {
      export class HlsComponent {
      
      }
    }
  
    namespace hlssmpte {
      export class HlsSmptePlugin {
        static Id: string
      }
    }
  
    namespace htmlcue {
      export class HtmlCueComponent {
      
      }
    
      export class HtmlTextDisplayer {
        constructor(player: clpp.Player)
        /**
       * Append given text cues to the list of cues to be displayed.
       *
       * @param cues Text cues to be appended.
       * @param styles Styles to be applied.
       */
        append(cues: Array<clpp.text.Cue>, styles: Array<string>): void
        /**
       * Request that this object be destroyed, releasing all resources.
       * It also shuts down all active operations.
       * Returns a Promise which is resolved when destruction
       * is complete. This Promise should never be rejected.
       */
        destroy(): Promise<void>
        /**
       * Returns true if text is currently visible.
       */
        isTextVisible(): boolean
        /**
       * Remove all cues in a time range.
       * Removes all cues that are fully contained by the given time range (relative
       * to the presentation). |endTime| will be greater to equal to |startTime|.
       * |remove| should only return |false| if the displayer has been destroyed. If
       * the displayer has not been destroyed |remove| should return |true|.
       */
        remove(startTime: number, endTime: number): boolean
        /**
       * Set text visibility.
       */
        setTextVisibility(on: boolean): void
      }
    }
  
    namespace ima {
      export class ImaPlugin {
        static Id: string
        /**
       * Returns the instance of the ad container.
       */
        getAdContainer(): Element
        /**
       * Returns the instance of the ad display container.
       * {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdDisplayContainer | google.ima.AdDisplayContainer}
       */
        getAdDisplayContainer(): any
        /**
       * Returns the instance of the ads loader.
       * {@link https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side/reference/js/google.ima.AdsLoader | google.ima.AdsLoader}
       */
        getAdsLoader(): any
        /**
       * Check if Client Side IMA SDK is available.
       */
        static isSdkMissing(): boolean
      }
    }
  
    namespace log {
    /**
     * Implement an interceptor and add it using {@link clpp.log#addInterceptor}
     * to receive all calls to loggers on an application level.
     */
      export type LogInterceptor = Function
    
      /**
     * All available log levels
     */
      export enum Level {
      /**
       * Used for tag loggers to make them use the global log level
       */
        DEFAULT = -1,
        /**
       * All logging will be disabled.
       */
        NONE = 0,
        /**
       * Only errors will be logged.
       */
        ERROR = 1,
        /**
       * Errors and Warnings will be logged.
       */
        WARNING = 2,
        /**
       * Errors, Warnings and Info messages will be logged.
       */
        INFO = 3,
        /**
       * All logging messages will be permitted and logged.
       */
        DEBUG = 4,
      }
    
      export class Logger {
      /**
       * @param tag The optional tag. Tags should follow package
       *   names and used '.' to separate components. This will allow you to control
       *   the log levels of modules and components globally
       */
        constructor(tag?: string)
        /**
       * The logger tag
       */
        tag?: string
        /**
       * Returns a child logger the will extend this loggers tag.
       *
       * @param tag The logger tag extension
       */
        createChild(tag: string|undefined): clpp.log.Logger
        /**
       * Log debug messages.
       *
       * @param message The message(s) that will be sent to the console.
       */
        debug(...message: any[]): void
        /**
       * Log error messages.
       *
       * @param message The message(s) that will be sent to the console.
       */
        error(...message: any[]): void
        /**
       * Log info messages.
       *
       * @param message The message(s) that will be sent to the console.
       */
        info(...message: any[]): void
        /**
       * Log a message if the configured log level permits it. Note that if
       * multiple arguments are specified, this method will treat the
       * first argument as the log level
       *
       * @param level The log level of the message.
       *   If not specified, {@link clpp.log.Level.INFO} will be used
       * @param message The message arguments that
       *   will be sent to the console.
       */
        log(level?: clpp.log.Level, ...message: any[]): void
        /**
       * Log warning messages.
       *
       * @param message The message(s) that will be sent to the console.
       */
        warn(...message: any[]): void
      }
    }
  
    namespace muxdata {
      export class MuxDataPlugin {
        static Id: string
      }
    }
  
    namespace net {
    /**
     * Parameters for retrying requests.
     */
      export type AttemptParameters = {
      /**
       * The multiplier for successive retry delays.
       */
        backoffFactor: number
        /**
       * The delay before the first retry, in milliseconds.
       */
        baseDelay: number
        /**
       * List of http
       * status codes that will not trigger a retry and will be generally considered
       * fatal. This defaults to `clpp.net.DEFAULT_FATAL_STATUS_CODES`.
       */
        fatalStatusCodes?: Array<number>
        /**
       * The maximum amount of fuzz to apply to each retry delay.
       * For example, 0.5 means "between 50% below and 50% above the retry delay."
       */
        fuzzFactor: number
        /**
       * The maximum number of times the request should be attempted.
       */
        maxAttempts: number
        /**
       * The request timeout, in milliseconds.  Zero means "unlimited".
       */
        timeout: number
      }
    
      /**
     * Container object that contains information about a single download trace.
     * The object is send with
     * {@link clpp.events.DOWNLOAD_TRACE|DOWNLOAD_TRACE} events.
     */
      export type DownloadTrace = {
      /**
       * The current bandwidth estimation after the sample was pushed.
       */
        bandwidthEstimate: number
        /**
       * The calculated speed of the download in bps
       */
        bitrate: number
        /**
       * The type of the downloaded segment. One of 'audio', 'video', or 'text' if
       * known.
       */
        contentType: string
        /**
       * True if the downloaded segment was an init segment.
       */
        initSegment: boolean
        /**
       * The number of bytes downloaded
       */
        size: number
        /**
       * The download time in milliseconds
       */
        time: number
        /**
       * Either 'full' or 'partial'. Full trace events are posted after the entire
       * segment was downloaded while partial traces are posted during an ongoing
       * download.
       */
        type: string
      }
    
      export type Mp4Fragment = {
      /**
       * The number of mdat boxes in this fragment or
       * -1 if the number is unknown
       */
        count: number
        /**
       * The data
       */
        data: DataView
        /**
       * The end of this fragment
       */
        end: number
        /**
       * The length of the fragment
       */
        length: number
        /**
       * The start of this fragment
       */
        start: number
      }
    
      /**
     * Defines a network request. This is passed to one or more request filters
     * that may alter the request, for example the
     * {@link clpp.drm.LicenseModifiers.licenseRequest}.
     */
      export type Request = {
      /**
       * Make requests with credentials.  This will allow cookies in cross-site
       * requests.  See {@link http://goo.gl/YBRKPe}
       */
        allowCrossSiteCredentials: boolean
        /**
       * The multiplier for successive retry delays.
       */
        backoffFactor: number
        /**
       * The delay before the first retry, in milliseconds.
       */
        baseDelay: number
        /**
       * The body of the request.
       * Use `clpp.utils.ab2str` to convert data to text
       * and `clpp.utils.str2ab` to convert data back to ArrayBuffer.
       */
        body: ArrayBuffer|null
        /**
       * Loaded bytes of this request or -1 if
       * unknown
       */
        bytesLoaded: number|null
        /**
       * Remaining bytes of this request or -1 if
       * unknown
       */
        bytesRemaining: number|null
        /**
       * Total bytes of this request or -1 if
       * unknown
       */
        bytesTotal: number|null
        /**
       * The media content type or null
       */
        contentType: string|null
        /**
       * The current attempt
       */
        currentAttempt: number
        /**
       * Disable support for fragment
       * parsing
       */
        disableFragmentSupport: boolean|null
        /**
       * Disable support for merged
       * fragments
       */
        disableMergedFragments: boolean|null
        /**
       * The media end time or null
       */
        endTime: number|null
        /**
       * List of http
       * status codes that will not trigger a retry and will be considered
       * fatal.
       */
        fatalStatusCodes?: Array<number>
        /**
       * The maximum amount of fuzz to apply to each retry delay.
       * For example, 0.5 means "between 50% below and 50% above the retry delay."
       */
        fuzzFactor: number
        /**
       * A mapping of headers for the request.  e.g.: {'HEADER': 'VALUE'}
       */
        headers: Record<string, string>
        /**
       * The license request type for DRM
       * license requests
       */
        licenseRequestType: string|null
        /**
       * The maximum number of times the request should be attempted.
       */
        maxAttempts: number
        /**
       * The HTTP method to use for the request.
       */
        method: string
        /**
       * The progress callback
       */
        onFragment: Function|null
        /**
       * The progress
       * callback is called during the ongoing download.
       * It receives two parameters, the number of bytes of the progress chunk
       * and the time in milliseconds it took to download that chunk. The size and
       * time only refers to the chunk. If you want to get the numbers of the
       * overall progress, you can query {@link bytesLoaded},
       * {@link bytesRemaining} and {@link bytesTotal} of this request object.
       */
        onProgress: Function
        /**
       * Add a rate limit to the download speed. Note
       * that this is for debug purposes only and artificially delays the download
       * but can not actually rate limit the connection.
       */
        rateLimitBps: number|null
        /**
       * The list
       * of request modifiers that will be applied to this request
       */
        requestModifiers: Array<clpp.net.RequestModifier>
        /**
       * The list
       * of request modifiers that will be applied to this request
       */
        responseModifiers: Array<clpp.net.ResponseModifier>
        /**
       * If this is a LICENSE request, this field contains the session ID of the
       * EME session that made the request.
       */
        sessionId: string|null
        /**
       * The media start time or null
       */
        startTime: number|null
        /**
       * The request timeout, in milliseconds.  Zero means "unlimited".
       */
        timeout: number
        /**
       * The media timescale or null
       */
        timescale: number|null
        /**
       * The request type
       */
        type: clpp.net.RequestType
        /**
       * The uri index into the array of URIs
       */
        uriIndex: number
        /**
       * An array of URIs to attempt.
       * They will be tried in the order they are given.
       */
        uris: Array<string>
      }
    
      /**
     * A function is passed the mutable {@link clpp.net.Request} object of a
     * subsequent download.
     * A request modifier can return a promise; in which case, the promise will have
     * to resolve first before the modifiers chain continues. If the modifier
     * promise rejects, the download is cancelled and the player will dispatch an
     * error accordingly.
     */
      export type RequestModifier = Function
    
      /**
     * Defines a response object. This includes the response data and header info.
     * This is passed to response filters before being returned from the
     * request call, for example
     * {@link clpp.drm.LicenseModifiers.licenseResponse}.
     * 
     *  Note: If a player and a stream are hosted on different
     *  domains, then a user agent makes a cross-origin HTTP request. In order to
     *  make headers accessible by a browser, please add both
     *  `Access-Control-Expose-Headers` and
     *  `Access-Control-Allow-Headers` to the response headers.
     * 
     */
      export type Response = {
      /**
       * The body of the response.
       * Use `clpp.utils.ab2str` to convert data to text and `clpp.utils.str2ab` to
       * convert data back to ArrayBuffer.
       */
        data: ArrayBuffer|null
        /**
       * Optional. If true, this response was from a cache and should be ignored
       * for bandwidth estimation.
       */
        fromCache?: boolean
        /**
       * A map of response headers, if supported by the underlying protocol.
       * All keys should be lowercased.
       * For HTTP/HTTPS, may not be available cross-origin.
       */
        headers: Record<string, string>
        /**
       * The associated request
       */
        request?: clpp.net.Request
        /**
       * The HTTP status code
       */
        status?: number
        /**
       * Optional.  The time it took to get the response, in milliseconds.  If not
       * given, NetworkingEngine will calculate it using Date.now.
       */
        timeMs?: number
        /**
       * The URI which was loaded. Request filters and server redirects can cause
       * this to be different from the original request URIs.
       */
        uri: string
      }
    
      /**
     * A function that is passed the mutable {@link clpp.net.Response} object of a
     * completed download.
     * A response modifier can return a promise; in which case, the promise will
     * have to resolve first before the modifiers chain continues. If the modifier
     * promise rejects the download is considered a failure and the player will
     * dispatch an error accordingly.
     */
      export type ResponseModifier = Function
    
      /**
     * Requests types that are used to identify requests and responses
     * in modifiers.
     */
      export enum RequestType {
        MANIFEST = 1,
        SEGMENT = 2,
        LICENSE = 3,
        APP = 4,
        TIMING = 5,
        OTHER = 6,
      }
    
      export class NetworkEngine {
      /**
       * Registers callbacks for to modify network requests.
       * You can use this to intercept and manipulate the network requests for
       * manifest and segment downloads. For example, use this if you need to add
       * additional headers or query parameters to the request.
       * These requests can be removed through the
       * {@link clpp.net.NetworkEngine#removeRequestModifier} function.
       * Note that fetching HLS data on Safari is not handled by NetworkEngine and
       * thus request modifiers will not be called.
       *
       * @param callback The function which is
       *   called when a network requests is fired. It allows the modification of the
       *   request before it's sent to the server
       *
       * @example 
       *
       * let player = new clpp.Player(...);
       *  ...
       * let networkEngine = player.getNetworkEngine();
       * 
       * networkEngine.addRequestModifier(function (request) {
       *   if (request.type === clpp.net.RequestType.MANIFEST) {
       *     console.log('Manifest request ...', request.uris);
       *   } else if (request.type === clpp.net.RequestType.SEGMENT) {
       *     console.log('Segment request ...');
       *     // E.g. add a custom header
       *     request.headers['custom-header'] = 'custom-value';
       *   }
       * });
       */
        addRequestModifier(callback: clpp.net.RequestModifier): void
        /**
       * It registers callbacks for manifest and segment download responses.
       * You can use this to intercept and manipulate the network responses for
       * manifest and segment downloads. For example, use this if you need to adjust
       * fetched data.
       * These responses can be removed through the
       * {@link clpp.net.NetworkEngine#removeResponseModifier} function.
       * Note that fetching HLS data on Safari is not handled by NetworkEngine and
       * thus response modifiers will not be called.
       *
       * @param callback The function which is
       *   called when a network response is fired. It allows the modification of the
       *   response before it's processed.
       *
       * @example 
       *
       * let player = new clpp.Player(...);
       *  ...
       * let networkEngine = player.getNetworkEngine();
       * 
       * networkEngine.addResponseModifier(function (response) {
       *   if (response.request.type === clpp.net.RequestType.MANIFEST) {
       *     console.log('Manifest response ...');
       *   } else if (response.request.type === clpp.net.RequestType.SEGMENT) {
       *     console.log('Segment response ...');
       *   }
       *   console.log('Associated request', response.request);
       * });
       */
        addResponseModifier(callback: clpp.net.ResponseModifier): void
        fetch(request: clpp.net.Request): Promise<clpp.net.Response>
        /**
       * Unregisters network requests added by the
       * {@link clpp.net.NetworkEngine#addRequestModifier} function.
       *
       * @param callback A reference to the
       *   function that was previously registered
       *
       * @example // Unregistering a network request
       *
       * let player = new clpp.Player(...);
       * 
       * function myNetworkRequest (request) {
       *   console.log('A network request!');
       * }
       * 
       * let networkEngine = player.getNetworkEngine();
       * 
       * // registering the request
       * networkEngine.addRequestModifier(myNetworkRequest);
       * 
       * ...
       * // removing the network request
       * networkEngine.removeRequestModifier(myNetworkRequest);
       */
        removeRequestModifier(callback: clpp.net.RequestModifier): void
        /**
       * Unregisters network responses added by the
       * {@link clpp.net.NetworkEngine#addResponseModifier} function.
       *
       * @param callback A reference to the
       *   function that was previously registered
       *
       * @example // Unregistering a network response
       *
       * let player = new clpp.Player(...);
       * 
       * function myNetworkResponse (response) {
       *   console.log('A network response!');
       * }
       * 
       * let networkEngine = player.getNetworkEngine();
       * 
       * // registering the response
       * networkEngine.addRequestModifier(myNetworkResponse);
       * 
       * ...
       * // removing the network response
       * networkEngine.removeRequestModifier(myNetworkResponse);
       */
        removeResponseModifier(callback: clpp.net.ResponseModifier): void
        /**
       * Set a rate limit in bits per second.
       * Note that this is intended for debug purposes only.
       * The setting will only affect the next request.
       *
       * @param limitBps rate limit in bits per second, pass
       *   a value <= 0 to disable the rate limit.
       */
        setRateLimit(limitBps: number): void
      }
    }
  
    namespace npaw {
      export class YouboraPlugin {
        static Id: string
        /**
       * Gives access to the underlying Youbora Adapter.
       * Can be used i.e. to emit custom errors using `fireError(code, message)` or
       * `fireFatalError(code, message)` or to emit specific events.
       * Use it with caution and only if you know what you are doing, as it might
       * break integration.
       * For more details, check Youbora Documentation.
       */
        getAdapter(): any|null
        /**
       * Gives access to the underlying Youbora Ads Adapter.
       * Can be used i.e. to emit custom errors using `fireError(code, message)` or
       * `fireFatalError(code, message)` or to emit specific events.
       * Use it with caution and only if you know what you are doing, as it might
       * break integration.
       * For more details, check Youbora Documentation.
       */
        getAdsAdapter(): any|null
        /**
       * Sets Youbora Plugin.
       * Use it before playback if you want to use Castlabs
       * Player with Youbora Sessions.
       * Options added in player configuration will be passed to Youbora Plugin.
       *
       * @example 
       *
       * const plugin = new youbora.Plugin({
       *   // your custom options
       * });
       * const player = new clpp.Player('video', {
       *   license: '...',
       *   youbora: {
       *     accountCode: 'account_code',
       *   },
       * });
       * player.use(clpp.dash.DashComponent);
       * player.getPlugin(clpp.npaw.YouboraPlugin.Id).setYouboraPlugin(plugin);
       * 
       * // Now you can start playback.
       * player.load('http://example.com/Manifest.mpd');
       */
        setYouboraPlugin(plugin: any|null): void
      }
    }
  
    namespace onboard {
      export class OnboardComponent {
      
      }
    }
  
    namespace persistent {
      export interface ISessionStorage {
      
      }
    
      /**
     * Offline DRM session information. This information is needed in order to
     * load a persistent media key session for re-use.
     */
      export type SessionInfo = {
      /**
       * A list of supported audio type and capability pairs.
       */
        audioCapabilities: Array<MediaKeySystemMediaCapability>
        /**
       * The DRM configuration.
       */
        drmConfig: clpp.DrmConfiguration
        /**
       * The key system, e.g., "com.widevine.alpha".
       */
        keySystem: clpp.drm.KeySystem
        /**
       * The license server URI.
       */
        licenseServerUri: string
        /**
       * A key-system-specific server certificate used to encrypt license requests.
       */
        serverCertificate: Uint8Array
        /**
       * contains the session ids.
       */
        sessionIds: Array<string>
        /**
       * A list of supported video type and capability pairs.
       */
        videoCapabilities: Array<MediaKeySystemMediaCapability>
      }
    
      export class PersistentLicenseComponent {
      
      }
    }
  
    namespace smooth {
      export class SmoothComponent {
      
      }
    }
  
    namespace text {
    /**
     * Defines the text track edge type.
     */
      export enum EdgeType {
      /**
       * No edge is displayed around text.
       */
        NONE = 'none',
        /**
       * Text is embossed on background.
       */
        RAISED = 'raised',
        /**
       * Text is debossed on background.
       */
        DEPRESSED = 'depressed',
        /**
       * A fading shadow is casted around text.
       */
        DROP_SHADOW = 'dropshadow',
        /**
       * A solid border is around text.
       */
        UNIFORM = 'uniform',
      }
    
      export class Cue {
        constructor(startTime: number, endTime: number, payload: string, payloadType?: clpp.text.Cue.payloadType)
        /**
       * Image background represented by any string that would be
       * accepted in image HTML element.
       * E. g. 'data:[mime type];base64,[data]'.
       */
        backgroundImage: string
        /**
       * Number of rows used to calculate base font size.
       */
        containerRows: number|null
        /**
       * CSS classes associated with the cue.
       */
        cssClassList: Array<string>
        /**
       * Text direction of the cue.
       */
        direction: clpp.text.Cue.direction
        /**
       * The end time of the cue in seconds, relative to the start of the
       * presentation.
       */
        endTime: number
        /**
       * Id of the cue.
       */
        id: string
        /**
       * The offset from the display box in either number of lines or
       * percentage depending on the value of lineInterpretation.
       */
        line: number|null
        /**
       * Line Alignment is set to start by default.
       */
        lineAlign: clpp.text.Cue.lineAlign
        /**
       * The way to interpret line field. (Either as an integer line number or
       * percentage from the display box).
       */
        lineInterpretation: clpp.text.Cue.lineInterpretation
        /**
       * The payload of the cue.
       */
        payload: string
        /**
       * The type of the cue payload.
       */
        payloadType: clpp.text.Cue.payloadType
        /**
       * The indent (in percent) of the cue box in the direction defined by the
       * writing direction.
       */
        position: number|null
        /**
       * Position alignment of the cue.
       */
        positionAlign: clpp.text.Cue.positionAlign|null
        /**
       * The region to render the cue into.
       */
        region: clpp.text.CueRegion|null
        /**
       * Size of the cue box (in percents).
       */
        size: number
        /**
       * The start time of the cue in seconds, relative to the start of the
       * presentation.
       */
        startTime: number
        /**
       * Alignment of the text inside the cue box.
       */
        textAlign: clpp.text.Cue.textAlign
        /**
       * Text writing mode of the cue.
       */
        writingMode: clpp.text.Cue.writingMode
      }
    
      export class CueRegion {
      /**
       * CSS classes associated with the region.
       */
        cssClassList: Array<string>
        /**
       * Set the captions at the bottom of the text container by default.
       */
        displayAlign: clpp.text.CueRegion.displayAlign|null
        /**
       * The width of the rendering area in heightUnits.
       */
        height: number
        /**
       * The units (percentage, pixels or lines) the region height is in.
       */
        heightUnits: clpp.text.CueRegion.units
        /**
       * Region identifier.
       */
        id: string
        /**
       * The X offset to start the rendering area in percentage (0-100) of
       * the region width.
       */
        regionAnchorX: number
        /**
       * The Y offset to start the rendering area in percentage (0-100) of
       * the region height.
       */
        regionAnchorY: number
        /**
       * If scroll=UP, it means that cues in the region will be added to
       * the bottom of the region and will push any already displayed cues in
       * the region up.
       * Otherwise (scroll=NONE) cues will stay fixed at the location
       * they were first painted in.
       */
        scroll: clpp.text.CueRegion.scrollMode
        /**
       * The units (percentage or pixels) the region viewportAnchors are in.
       */
        viewportAnchorUnits: clpp.text.CueRegion.units
        /**
       * The X offset to start the rendering area in anchorUnits of
       * the video width.
       */
        viewportAnchorX: number
        /**
       * The X offset to start the rendering area in anchorUnits of
       * the video height.
       */
        viewportAnchorY: number
        /**
       * The width of the rendering area in widthUnits.
       */
        width: number
        /**
       * The units (percentage or pixels) the region width is in.
       */
        widthUnits: clpp.text.CueRegion.units
        /**
       * Text writing mode of the cue.
       */
        writingMode: clpp.text.CueRegion.writingMode|null
      }
    
      namespace Cue {
        export enum direction {
          HORIZONTAL_LEFT_TO_RIGHT = 'ltr',
          HORIZONTAL_RIGHT_TO_LEFT = 'rtl',
        }
      
        export enum lineAlign {
          CENTER = 'center',
          START = 'start',
          END = 'end',
        }
      
        export enum lineInterpretation {
          LINE_NUMBER = 0,
          PERCENTAGE = 1,
        }
      
        export enum payloadType {
          TEXT = 'text',
          VTT_XML = 'vtt-xml',
          TTML_XML = 'ttml-xml',
        }
      
        export enum positionAlign {
          LEFT = 'line-left',
          RIGHT = 'line-right',
          CENTER = 'center',
          AUTO = 'auto',
        }
      
        export enum textAlign {
          LEFT = 'left',
          RIGHT = 'right',
          CENTER = 'center',
          START = 'left',
          END = 'right',
        }
      
        export enum writingMode {
          HORIZONTAL_TOP_TO_BOTTOM = 'horizontal-tb',
          VERTICAL_LEFT_TO_RIGHT = 'vertical-lr',
          VERTICAL_RIGHT_TO_LEFT = 'vertical-rl',
        }
      }
    
      namespace CueRegion {
      /**
       * Vertical alignments of the cues within their extents.
       * 'BEFORE' means displaying at the top of the captions container box, 'CENTER'
       * means in the middle, 'AFTER' means at the bottom.
       */
        export enum displayAlign {
          BEFORE = 'flex-end',
          CENTER = 'center',
          AFTER = 'flex-start',
        }
      
        export enum scrollMode {
          NONE = '',
          UP = 'up',
        }
      
        export enum units {
          PX = 0,
          PERCENTAGE = 1,
          LINES = 2,
        }
      
        export enum writingMode {
          HORIZONTAL_TOP_TO_BOTTOM = 'column-reverse',
          VERTICAL_LEFT_TO_RIGHT = 'row-reverse',
          VERTICAL_RIGHT_TO_LEFT = 'row',
        }
      }
    }
  
    namespace thumbnails {
      export class Thumbnail {
      /**
       * @param imageUrl The image URL
       * @param time The start time in seconds for this thumbnail
       * @param duration The duration in seconds for this thumbnail
       * @param opt_x The x coordinate in the source grid if the source
       *   is a grid
       * @param opt_y The y coordinate in the source grid if the source
       *   is a grid
       * @param opt_width The width of the thumbnail
       * @param opt_height The height of the thumbnail
       * @param opt_cols The number of columns in a grid
       * @param opt_rows The number of rows in a grid
       * @param opt_gridCol The column index in the grid
       * @param opt_gridRow The row index in the grid
       * @param imageElement optional ImageElement to use
       */
        constructor(imageUrl: string, time: number, duration: number, opt_x?: number, opt_y?: number, opt_width?: number, opt_height?: number, opt_cols?: number, opt_rows?: number, opt_gridCol?: number, opt_gridRow?: number, imageElement?: HTMLImageElement)
        /**
       * The duration of this thumbnail in seconds.
       */
        duration: number
        /**
       * The height of the target image.
       * This might not be set until the image is loaded.
       */
        height: number
        /**
       * The URL to the source image.
       * In case of gridded images this points to the grid image.
       * In case of container formats such as BIF, this is not specified
       */
        src: string
        /**
       * The start time of this thumbnail in seconds.
       */
        time: number
        /**
       * The width of the target image.
       * This might not be set until the image is loaded.
       */
        width: number
        /**
       * The x coordinate of the target image in case the thumb source is a grid.
       * This might not be set until the image is loaded.
       */
        x: number
        /**
       * The y coordinate of the target image in case the thumb source is a grid.
       * This might not be set until the image is loaded.
       */
        y: number
        /**
       * Returns a div element that represents the image.
       * You can pass optional width and height to scale the image.
       * If either width or height is undefined or 0, the image will be
       * scaled preserving the aspect ratio.
       * Make sure the image is loaded using
       * {@link clpp.thumbnails.Thumbnail#load|load()} before you call this method.
       *
       * @param opt_width The target width
       * @param opt_height The target height
       *
       * @example // Get an unscaled version of the element.
       *
       * let container = ...
       * thumbnail.load().then(() => {
       *  container.appendChild(thumbnail.element());
       * })
       *
       * @example // Scale both width and height. This will not preserve the aspect ratio.
       *
       * let container = ...
       * 
       * thumbnail.load().then(() => {
       *  container.appendChild(thumbnail.element(100, 80));
       * })
       *
       * @example // Scale to given width and preserve the aspect ratio.
       *
       * let container = ...
       * 
       * thumbnail.load().then(() => {
       *  container.appendChild(thumbnail.element(100));
       * })
       *
       * @example // Scale to given height and preserve the aspect ratio.
       *
       * let container = ...
       * 
       * thumbnail.load().then(() => {
       *  container.appendChild(thumbnail.element(0, 80));
       * })
       */
        element(opt_width?: number, opt_height?: number): HTMLElement
        /**
       * Returns a promise that resolves when the raw source image is loaded.
       * Call this method before you access the
       * {@link clpp.thumbnails.Thumbnail#raw|raw()} or
       * {@link clpp.thumbnails.Thumbnail#element|element()}.
       * The promise will resolve with the load thumbnail to simplify chaining.
       */
        load(): Promise<clpp.thumbnails.Thumbnail>
        /**
       * Returns the raw image element that holds the thumbnail source.
       * Please note that in case of gridded thumbnails, this is the raw
       * image grid. Make sure
       * the image is loaded using {@link clpp.thumbnails.Thumbnail#load|load()}
       * before you call this method.
       */
        raw(): HTMLImageElement
      }
    
      export class ThumbnailsPlugin {
      /**
       * The thumbnail plugin component ID to access the plugin via
       * {@link clpp.Player#getPlugin|player.getPlugin()}.
       */
        static Id: string
        /**
       * Request a thumbnail for the given media position in seconds.
       *
       * @param position The media position in seconds that the thumbnail
       *   is requested for.
       *
       * @example // Access the thumbnails plugin and add a thumbnail to a container element,
         scaling the thumbnail to a width of 180 pixel.
       *
       * let container = ... // Element that is used to host thumbnails
       * // You should null check that. It is only available if the plugin was
       * // loaded
       * let thumbsPlugin = player.getPlugin(clpp.thumbnails.ThumbnailsPlugin.Id);
       * 
       * // Get a thumbnail for 12 seconds
       * thumbsPlugin.get(12)
       *   .then(thumb => thumb.load())
       *   .then(thumb => thumb.element(180))
       *   .then(container.appendChild);
       */
        get(position: number): Promise<clpp.thumbnails.Thumbnail>
      }
    }
  
    namespace tizen {
      export class TizenComponent {
      
      }
    }
  
    namespace ttml {
      export class TtmlComponent {
      
      }
    }
  
    namespace utils {
      export class BufferUtils {
      /**
       * Compare two buffers for equality.  For buffers of different types, this
       * compares the underlying buffers as binary data.
       */
        static equal(arr1: BufferSource|null, arr2: BufferSource|null): boolean
        /**
       * Gets an ArrayBuffer that contains the data from the given TypedArray.  Note
       * this will allocate a new ArrayBuffer if the object is a partial view of
       * the data.
       */
        static toArrayBuffer(view: BufferSource): ArrayBuffer
        /**
       * Creates a DataView over the given buffer.
       */
        static toDataView(buffer: BufferSource, offset?: number, length?: number): DataView
        /**
       * Creates a new Int32Array view on the same buffer. This clamps the values to
       * be within the same view (i.e. you can't use this to move past the end of
       * the view, even if the underlying buffer is larger). However, you can pass a
       * negative offset to access the data before the view.
       */
        static toInt32Array(data: BufferSource, offset?: number, length?: number): Int32Array
        /**
       * Creates a new Uint16Array view on the same buffer. This clamps the values
       * to be within the same view (i.e. you can't use this to move past the end of
       * the view, even if the underlying buffer is larger). However, you can pass a
       * negative offset to access the data before the view.
       */
        static toUint16Array(data: BufferSource, offset?: number, length?: number): Uint16Array
        /**
       * Creates a new Uint32Array view on the same buffer. This clamps the values
       * to be within the same view (i.e. you can't use this to move past the end of
       * the view, even if the underlying buffer is larger). However, you can pass a
       * negative offset to access the data before the view.
       */
        static toUint32Array(data: BufferSource, offset?: number, length?: number): Uint32Array
        /**
       * Creates a new Uint8Array view on the same buffer. This clamps the values to
       * be within the same view (i.e. you can't use this to move past the end of
       * the view, even if the underlying buffer is larger). However, you can pass a
       * negative offset to access the data before the view.
       */
        static toUint8Array(data: BufferSource, offset?: number, length?: number): Uint8Array
      }
    
      export class FairplayUtils {
      /**
       * Default FairPlay payload creator according to Apple's FairPlay examples. It
       * takes:
       * 
       * the initData of `skd` initDataType;
       * Content ID previously extracted from the initData using
       * {@link clpp.utils.FairplayUtils.extractContentId}, custom
       * {@link clpp.drm.ContentIdExtractor} or delivered by other means;
       * the server certificate.
       * 
       * It returns a binary payload which is the result of concatenation of all
       * these inputs in the following format:
       * ``[4 bytes] initDataSize
       * [initDataSize bytes] initData
       * [4 bytes] contentIdSize
       * [contentIdSize bytes] contentId
       * [4 bytes] certificateSize
       * [certificateSize bytes] certificate
       * ``
       * This payload is then meant to be used to create a new MediaKeySession.
       * Note:
       * This version of FairPlay payload format is dedicated to use with older
       * Apple's {@link https://dvcs.w3.org/hg/html-media/raw-file/tip/encrypted-media/encrypted-media.html | WebKit-prefixed EME}
       * in Safari browser.
       *
       * @param skdInitData The initData of `skd` initDataType
       * @param contentId The Content ID
       * @param certificate The server certificate.
       */
        static createFairplayPayload(skdInitData: BufferSource, contentId: BufferSource|string, certificate: BufferSource|null): Uint8Array
        /**
       * Default Content ID extraction method according to Apple's FairPlay
       * Streaming examples. It takes initData of `skd` initDataType. It extracts a
       * hostname part from HLS `#EXT-X-KEY:URI`.
       * E.g. if FPS encrypted playlist has the HLS #EXT-X-KEY tag:
       * ``#EXT-X-KEY:METHOD=SAMPLE-AES,URI="skd://d192ebad-5097",
       * KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"
       * ``
       * then the Content ID extracted with this method will be:
       * `
       * d192ebad-5097
       * `
       * If your FPS license server is expecting other Content ID than this, you
       * should use custom {@link clpp.drm.ContentIdExtractor} modifier for
       * your {@link clpp.FairplayDrmSystem}.
       * In the most advanced configurations you could also decide to implement
       * a custom {@link clpp.drm.InitDataTransformer} which allows you to
       * directly parse and manipulate initData and construct a custom payload for a
       * Key Session to provide context for message exchange with the FPS CDM. Based
       * on that payload FPS CDM will return a SPC payload you could then send to
       * the license server.
       *
       * @param skdInitData The initData of `skd` initDataType
       */
        static extractContentId(skdInitData: BufferSource): string
        /**
       * Extracts #EXT-X-KEY:URI string from initData.
       * e.g. skd://d192ebad-5097
       *
       * @param skdInitData The initData of `skd` initDataType
       */
        static extractExtXKeyUri(skdInitData: BufferSource): string
        /**
       * Default FairPlay license request formatter based on Apple's FairPlay
       * Streaming examples.
       */
        static formatFairPlayRequest(request: clpp.net.Request): void
        /**
       * Default FairPlay license response parser based on Apple's FairPlay
       * Streaming examples.
       */
        static parseFairPlayResponse(response: clpp.net.Response): void
      }
    
      export class Mp4Parser {
      /**
       * Create a callback that tells the Mp4 parser to treat the body of a box as a
       * binary blob and to parse the body's contents using the provided callback.
       */
        static allData(callback: Function): clpp.utils.Mp4Parser.CallbackType
        /**
       * Declare a box type as a Box.
       */
        box(type: string, definition: clpp.utils.Mp4Parser.CallbackType): clpp.utils.Mp4Parser
        /**
       * A callback that tells the Mp4 parser to treat the body of a box as a series
       * of boxes. The number of boxes is limited by the size of the parent box.
       */
        static children(box: clpp.utils.Mp4Parser.ParsedBox): void
        /**
       * Declare a box type as a Full Box.
       */
        fullBox(type: string, definition: clpp.utils.Mp4Parser.CallbackType): clpp.utils.Mp4Parser
        /**
       * Find the header size of the box.
       * Useful for modifying boxes in place or finding the exact offset of a field.
       */
        static headerSize(box: clpp.utils.Mp4Parser.ParsedBox): number
        /**
       * Parse the given data using the added callbacks.
       *
       * @param data 
       * @param partialOkay If true, allow reading partial payloads
       *   from some boxes. If the goal is a child box, we can sometimes find it
       *   without enough data to find all child boxes.
       */
        parse(data: BufferSource, partialOkay?: boolean): void
        /**
       * Parse the next box on the current level.
       *
       * @param absStart The absolute start position in the original
       *   byte array.
       * @param reader 
       * @param partialOkay If true, allow reading partial payloads
       *   from some boxes. If the goal is a child box, we can sometimes find it
       *   without enough data to find all child boxes.
       */
        parseNext(absStart: number, reader: clpp.utils.dataview.DataViewReader, partialOkay?: boolean): void
        /**
       * A callback that tells the Mp4 parser to treat the body of a box as a sample
       * description. A sample description box has a fixed number of children. The
       * number of children is represented by a 4 byte unsigned integer. Each child
       * is a box.
       */
        static sampleDescription(box: clpp.utils.Mp4Parser.ParsedBox): void
        /**
       * Stop parsing.  Useful for extracting information from partial segments and
       * avoiding an out-of-bounds error once you find what you are looking for.
       */
        stop(): void
        /**
       * Convert an integer type from a box into an ascii string name.
       * Useful for debugging.
       *
       * @param type The type of the box, a uint32.
       */
        static typeToString(type: number): string
      }
    
      export class Platform {
      /**
       * Returns platform object that provides information about the current
       * operating system and browsers.
       */
        static getInfo(): clpp.PlatformInfo
      }
    
      export class PlayerConfiguration {
      /**
       * Creates a configuration out of the data object and the
       * default configuration.
       *
       * @param configs The data
       */
        static create(...configs: any[]): clpp.PlayerConfiguration
      }
    
      /**
     * Create a new timer. A timer is committed to a single callback function.
     * While there is no technical reason to do this, it is far easier to
     * understand and use timers when they are connected to one functional idea.
     */
      export class Timer {
      /**
       * Create a new timer. A timer is committed to a single callback function.
       * While there is no technical reason to do this, it is far easier to
       * understand and use timers when they are connected to one functional idea.
       */
        constructor(onTick: Function)
        /**
       * Stop the timer and clear the previous behavior. The timer is still usable
       * after calling |stop|.
       */
        stop(): void
        /**
       * Have the timer call |onTick| after |seconds| has elapsed unless |stop| is
       * called first.
       */
        tickAfter(seconds: number): clpp.utils.Timer
        /**
       * Have the timer call |onTick| every |seconds| until |stop| is called.
       */
        tickEvery(seconds: number): clpp.utils.Timer
        /**
       * Have the timer call |onTick| now.
       */
        tickNow(): clpp.utils.Timer
      }
    
      export class Uint8ArrayUtils {
      /**
       * Concatenate Uint8Arrays.
       */
        static concat(...var_args: Uint8Array[]): Uint8Array
        /**
       * Compare two Uint8Arrays for equality.
       */
        static equal(arr1: Uint8Array, arr2: Uint8Array): boolean
        /**
       * Convert a base64 string to a Uint8Array.  Accepts either the standard
       * alphabet or the alternate "base64url" alphabet.
       */
        static fromBase64(str: string): Uint8Array
        /**
       * Convert a hex string to a Uint8Array.
       */
        static fromHex(str: string): Uint8Array
        /**
       * Convert a Uint8Array to a base64 string.  The output will always use the
       * alternate encoding/alphabet also known as "base64url".
       *
       * @param data 
       * @param opt_padding If true, pad the output with equals signs.
       *   Defaults to true.
       */
        static toBase64Url(data: BufferSource, opt_padding?: boolean): string
        /**
       * Convert a Uint8Array to a hex string.
       */
        static toHex(arr: Uint8Array): string
        /**
       * Convert a Uint8Array to a base64 string. The output will be standard
       * alphabet as opposed to base64url safe alphabet.
       */
        static toStandardBase64(data: BufferSource): string
      }
    
      namespace Mp4Parser {
        export type CallbackType = Function
      
        export type ParsedBox = {
        /**
         * The flags for a full box, null for basic boxes.
         */
          flags: number|null
          /**
         * If true, the box header had a 64-bit size field.  This affects the offsets
         * of other fields.
         */
          has64BitSize: boolean
          /**
         * The size of this box header.
         */
          headerSize: number
          /**
         * The parser that parsed this box. The parser can be used to parse child
         * boxes where the configuration of the current parser is needed to parsed
         * other boxes.
         */
          parser: clpp.utils.Mp4Parser
          /**
         * If true, allows reading partial payloads from some boxes. If the goal is a
         * child box, we can sometimes find it without enough data to find all child
         * boxes. This property allows the partialOkay flag from parse() to be
         * propagated through methods like children().
         */
          partialOkay: boolean
          /**
         * The reader for this box is only for this box. Reading or not reading to
         * the end will have no affect on the parser reading other sibling boxes.
         */
          reader: clpp.utils.dataview.DataViewReader
          /**
         * The size of this box (including the header).
         */
          size: number
          /**
         * The start of this box (before the header) in the original buffer. This
         * start position is the absolute position.
         */
          start: number
          /**
         * The version for a full box, null for basic boxes.
         */
          version: number|null
        }
      }
    
      namespace arrays {
      /**
       * Sort order
       */
        export enum Order {
          ASCENDING = 1,
          DESCENDING = -1,
        }
      }
    
      namespace dataview {
      /**
       * Creates a DataViewReader, which abstracts a DataView object.
       */
        export class DataViewReader {
        /**
         * Creates a DataViewReader, which abstracts a DataView object.
         *
         * @param dataView The data view
         * @param opt_littleEndian Read data as little endian
         */
          constructor(dataView: DataView, opt_littleEndian?: boolean)
        
        }
      }
    }
  
    namespace verimatrix {
      export class Vcas {
        constructor(vcasConfig: clpp.VerimatrixVcasConfiguration)
        /**
       * The name of this DRM environment.
       */
        static NAME: string
      }
    
      export class VcasComponent {
      
      }
    
      namespace Vcas {
      /**
       * FairPlay assetId acquisition strategy
       */
        export enum FairPlayAssetIdStrategy {
        /**
         * AssetId will be retrieved from HLS playlist #EXT-X-KEY:URI
         * E.g. if your HLS playlist ` #EXT-X-KEY` tag is:
         * ``#EXT-X-KEY:METHOD=SAMPLE-AES,URI="skd://b63831eed2170ce1235b167a9a6d6802",KEYFORMAT="com.apple.streamingkeydelivery",KEYFORMATVERSIONS="1"
         * ``
         * Then the extracted assetId will be: `b63831eed2170ce1235b167a9a6d6802`
         * This is the default strategy.
         */
          KEYID = 'keyid',
          /**
         * AssetId will consist of a contentId (such as the name of the content item)
         * and a siteId:
         * ``assetId: r=<contentId>&s=<siteId>
         * ``
         * where:
         * 
         * <contentId> = URL encoded content identifier (SMSCONTENTID).
         * <siteId> = Unique identifier of the site to which the subscriber is
         * associated.
         * 
         * E.g. if `contentId = "sample test"` and `siteId = 123`, then the assetId is
         * `r=sample%20test&s=123`
         */
          CONTENTID_SITEID = 'contentid-siteid',
        }
      
        /**
       * License request custom headers identifiers
       */
        export enum LicenseRequestHttpHeader {
        /**
         * Device ID custom HTTP header
         */
          DEVICE_ID_HEADER = 'DeviceId',
          /**
         * Authenticator custom HTTP header
         */
          AUTHENTICATOR_HEADER = 'Authenticator',
        }
      
        /**
       * Methods for passing the device's Verimatrix unique identifier (VUID)
       * (`deviceId`) and optional third-party authentication to the Subscriber
       * Management System (SMS) (`authenticator`) to the license servers.
       */
        export enum LicenseRequestVuidLocation {
        /**
         * Pass VUID in the license server URL query string.
         */
          QUERY_STRING = 'query-string',
          /**
         * Pass VUID in the license request HTTP headers.
         */
          HTTP_HEADER = 'http-header',
        }
      }
    }
  
    namespace vimond {
      export class VimondPlugin {
        static Id: string
        getVimondService(): any|null
        /**
       * Update the auth token.
       * The auth token may expire during playback.
       * Pass a fresh auth token regularly to prevent failure.
       *
       * @param authToken Authentication token
       */
        updateAuthToken(authToken: string): void
      }
    }
  
    namespace vr {
      export class VrPlugin {
        static Id: string
        /**
       * Get the current camera coordinates.
       */
        getCameraCoordinates(): Object
        /**
       * Update the camera position.
       */
        moveCamera(x: number, y: number): void
        /**
       * Set the camera field of view.
       * A smaller value will "zoom in" and a larger value will "zoom out"
       * and provide a larger field of view.
       */
        setCameraFieldOfView(fov: number): void
      }
    }
  
    namespace vtt {
      export class VttComponent {
      
      }
    }
  }
}
