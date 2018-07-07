import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import CardModel from '../models/card';

import './card.scss';
import mtgLogo from '../../assets/mtg-logo.svg';

const CARD_WIDTH = 223;
const CARD_HEIGHT = 350;

export default class Card extends Component {
    static propTypes = {
        model: PropTypes.instanceOf(CardModel)
    };
    
    state = { 
        isImgLoading: true 
    };
    
    onImgLoad = () => {
        if (this.state.isImgLoading) {
            this.setState({isImgLoading: false});
        }
    };
    
    render() {
        const { model } = this.props;
        const { name = "", imageUrl = "", artist = "", setName = ""} = (model || {});
        const { isImgLoading } = this.state;
        const isPlaceholder = !model || isImgLoading;       //show placeholder until the model & img is loaded
        const caption = `${setName} | ${artist}`;

        return(
            <figure className={cn("card", {'placeholder': isPlaceholder})} style={{height: CARD_HEIGHT, width:CARD_WIDTH}}>
                <h3 title={name}>{name}</h3>
                <img src={isPlaceholder ? mtgLogo : imageUrl} onLoad={this.onImgLoad}/>
                <figcaption title={caption}>{caption}</figcaption>
            </figure>
        );
    }
}

export { CARD_HEIGHT, CARD_WIDTH } 
