import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import MediaQuery from 'react-responsive';
import './App.css';
// import DATA from './DATA.json';
import config from './config';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: []
    };

  }

  fetchGames = () => {

    const url = config.VGRDC_API_ENDPOINT;

    const options = {
      method: 'GET',
      headers: {
        "content-type": "application/json"
      }
    }

    return fetch(url, options)
    .then(games => {
      if (!games.ok) {
        return games.json().then(error => {
          throw error;
        });
      }
      return games.json()
    })
    .then(games => {
      this.setState( { games: [...games] } )
    })
    .catch(error => {
      console.log(error);
    })

  }

  componentDidMount() {

    this.fetchGames();

  }

  render() {

    // const unformattedReleases = DATA.results.filter(release => release.expected_release_day != null)

    // console.log(unformattedReleases)

    // { title: release.name, date: release.expected_release_year + expected-release-month + expected-release-day }
    // date: yyyy-mm-dd (need 0)

    const releases = this.state.games.map(release => {

      // We ultimately need an array of objects, so we'll want to map
      // onto an object and push it into an array

      const tempObj = {};

      let year = release.expected_release_year
      let month = (release.expected_release_month < 10)
                    ? '0' + release.expected_release_month
                    : release.expected_release_month
      let day = (release.expected_release_day < 10)
                ? '0' + release.expected_release_day
                : release.expected_release_day
  
      tempObj.title = release.name;
      tempObj.date = `${year}-${month}-${day}`;

      return tempObj

    })


    return (
      <div className="App">
        <header className="App-header">
          <h1>Video Games Release Date Calendar</h1>      
        </header>
        <main>
        <MediaQuery maxWidth={1223}>
          <FullCalendar 
            defaultView="listWeek" 
            plugins={[ listPlugin ]} 
            events={ releases }
          />
        </MediaQuery>
        <MediaQuery minWidth={1224}>
          <FullCalendar 
            defaultView="dayGridMonth" 
            plugins={[ dayGridPlugin ]} 
            events={ releases }
          />
        </MediaQuery>

        </main>
      </div>
    );
  }
}
