import React, { Component } from 'react';
import './filteringSidebar.css';
import Context from '../../Context';
import FavoritesList from './favoritesList';
import FiltersList from './filtersList';

export default class FilteringSidebar extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      };
  
    }

    static contextType = Context;    
  
    render() {
  
        return (
          <div className="column-flex-container">
            <div className="filtering-sidebar">
              <FiltersList />             
              <FavoritesList />
            </div>
          </div>
        );
    }
  }