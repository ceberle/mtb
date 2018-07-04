import map from 'lodash/map';
import range from 'lodash/range';
import every from 'lodash/every';

import Card from '../models/card';
import mtg from '../services/mtg';

const PAGE_SIZE = mtg.DEFAULT_PAGE_SIZE;

export default class CardStore {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.data = [];
        this.totalCount = undefined;
        this.pending = {};
    }
    
    getRow(index) {
        return this.data[index];
    }
    
    fetchRowsByIndexRange({ type, startIndex, stopIndex }) {
        // Determine if all items are present
        if (stopIndex < this.data.length) {
            const cards = this.data.slice(startIndex, stopIndex + 1);
            if (every(cards, card => !!card)) {
                return Promise.resolve(cards);
            }
        }
        
        // Calculate the range of pages needed to satisfy the index range. MTG API pages start at 1.
        // Note: range start is inclusive, end is exclusive
        const pagesRequested = range(Math.floor(startIndex / PAGE_SIZE) + 1, Math.floor(stopIndex / PAGE_SIZE) + 2);
        return Promise.all(map(pagesRequested, page => this.fetchRows({ type, page }))); 
    }
    
    getPendingKey({ type, page }) {
        return type + page;
    }
    
    fetchRows({ type, page }) {
        const pendingKey = this.getPendingKey(...arguments);
        
        // A request for this page is already pending
        if (this.pending[pendingKey]) {
            return this.pending[pendingKey];
        }

        this.pending[pendingKey] = mtg.getCardsWithPhotosByType({ type, page })
            .then(resp => {
                // If store was reset during fetch, ignore the response
                if (!this.pending[pendingKey]) return;
                
                const { totalCount = 0, jsonData = {cards: []} } = resp;
                const cards = map(jsonData.cards, c => new Card(c));
                this.data.splice((page - 1) * PAGE_SIZE, cards.length, ...cards);
                this.totalCount = totalCount;
                return cards;
            })
            .finally(() => delete this.pending[pendingKey]);
        
        return this.pending[pendingKey];
    }
}

export { PAGE_SIZE };