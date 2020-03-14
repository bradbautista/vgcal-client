import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import MediaQuery from 'react-responsive';
import Modal from 'react-responsive-modal';
import './App.css';
// import DATA from './DATA.json';
import config from './config';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      event: [],
      favorites: [],
      open: false
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

  handleClick = ({ event, el }) => {

    console.log(event._def.title)
    console.log(el)

    this.setState({ open: true });

    // console.log('Hi!')
    // console.log(event)
    // this.toggle();
    // this.setState({event: event, modal: true})

  }
 
  onCloseModal = () => {

    this.setState({ open: false });

  };

  componentDidMount() {

    this.fetchGames();

  }

  render() {

    // Styles object for our modal 
    const styles = { overlay: { background: 'rgba(0, 0, 0, 0.35)' }}


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
          <h1>vgCal</h1>      
        </header>

        <main>      

        <div className={"calendar-wrapper"}>

          <div className={"sidebar-left"}>
            <div className={"filtering-container"}>
              <h2>Filtering options</h2>
              <input type="checkbox" id="XBox" name="Xbox" value="XBox" />
              <label for="XBox"> XBOX</label><br/>
              <input type="checkbox" id="Playstation" name="Playstation" value="Playstation" />
              <label for="Playstation"> Playstation</label><br/>
              <input type="checkbox" id="Switch" name="Switch" value="Switch" />
              <label for="Switch"> Switch</label><br/> 
              <input type="checkbox" id="PC" name="PC" value="PC" />
              <label for="PC"> PC</label><br/> 
            </div>
            <div className={"favorites-container"}>
              <h2>Your favorites</h2>
              <ul>
                {(this.state.favorites.length === 0)
                  ? <li>Add a game to your favorites list and you can export an ics file to add the release date to a calendar of your choice</li>
                  : this.state.favorites
                }
              </ul>
              <button>Export to ICS</button>
            </div>
          </div>

          {/* Weekly list view for phones / tablets */}
          <MediaQuery maxWidth={1199}>

            <FullCalendar 
              defaultView="listWeek" 
              plugins={[ listPlugin ]} 
              events={ releases }
              eventClick={ this.handleClick }
              height= { 700 }
            />

          </MediaQuery>

          {/* Month grid view for laptops/desktops */}
          <MediaQuery minWidth={1200}>

            <FullCalendar 
              defaultView="dayGridMonth" 
              plugins={[ dayGridPlugin ]} 
              events={ releases }
              eventClick={ this.handleClick }
              fixedWeekCount={ false }
              height={ 950 }
            />
            
          </MediaQuery>

          <div className={"sidebar-right"}>
            <h2>Landing page info goes here</h2>
            <p>Welcome to vgCal! Here's some info about how to use the site:</p>
            <p>Click the left and right arrows above the calendar to change weeks or months. Click "today" to return to the present week or month.</p>
            <p>Click on a release date to get more information about that release</p>
            <p>Want to set a reminder for a release? Click on a release, click "Add to favorites" and then click "Export to ICS" in the left-hand sidebar. Your browser will download a calendar file you can import into the calendar of your choosing, or email to yourself. And maybe I'll add a form to let you email it to yourself or something idk yet.</p>
          </div>

          <Modal 
            open={this.state.open} 
            onClose={this.onCloseModal}
            styles={styles}
          >
            <h2 className="modal-heading">Modal containing release information</h2>
            <p>
              Details like price, platforms, box art, etc. tbd
            </p>
          </Modal>

          </div>
        

        </main>
      </div>
    );
  }
}
