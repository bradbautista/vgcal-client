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

    resetApp = () => {

      // This gives us access to methods via the calendar API by creating
      // a ref for each calendar so we can actively manipulate the date
      let calendarApi = this.context.calendar.current.getApi()
      // Set the calendar to today
      calendarApi.today();

      // Update history
      this.context.setLastVisited('/')

      // Get rid of any filters
      this.context.setFilters([])

      // Uncheck any checked checkboxes
      this.context.checkboxes.forEach(checkbox => {
        if (checkbox.state.checked === true) {
          checkbox.setChecked(false)
        }
      })

      // And restore calendar events to their initial state
      this.context.setDefaultReleases(this.context.games)

    }
  
    render() {
  
      return (
        <header className="header">
          <Link to="/" onClick={() => this.resetApp()}><h1 className="logotype">vgCal</h1></Link>
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
                releaseDate: game.release_date_utc,
                description: game.game_description
              };

              tempObj.label = game.game_name;

              return tempObj;

            }).sort((a, b) => {
                const nameA = a.label;
                const nameB = b.label;
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                return 0;
            })}
          />
          <span></span>
        </header>
      );
    }
  }