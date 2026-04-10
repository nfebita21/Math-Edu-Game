const UrlParser = {
  parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    return this._urlCombiner(splitedUrl);
  },

  parseActiveUrlWithoutCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    return this._urlSplitter(url);
  },

  _urlCombiner(splitedUrl) {
    if (
      splitedUrl.resource === 'game' &&
      splitedUrl.cityName &&
      splitedUrl.level &&
      splitedUrl.verb === 'play'
    ) {
      return '/game/:cityName/:level/play';
    }

    if (splitedUrl.resource === 'game' && splitedUrl.cityName) {
      return '/game/:cityName';
    }

    if (splitedUrl.resource === 'lobby' && splitedUrl.params) {
      return '/lobby?id';
    }

    return `/${splitedUrl.resource || ''}`;
  },

  _urlSplitter(url) {
    const splitParams = url.split('?id=');
    const urlsSplits = splitParams[0].split('/');

    return {
      resource: urlsSplits[1] || null,
      cityName: urlsSplits[2] || null,
      level: urlsSplits[3] || null,
      verb: urlsSplits[4] || null, // 'play'
      params: splitParams[1] || null,
    };
  }


};







export default UrlParser;