import MetaEnv from '@/utils/metaEnv'

export default class Matomo {
  static scriptUniqueId = 'gov-aid-tree-matomo-script'
  static allowAnalytics = MetaEnv.hasMatomo ?? false
  static server = MetaEnv.matomoUrl
  static siteId = MetaEnv.matomoAppId
  static domain = location.hostname
  static hasTrackAllOutLinks = false
  static _isSet = false

  static isSet(isSet: boolean = true) {
    this._isSet = this.allowAnalytics && isSet
  }

  static sendEvent(action: string, name: string | null = null, value: string | number | null = null) {
    if (this._isSet) {
      this.trackEvent('from_domain', this.domain)
      if (name && value) {
        // Track by action
        this.trackEvent(action, name, value)
      }
    }
  }

  static trackEvent = (
    evCategory: string,
    evAction: string,
    evName: string | number | undefined = undefined,
    EvValue: number | undefined = undefined
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const _paq: any = window._paq || []
    if (_paq) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      _paq.push(['trackEvent', evCategory, evAction, evName, EvValue])
    }
  }

  static script = () => {
    const isMatomoCloud = this.server.endsWith('.matomo.cloud')
    const scriptSrc = `${isMatomoCloud ? '//cdn.matomo.cloud/' : ''}${this.server}/matomo.js`

    return `
      var _paq = window._paq = window._paq || [];
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */

      // CNIL - code to paste before _paq.push(["trackPageView"]);
      _paq.push([function() {
        var self = this;
        function getOriginalVisitorCookieTimeout() {
          var now = new Date(),
          nowTs = Math.round(now.getTime() / 1000),
          visitorInfo = self.getVisitorInfo();
          var createTs = parseInt(visitorInfo[2]);
          var cookieTimeout = 33696000; // 13 mois en secondes
          var originalTimeout = createTs + cookieTimeout - nowTs;
          return originalTimeout;
        }
        this.setVisitorCookieTimeout( getOriginalVisitorCookieTimeout() );
      }]);
      // End of CNIL code part

      _paq.push(['setDocumentTitle', '${this.domain}']);
      _paq.push(['trackPageView']);
      // _paq.push(['setLinkClasses', "outlink"]);
      ${this.hasTrackAllOutLinks ? "_paq.push(['enableLinkTracking']);" : ''}

      (function() {
        var u="${this.server}/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '${this.siteId}']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src="${scriptSrc}"; s.parentNode.insertBefore(g,s);
      })();
  `
  }
}
