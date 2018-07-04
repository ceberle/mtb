import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Masonry,
    WindowScroller,
    AutoSizer,
    CellMeasurer,
    CellMeasurerCache,
    InfiniteLoader,
    createMasonryCellPositioner
} from 'react-virtualized';

import Card, { CARD_HEIGHT, CARD_WIDTH } from './card.js';
import { DEFAULT_PAGE_SIZE } from '../services/mtg';

const LIMIT = DEFAULT_PAGE_SIZE;
const DEFAULT_GUTTER = 10;
const MAX_COLUMN_COUNT = 8;

export default class CardGrid extends Component {
    static propTypes = {
        isRowLoaded : PropTypes.func.isRequired,
        loadMoreRows: PropTypes.func.isRequired,
        getRow      : PropTypes.func.isRequired,
        totalCount  : PropTypes.number.isRequired
    };

    masonryRef = undefined;
    
    constructor() {
        super(...arguments);

        this.cellMeasurerCache = new CellMeasurerCache({
            defaultHeight: CARD_HEIGHT,
            defaultWidth : CARD_WIDTH,
            fixedWidth   : true
        });

        this.cellPositioner = createMasonryCellPositioner({
            cellMeasurerCache: this.cellMeasurerCache,
            columnWidth      : CARD_WIDTH,
            spacer           : DEFAULT_GUTTER,
            columnCount      : MAX_COLUMN_COUNT
        });

    }

    resetCellPositioner({ columnCount }) {
        this.cellPositioner.reset({
            columnCount: Math.max(columnCount, 1),      // At least one column
            columnWidth: CARD_WIDTH,
            spacer: DEFAULT_GUTTER
        });
    }
    
    calculateColumnCount({ width }) {
        return Math.floor(width / (CARD_WIDTH + DEFAULT_GUTTER));
    }
    
    onResize = ({ width }) => {
        this.resetCellPositioner({ columnCount: this.calculateColumnCount({ width }) });
        this.masonryRef.recomputeCellPositions();
    };
    
    cellRenderer = ({ index, key, parent, style }) => {
        const model = this.props.getRow(index);
        
        return (
            <CellMeasurer parent={parent} cache={this.cellMeasurerCache} index={index} key={key}>
                <div style={style}>
                    <Card model={model}/>
                </div>
            </CellMeasurer>
        );
    };
    
    render() {
        const { totalCount, isRowLoaded, loadMoreRows } = this.props;
        const cache = this.cellMeasurerCache;
        
        return (
            <InfiniteLoader isRowLoaded={isRowLoaded}
                            loadMoreRows={loadMoreRows}
                            rowCount={totalCount}
                            minimumBatchSize={LIMIT}
            >
                {({ onRowsRendered, registerChild }) => (
                    <WindowScroller>
                        {({ height, scrollTop }) => (
                            <AutoSizer disableHeight
                                       height={height}
                                       scrollTop={scrollTop}
                                       onResize={this.onResize}
                            >
                                {({ width }) => (
                                    <Masonry className="card-grid"
                                             autoHeight={true}
                                             height={height}
                                             width={width}
                                             cellCount={totalCount}
                                             cellRenderer={this.cellRenderer}
                                             onCellsRendered={onRowsRendered}
                                             cellMeasurerCache={cache}
                                             cellPositioner={this.cellPositioner}
                                             rowHeight={cache.rowHeight}
                                             scrollTop={scrollTop}
                                             ref={instance => {
                                                 this.masonryRef = instance;
                                                 registerChild(instance);
                                             }}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                )}
            </InfiniteLoader>
        );
    }
};