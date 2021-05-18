// ==UserScript==
// @name        google-placeholder
// @description Google placeholders pulled from uBlock
// @match       *://*.*
// ==/UserScript==

/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2019-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock
*/

// Files are available at uBlock/src/web_accessible_resources/

// google-analytics_analytics
(function() {
  'use strict';
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/
  const noopfn = function() {
  };
  const noopnullfn = function() {
    return null;
  };
  const Tracker = function() {
  };
  const p = Tracker.prototype;
  p.get = noopfn;
  p.set = noopfn;
  p.send = noopfn;
  const w = window;
  const gaName = w.GoogleAnalyticsObject || 'ga';
  const gaQueue = w[gaName];
  // https://github.com/uBlockOrigin/uAssets/pull/4115
  const ga = function() {
    const len = arguments.length;
    if ( len === 0 ) { return; }
    const args = Array.from(arguments);
    let fn;
    let a = args[len-1];
    if ( a instanceof Object && a.hitCallback instanceof Function ) {
      fn = a.hitCallback;
    } else if ( a instanceof Function ) {
      fn = ( ) => { a(ga.create()); };
    } else {
      const pos = args.indexOf('hitCallback');
      if ( pos !== -1 && args[pos+1] instanceof Function ) {
        fn = args[pos+1];
      }
    }
    if ( fn instanceof Function === false ) { return; }
    try {
      fn();
    } catch (ex) {
    }
  };
  ga.create = function() {
    return new Tracker();
  };
  ga.getByName = noopnullfn;
  ga.getAll = function() {
    return [];
  };
  ga.remove = noopfn;
  // https://github.com/uBlockOrigin/uAssets/issues/2107
  ga.loaded = true;
  w[gaName] = ga;
  // https://github.com/gorhill/uBlock/issues/3075
  const dl = w.dataLayer;
  if ( dl instanceof Object && dl.hide instanceof Object && typeof dl.hide.end === 'function' ) {
    dl.hide.end();
  }
  // empty ga queue
  if ( gaQueue instanceof Function && Array.isArray(gaQueue.q) ) {
    for ( const entry of gaQueue.q ) {
      ga(...entry);
    }
  }
})();

// googletagmanager_gtm
(function() {
  'use strict';
  const noopfn = function() {
  };
  const w = window;
  w.ga = w.ga || noopfn;
  const dl = w.dataLayer;
  if ( dl instanceof Object === false ) { return; }
  if ( dl.hide instanceof Object && typeof dl.hide.end === 'function' ) {
    dl.hide.end();
  }
  if ( typeof dl.push === 'function' ) {
    dl.push = function(o) {
      if (
        o instanceof Object &&
        typeof o.eventCallback === 'function'
      ) {
        setTimeout(o.eventCallback, 1);
      }
    };
  }
})();

// googletagservices_gpt
(function() {
  'use strict';
  // https://developers.google.com/doubleclick-gpt/reference
  const noopfn = function() {
  }.bind();
  const noopthisfn = function() {
    return this;
  };
  const noopnullfn = function() {
    return null;
  };
  const nooparrayfn = function() {
    return [];
  };
  const noopstrfn = function() {
    return '';
  };
  const companionAdsService = {
    addEventListener: noopthisfn,
    enableSyncLoading: noopfn,
    setRefreshUnfilledSlots: noopfn
  };
  const contentService = {
    addEventListener: noopthisfn,
    setContent: noopfn
  };
  const PassbackSlot = function() {
  };
  let p = PassbackSlot.prototype;
  p.display = noopfn;
  p.get = noopnullfn;
  p.set = noopthisfn;
  p.setClickUrl = noopthisfn;
  p.setTagForChildDirectedTreatment = noopthisfn;
  p.setTargeting = noopthisfn;
  p.updateTargetingFromMap = noopthisfn;
  const pubAdsService = {
    addEventListener: noopthisfn,
    clear: noopfn,
    clearCategoryExclusions: noopthisfn,
    clearTagForChildDirectedTreatment: noopthisfn,
    clearTargeting: noopthisfn,
    collapseEmptyDivs: noopfn,
    defineOutOfPagePassback: function() { return new PassbackSlot(); },
    definePassback: function() { return new PassbackSlot(); },
    disableInitialLoad: noopfn,
    display: noopfn,
    enableAsyncRendering: noopfn,
    enableSingleRequest: noopfn,
    enableSyncRendering: noopfn,
    enableVideoAds: noopfn,
    get: noopnullfn,
    getAttributeKeys: nooparrayfn,
    getTargeting: noopfn,
    getTargetingKeys: nooparrayfn,
    getSlots: nooparrayfn,
    refresh: noopfn,
    set: noopthisfn,
    setCategoryExclusion: noopthisfn,
    setCentering: noopfn,
    setCookieOptions: noopthisfn,
    setForceSafeFrame: noopthisfn,
    setLocation: noopthisfn,
    setPublisherProvidedId: noopthisfn,
    setRequestNonPersonalizedAds: noopthisfn,
    setSafeFrameConfig: noopthisfn,
    setTagForChildDirectedTreatment: noopthisfn,
    setTargeting: noopthisfn,
    setVideoContent: noopthisfn,
    updateCorrelator: noopfn
  };
  const SizeMappingBuilder = function() {
  };
  p = SizeMappingBuilder.prototype;
  p.addSize = noopthisfn;
  p.build = noopnullfn;
  const Slot = function() {
  };
  p = Slot.prototype;
  p.addService = noopthisfn;
  p.clearCategoryExclusions = noopthisfn;
  p.clearTargeting = noopthisfn;
  p.defineSizeMapping = noopthisfn;
  p.get = noopnullfn;
  p.getAdUnitPath = nooparrayfn;
  p.getAttributeKeys = nooparrayfn;
  p.getCategoryExclusions = nooparrayfn;
  p.getDomId = noopstrfn;
  p.getSlotElementId = noopstrfn;
  p.getSlotId = noopthisfn;
  p.getTargeting = nooparrayfn;
  p.getTargetingKeys = nooparrayfn;
  p.set = noopthisfn;
  p.setCategoryExclusion = noopthisfn;
  p.setClickUrl = noopthisfn;
  p.setCollapseEmptyDiv = noopthisfn;
  p.setTargeting = noopthisfn;
  const gpt = window.googletag || {};
  const cmd = gpt.cmd || [];
  gpt.apiReady = true;
  gpt.cmd = [];
  gpt.cmd.push = function(a) {
    try {
      a();
    } catch (ex) {
    }
    return 1;
  };
  gpt.companionAds = function() { return companionAdsService; };
  gpt.content = function() { return contentService; };
  gpt.defineOutOfPageSlot = function() { return new Slot(); };
  gpt.defineSlot = function() { return new Slot(); };
  gpt.destroySlots = noopfn;
  gpt.disablePublisherConsole = noopfn;
  gpt.display = noopfn;
  gpt.enableServices = noopfn;
  gpt.getVersion = noopstrfn;
  gpt.pubads = function() { return pubAdsService; };
  gpt.pubadsReady = true;
  gpt.setAdIframeTitle = noopfn;
  gpt.sizeMapping = function() { return new SizeMappingBuilder(); };
  window.googletag = gpt;
  while ( cmd.length !== 0 ) {
    gpt.cmd.push(cmd.shift());
  }
})();

// google-analytics_ga
(function() {
  'use strict';
  const noopfn = function() {
  };
  const Gaq = function() {
  };
  Gaq.prototype.Na = noopfn;
  Gaq.prototype.O = noopfn;
  Gaq.prototype.Sa = noopfn;
  Gaq.prototype.Ta = noopfn;
  Gaq.prototype.Va = noopfn;
  Gaq.prototype._createAsyncTracker = noopfn;
  Gaq.prototype._getAsyncTracker = noopfn;
  Gaq.prototype._getPlugin = noopfn;
  Gaq.prototype.push = function(a) {
    if ( typeof a === 'function' ) {
      a(); return;
    }
    if ( Array.isArray(a) === false ) {
      return;
    }
    // https://twitter.com/catovitch/status/776442930345218048
    // https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiDomainDirectory#_gat.GA_Tracker_._link
    if ( a[0] === '_link' && typeof a[1] === 'string' ) {
      window.location.assign(a[1]);
    }
    // https://github.com/gorhill/uBlock/issues/2162
    if ( a[0] === '_set' && a[1] === 'hitCallback' && typeof a[2] === 'function' ) {
      a[2]();
    }
  };
  const tracker = (function() {
    const out = {};
    const api = [
      '_addIgnoredOrganic _addIgnoredRef _addItem _addOrganic',
      '_addTrans _clearIgnoredOrganic _clearIgnoredRef _clearOrganic',
      '_cookiePathCopy _deleteCustomVar _getName _setAccount',
      '_getAccount _getClientInfo _getDetectFlash _getDetectTitle',
      '_getLinkerUrl _getLocalGifPath _getServiceMode _getVersion',
      '_getVisitorCustomVar _initData _link _linkByPost',
      '_setAllowAnchor _setAllowHash _setAllowLinker _setCampContentKey',
      '_setCampMediumKey _setCampNameKey _setCampNOKey _setCampSourceKey',
      '_setCampTermKey _setCampaignCookieTimeout _setCampaignTrack _setClientInfo',
      '_setCookiePath _setCookiePersistence _setCookieTimeout _setCustomVar',
      '_setDetectFlash _setDetectTitle _setDomainName _setLocalGifPath',
      '_setLocalRemoteServerMode _setLocalServerMode _setReferrerOverride _setRemoteServerMode',
      '_setSampleRate _setSessionTimeout _setSiteSpeedSampleRate _setSessionCookieTimeout',
      '_setVar _setVisitorCookieTimeout _trackEvent _trackPageLoadTime',
      '_trackPageview _trackSocial _trackTiming _trackTrans',
      '_visitCode'
    ].join(' ').split(/\s+/);
    let i = api.length;
    while ( i-- ) {
      out[api[i]] = noopfn;
    }
    out._getLinkerUrl = function(a) {
      return a;
    };
    return out;
  })();
  const Gat = function() {
  };
  Gat.prototype._anonymizeIP = noopfn;
  Gat.prototype._createTracker = noopfn;
  Gat.prototype._forceSSL = noopfn;
  Gat.prototype._getPlugin = noopfn;
  Gat.prototype._getTracker = function() {
    return tracker;
  };
  Gat.prototype._getTrackerByName = function() {
    return tracker;
  };
  Gat.prototype._getTrackers = noopfn;
  Gat.prototype.aa = noopfn;
  Gat.prototype.ab = noopfn;
  Gat.prototype.hb = noopfn;
  Gat.prototype.la = noopfn;
  Gat.prototype.oa = noopfn;
  Gat.prototype.pa = noopfn;
  Gat.prototype.u = noopfn;
  const gat = new Gat();
  window._gat = gat;
  const gaq = new Gaq();
  (function() {
    const aa = window._gaq || [];
    if ( Array.isArray(aa) ) {
      while ( aa[0] ) {
        gaq.push(aa.shift());
      }
    }
  })();
  window._gaq = gaq.qf = gaq;
})();

// google-analytics_cx_api
(function() {
  'use strict';
  const noopfn = function() {
  };
  window.cxApi = {
    chooseVariation: function() {
      return 0;
    },
    getChosenVariation: noopfn,
    setAllowHash: noopfn,
    setChosenVariation: noopfn,
    setCookiePath: noopfn,
    setDomainName: noopfn
  };
})();
