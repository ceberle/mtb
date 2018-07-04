import map from 'lodash/map';

export default function toQueryString(params = {}) {
    const paramList = map(params, (val, key) => {
        if (val === undefined) return;
        
        if (val instanceof Array) {
            return encodeURIComponent(key) + '=' + map(val, encodeURIComponent).join(',');
        } else {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }
    });
    
    return paramList.length ? '?' + paramList.join('&') : '';
}
