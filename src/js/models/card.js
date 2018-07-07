import extend from 'lodash/extend';

/**
 * Simple encapsulation of MTG card data.
 */
export default class Card {
    constructor(data = {}) {
        extend(this, data);
    }
    
    name = "";
    imageUrl = "";
    artist = "";
    setName = "";
}