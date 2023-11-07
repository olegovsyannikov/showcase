/* eslint-disable */
export default {
  trim(string) {
    return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  },
  cookie(name, value, options) {
    if (typeof value !== 'undefined') {
      options = options || {};
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      let expires = '';
      if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
        let date;
        if (typeof options.expires === 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = `; expires=${date.toUTCString()}`;
      }
      const path = options.path ? `; path=${options.path}` : '';
      const domain = options.domain ? `; domain=${options.domain}` : '';
      const secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
      let cookieValue = null;
      if (document.cookie && document.cookie != '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = this.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) == (`${name}=`)) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
  },
};
