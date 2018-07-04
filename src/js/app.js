import React, { Component } from 'react';
import { render } from 'react-dom';
import Select from 'react-select';
import map from 'lodash/map';

import CardStore, { PAGE_SIZE } from './stores/cards';
import TypeStore from './stores/types';
import CardGrid from './components/card-grid';

import './app.scss';
import mtgLogo from '../assets/mtg-logo.svg';

const DEFAULT_TYPE = 'creature';

export default class MagicTheBrowsering extends Component {
    constructor() {
        super(...arguments);
        
        this.store = new CardStore();
        this.typeStore = new TypeStore();
        
        this.state = {
            totalCount  : 0,
            selectedType: DEFAULT_TYPE,
            typeOptions : []
        };
    }
    
    componentDidMount() {
        this.getTypes();
        this.loadFirstPage();
    }
    
    loadFirstPage() {
        this.store.reset();
        this.loadMoreRows({startIndex: 0, stopIndex: PAGE_SIZE - 1});
    }
    
    getTypes() {
        this.typeStore.fetchTypes()
            .then(types => {
               this.setState({
                    typeOptions: map(types, t => ({ value: t.value, label: t.displayName }))
                });
            });
    }
    
    onTypeChange = ({ value }) => {
        if (value !== this.state.selectedType) {
            this.setState({selectedType: value, totalCount: 0}, () => this.loadFirstPage());
        }
    };
    
    getRow = (index) => {
        return this.store.getRow(index);
    };
    
    isRowLoaded = ({ index }) => {
        return !!this.store.getRow(index);
    };
    
    loadMoreRows = ({ startIndex, stopIndex }) => {
        return this.store.fetchRowsByIndexRange({
            type: this.state.selectedType,
            startIndex,
            stopIndex
        })
        .then(() => {
            const totalCount = this.store.totalCount;
            if (this.state.totalCount !== totalCount) {
                this.setState({totalCount});
            }
        });
    };
    
    // Separate header into separate function so it can be rendered twice: once to reserve space
    // for the fixed header, another for the actual header. Prevent tabbing into the hidden select box
    // by setting its tabIndex to -1.
    renderHeader({ hidden }) {
        const { typeOptions, selectedType } = this.state;
        
        return (
            <header className={hidden ? 'reserve-space' : ''}>
                <div className="title">
                    <img src={mtgLogo} />
                    <span>Magic The Browsering</span>
                </div>
                <Select isLoading={typeOptions.length === 0}
                        options={typeOptions}
                        value={selectedType}
                        tabIndex={ hidden ? -1 : 0 }
                        clearable={false}
                        autosize={false}
                        onChange={this.onTypeChange}
                />
            </header>
        );
    }
    
    render() {
        const { totalCount } = this.state;
        const isLoading = (totalCount === 0);
        
        return (
            <div id="mtb-app">
                {this.renderHeader({hidden: true})}
                {this.renderHeader({hidden: false})}
                {isLoading && <img className="loading" src={mtgLogo} />}
                {!isLoading && <CardGrid 
                    getRow={this.getRow}
                    loadMoreRows={this.loadMoreRows}
                    isRowLoaded={this.isRowLoaded}
                    totalCount={totalCount}
                />}
            </div>
        );
    }
}

render(<MagicTheBrowsering />, document.getElementById('mtb-app-container'));