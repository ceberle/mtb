import toQueryString from '../utils/to-query-string';

const ENDPOINT = 'https://api.magicthegathering.io/v1/';
const DEFAULT_PAGE_SIZE = 20;
const MAX_ROWS = 200;

// Abstraction of Ajax calls for services. Can be extended for caching, retry, etc.
function callService(path = 'cards', opts = { query: {} }) {
    const { query, ...fetchOpts } = opts;
    
    return fetch(`${ENDPOINT}${path}${toQueryString(query)}`, 
        {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
            ...fetchOpts
        })
        .then(resp => {
            return resp.json().then(jsonData => {
                return {
                    pageSize  : parseInt(resp.headers.get('page-size'), 10),
                    count     : parseInt(resp.headers.get('count'), 10),
                    totalCount: Math.min(parseInt(resp.headers.get('total-count'), 10), MAX_ROWS),
                    jsonData
                }
            });
        });
}

/**
 * MTG API layer. This is separate from the stores so that it can be used with different models or other
 * data layers.
 */
export default {
    getCardsWithPhotosByType({ type = '', page = 1, pageSize = DEFAULT_PAGE_SIZE }) {
        return callService("cards", {
            query: {
                type,
                page,
                pageSize,
                contains: "imageUrl"
            }
        });
    },
    
    getTypes() {
        return callService("types");
    },
    
    DEFAULT_PAGE_SIZE
};
