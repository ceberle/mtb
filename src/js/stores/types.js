import map from 'lodash/map';

import Type from '../models/type';
import mtg from '../services/mtg';

export default class TypeStore {
    constructor() {
        this.data = [];
    }
    
    fetchTypes() {
        return mtg.getTypes()
            .then(resp => {
                const { jsonData = {types: []} } = resp;
                this.data = map(jsonData.types, t => new Type(t));
                return this.data;
            });
    }
}
