import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Select from 'react-select';
import Context from './Context';
import './Header.css'

  export default class Header extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    static contextType = Context; 
  
    render() {
  
      return (
        <header className="header">
          {/* Onclick here was this.context.setLastVisited('/')  */}
          <Link to="/" onClick={() => window.location.reload()}><h1 className="logotype">vgCal</h1></Link>
          <Select
            className="search"
            onChange={this.context.handleSelect}
            placeholder="Select a game or type to search for one"
            options={this.context.games.map(game => {
              
              const tempObj = {}

              tempObj.value = {
                platforms: game.platforms,
                image: game.boxart_url,
                gameUrl: `/game/${game.game_name.split(' ').join('-')}`,
                gameTitle: game.game_name,
                releaseDate: game.release_date_UTC,
                description: game.game_description
              };

              tempObj.label = game.game_name;

              return tempObj;

            })}
          />
          <span></span>
        </header>
      );
    }
  }