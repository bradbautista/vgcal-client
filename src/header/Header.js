import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Select from 'react-select';
import WindowedSelect, { createFilter } from "react-windowed-select";
import CustomOption from './CustomOption';
import Context from '../Context';
import './Header.css'

  export default class Header extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    static contextType = Context; 

    resetApp = () => {

      // If the user switches from desktop to mobile view, say by
      // expanding the dev tools, and then tries to click the home
      // button, the app crashes because the value of the calendar
      // ref gets nulled when the mobile calendar mounts. Have not
      // found a way to update that value, so until I can, reload achieves
      // the same effect without crashing
      if (this.context.calendar.current === null) {
        window.location.reload()
      }

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

    // Implements expected keyboard behavior in searchable select
    handleKeyDown = (e) => {
      // No default below turns off esLint rule
      // about default case
      switch(e.key){
           case "Home": e.preventDefault();
               if(e.shiftKey) e.target.selectionStart = 0;
               else e.target.setSelectionRange(0,0);
               break;
           case "End": e.preventDefault();
               const len = e.target.value.length;
               if(e.shiftKey) e.target.selectionEnd = len;
               else e.target.setSelectionRange(len,len);
               break;
          // no default
       }

    };
  
    render() {

      // Pointer for our select
      const customStyles = {
        option: (styles) => ({
          ...styles,
          cursor: 'pointer',
        }),
        control: (styles) => ({
          ...styles,
          cursor: 'pointer',
        }),
      }
  
      return (
        <header className="header">
          <Link to="/" onClick={() => this.resetApp()}><h1 className="logotype">vgCal</h1></Link>
          <WindowedSelect
            styles={customStyles}
            className="search"
            // menuIsOpen={true}
            classNamePrefix="react-select"
            onChange={this.context.handleSelect}
            placeholder="Select a game or type to search for one"
            // Solution to issue of input lag in
            // React Select with large datasets
            filterOption={createFilter({ignoreAccents: false})}
            isClearable={true}
            onKeyDown={this.handleKeyDown}
            components={
              {
                // Solution to problem of poor performance
                // on hover with large datasets. See: https://github.com/JedWatson/react-select/issues/3128#issuecomment-521242192
                Option: CustomOption
              }
            }
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
          <nav className="header-nav">
            <i onClick={() => this.context.setVisited(false)} className="fas fa-question-circle"></i>
            <a href="https://github.com/bradbautista/" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/bradford-bautista/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </nav>
          
        </header>
      );
    }
  }