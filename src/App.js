import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import MediaQuery from 'react-responsive';
import Modal from 'react-responsive-modal';
import Select from 'react-select';
import './App.css';
import config from './config';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      // This is a dummy object so we don't have to write
      // cases for every undefined property
      event: {
        _def: {
          extendedProps: {
            image: '',
            releaseDate: '',
            platforms: [],
            description: ''
          },
          title: ''          
        },
        _calendar: {
          state: {
            viewType: ''
          }
        }
      },
      favorites: [],
      dimensions: {
        height: null,
        width: null
      },
      selectedOption: null,
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

    console.log(event)
    console.log(event._def.title)
    console.log(el)
    this.setState({ event: event })
    this.setState({ open: true });
    console.log(this.state.dimensions)

  }

  handleChange = selectedOption => {
    this.setState({ selectedOption: selectedOption });
    console.log(this.state.selectedOption);
    this.setState({ 
      
      event: {
        _def: {
          extendedProps: {
            image: selectedOption.value.image,
            releaseDate: selectedOption.value.date,
            platforms: selectedOption.value.platforms.map( platform => { return <span key={platform.name}>{platform.name} </span>} ),
            description: selectedOption.value.description
          },
          title: ''          
        },
        _calendar: {
          state: {
            viewType: ''
          }
        }
      }
    
    })
    this.setState({ open: true })
  }
 
  onCloseModal = () => {

    this.setState({ open: false });

  };

  onImgLoad = ({target:img}) => {
    this.setState({ dimensions: {
      height: img.offsetHeight,
      width: img.offsetWidth
    }});
  }

  addToFavorites = () => {

    if (this.state.favorites.includes(this.state.event._def.title)) {
      return
    }

    this.setState({ favorites: [...this.state.favorites, this.state.event._def.title]})

    

  }

  componentDidMount() {

    this.fetchGames();

  }

  render() {

    // Styles object for our modal 
    const styles = { overlay: { background: 'rgba(0, 0, 0, 0.35)' }}

    const filteredGames = this.state.games.filter(game => {
      return game.expected_release_day !== null
    })

    // Formatting API data so fullcalendar can use it
    const releases = filteredGames.map(release => {

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
      tempObj.platforms = release.platforms;
      tempObj.image = release.image.original_url;
      // After we pass the date to the calendar it becomes
      // difficult to retrieve, so we're passing it again
      // as an extendedProp to make it easy to get to
      tempObj.releaseDate = `${year}-${month}-${day}`;
      tempObj.description = (release.deck === null)
                            ? 'No description available.'
                            : release.deck.replace(/(<([^>]+)>)/ig,"")
      

      return tempObj

    })

    console.log(releases)

    // Since we're serving up two different views, we're going
    // to need to make some accommodations for different screen
    // sizes; overarching philosphy here is to minimize the extent
    // to which we serve up two different sites, so the number of
    // elements being <MediaQuery>'d are kept minimal and then we
    // use inline ternaries when necessary to make those accomodations,
    // which are mostly stylistic

    return (
      <div className="App">

        <header className="App-header">
          <h1 className="logotype">vgCal</h1>
          <Select
            className="search"
            value={this.state.selectedOption}
            onChange={this.handleChange}
            options={releases.map(release => {
              
              const tempObj = {}

              tempObj.value = release;
              tempObj.label = release.title;

              return tempObj;
            })}
          />
          <span></span>
        </header>

        <main>      

          <div className={"calendar-wrapper"}>

            <div className={"sidebar-left"}>
              <h2>Welcome to vgCal!</h2>
              <p>Here's some info about how to use the site:</p>
              <p>Click the left and right arrows above the calendar to change weeks or months. Click "today" to return to the present week or month.</p>
              <p>Click on a release date to get more information about that release</p>
              <p>Want to set a reminder for a release? Click on a release, click "Add to favorites" and then click "Export to ICS" in the favorites bar. Your browser will download a calendar file you can import into the calendar of your choosing, or email to yourself maybe</p>
            </div>

            {/* Weekly list view for phones / tablets */}
            <MediaQuery maxWidth={1199}>

              <FullCalendar 
                defaultView="listWeek" 
                plugins={[ listPlugin ]} 
                events={ releases }
                eventClick={ this.handleClick }
                height= { "auto" }
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
                height={ 850 }
              />
              
            </MediaQuery>

            <div className="sidebar-right">
              <div className="filtering-container">
                <h2 className="filters-header">Filtering options</h2>
                <div>These aren't functional yet :(</div>
                <input type="checkbox" id="XBox" name="Xbox" value="XBox" />
                <label htmlFor="XBox"> XBOX</label><br/>
                <input type="checkbox" id="Playstation" name="Playstation" value="Playstation" />
                <label htmlFor="Playstation"> Playstation</label><br/>
                <input type="checkbox" id="Switch" name="Switch" value="Switch" />
                <label htmlFor="Switch"> Switch</label><br/> 
                <input type="checkbox" id="PC" name="PC" value="PC" />
                <label htmlFor="PC"> PC</label><br/> 
              </div>
              <div className={"favorites-container"}>
                <h2 className="favorites-header">Your favorites</h2>
                <ul className="favorites-list">
                  {(this.state.favorites.length === 0)
                    ? <li>Add a game to your favorites list and you can export an ics file to add the release date to a calendar of your choice. Exports + persistent lists not working yet :(</li>
                    : this.state.favorites.map(favorite => {
                        return <li key={favorite}>{favorite}</li>
                    })
                  }
                </ul>
                <button>Export to ICS</button>
              </div>
            </div>

            <Modal 
              open={this.state.open} 
              onClose={this.onCloseModal}
              styles={styles}
            >
              <img 
                alt='boxart' 
                className='boxart' 
                src={this.state.event._def.extendedProps.image}
                onLoad={this.onImgLoad}
                // If on desktop and the image is too large, make it not as large
                style={ {'width': (this.state.event._calendar.state.viewType === 'dayGridMonth' && this.state.dimensions.height > 1000) ? '50%' : '100%' } }
              />
                
              <h2 className='modal-heading'>
                {this.state.event._def.title}
              </h2>
              <ul className="release-info">
                <li className="info"><strong>Release date:</strong> {this.state.event._def.extendedProps.releaseDate}</li>
                <li className="info"><strong>Platforms:</strong> {this.state.event._def.extendedProps.platforms.map( platform => { return <span key={platform.name}>{platform.name} </span>} )}</li>
                <li className="info"><strong>Description:</strong> {this.state.event._def.extendedProps.description}</li>
              </ul>
              <button 
                onClick={this.addToFavorites}
                className={(this.state.favorites.includes(this.state.event._def.title))
                  ? 'favorited fav-button'
                  : 'fav-button'                    
                }
              >
                  {(this.state.favorites.includes(this.state.event._def.title))
                    ? 'Added to favorites'
                    : 'Add to favorites'                    
                  }
                  
              </button>
              
            </Modal>

          </div>
        

        </main>
      </div>
    );
  }
}
