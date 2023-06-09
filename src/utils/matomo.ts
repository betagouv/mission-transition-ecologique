
export const matomoScript = (matomoServer: string, siteId: string, domain: string, hasTrackAllOutlinks: boolean = false) => {
  const isMatomoCloud = matomoServer.endsWith('.matomo.cloud')
  const urlServer = `${isMatomoCloud ? 'https://' : '//'}${matomoServer}`
  const scriptSrc = `//${isMatomoCloud ? 'cdn.matomo.cloud/' : ''}${matomoServer}/matomo.js`

  return `
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    
    // Code à coller avant la fonction _paq.push(["trackPageView"]);
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

    _paq.push(['setDocumentTitle', '${domain}']);
    _paq.push(['trackPageView']);
    // _paq.push(['setLinkClasses', "outlink"]);
    ${hasTrackAllOutlinks ? "_paq.push(['enableLinkTracking']);" : ''}

    (function() {
      var u='${urlServer}/';
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '${siteId}']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.async=true; g.src='${scriptSrc}'; s.parentNode.insertBefore(g,s);
    })();
  `
}

export const trackEvent = (domain: string, evAction: string, evName: string, EvValue: any = undefined) => {
  // @ts-ignore
  const _paq = window._paq
  console.log('Matomo > trackEvent >  _paq :', _paq)
  if (_paq) {
    _paq.push(['trackEvent', domain, evAction, evName, EvValue])
  }
}