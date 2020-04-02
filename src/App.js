import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import MediaQuery from 'react-responsive';
import GameRouteForMobile from './GameRouteForMobile';
import GameRouteForDesktop from './GameRouteForDesktop';
import Modal from 'react-responsive-modal';
import Context from './Context';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './Header';
import InfoSidebar from './sidebars/infoSidebar/infoSidebar';
import FilteringSidebar from './sidebars/filteringSidebar/filteringSidebar';
import LoadingOverlay from 'react-loading-overlay';
import PacmanLoader from "react-spinners/PacmanLoader";
import './App.css';
import config from './config';
import moment from 'moment';
import error from './images/error.jpg';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.calendar = React.createRef()
    this.checkboxes = []
    this.state = {
      games: [],
      releases: [],
      filters: [],
      favorites: [],
      open: false,
      loading: null,
      game: {
        date: undefined,
        platforms: [],
      },
      error: false,
      lastVisited: '/'
    };

  }

  static contextType = Context;

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
      this.setDefaultReleases(games)
    })
    .catch(error => {
      console.log(error);
    })

  }

  setDefaultReleases = (games) => {

    const filteredGames = games.filter(game => {
      return game.release_date_ISO !== null
    })

    // Formatting API data for consumption by fullcalendar
    const releases = filteredGames.map(release => {

      const tempObj = {};
  
      tempObj.title = release.game_name;
      tempObj.date = release.release_date_iso;
      tempObj.platforms = release.platforms;
      tempObj.image = release.boxart_url;
      // Note these are distinct from title and url; the calendar uses
      // those properties in a way that makes it difficult to consume
      // and use them, so we're naming these such that they'll get passed
      // in the event object's extendedProps
      tempObj.gameUrl = `/game/${release.game_name.split(' ').join('-')}`;
      tempObj.gameTitle = release.game_name;
      // Here we're passing the human-readable release date as an extendedProp 
      // to make it easy to retrieve
      tempObj.releaseDate = release.release_date_utc;
      tempObj.releaseDay = release.release_date_iso;
      tempObj.description = release.game_description;
      
      return tempObj

    })

    this.setReleases(releases);

  }

  setReleases = (releases) => {
    this.setState({ releases: [...releases] })
  }

  setFilters = (filters) => {
    this.setState({ filters: [...filters] })
  }

  setGame = (game) => {
    this.setState({ game: game })
  }

  setLoading = (bool) => {
    this.setState({ loading: bool })
  }

  setOpen = (bool) => {
    this.setState({ open: bool })
  }

  setError = (bool) => {
    this.setState({ error: bool })
  }

  setLastVisited = (str) => {
    this.setState({ lastVisited: str })
  }

  handleClick = ({ event }) => {

    this.setState({ game: event._def.extendedProps })
    this.setState({ open: true });
    window.history.pushState({}, 'vgCal', event._def.extendedProps.gameUrl);

  }

  handleSelect = selectedGame => {

    this.setState({game: selectedGame.value})
    this.setState({ open: true })
    window.history.pushState({}, 'vgCal', selectedGame.value.gameUrl);

  }
 
  onCloseModal = () => {

    this.setOpen(false);
    this.setError(false);
    window.history.pushState({}, 'vgCal', this.state.lastVisited);

  };

  addToFavorites = () => {

    if (this.state.favorites.includes(this.state.game.gameTitle)) {
      return
    }

    this.setState({ favorites: [...this.state.favorites, this.state.game]})

    // LocalStorage calls get made too early to retrieve data,
    // so wait a beat
    setTimeout(this.addToLocalStorage(), 50);

  }

  removeFromFavorites = (favoriteToRemove) => {

    console.log(favoriteToRemove)

    const newFavorites = this.state.favorites.filter(favorite => favorite.gameTitle !== favoriteToRemove.gameTitle)

    this.setState({ favorites: [...newFavorites]})

    setTimeout(this.addToLocalStorage, 50);

  }

  addToLocalStorage = () => {

    window.localStorage.clear()
    
    // LocalStorage needs a key and a value, and a hot sec
    setTimeout(() => {
        window.localStorage.setItem('vgCalFavorites', JSON.stringify(this.state.favorites))
    }, 50)
    
  }

  detectLocalStorage = () => {

    console.log('Detecting local storage')

    const favorites = JSON.parse(window.localStorage.getItem('vgCalFavorites'));

    console.log(favorites)

    if (favorites === null) {
      return
    } else {

      this.setState({ favorites: [...favorites]})

    }


  }

  setStateAsync(gameState, openState, errorState) {

    return new Promise((resolve) => {
      this.setOpen(openState, resolve)
      this.setGame(gameState, resolve)
      this.setError(errorState, resolve)
    });

  }

  syncViews = () => {
    
    this.setStateAsync(this.state.game, this.state.open, this.state.error)

  }

  loadReleases = () => {
    
    if (this.state.releases.length > 0) {
      this.setLoading(false)
    } else {
      this.setLoading(true)
      setTimeout(this.loadReleases, 1000)
    }

  }

  paintUrl = (info) => {

    const currentDate = moment()._d
    const formattedCurrentDate = moment(currentDate).format('YYYY-MM-DD')
    const formattedDates = info.view.dayDates.map(date => {
      return moment(date).format('YYYY-MM-DD')
    })
    const pathnameArray = window.location.pathname.split('/')

    if (pathnameArray.includes('game')) {
      return
    } else if (formattedDates.includes(formattedCurrentDate)) {
      window.history.pushState({}, 'vgCal', '/');
    } else {
      window.history.pushState({}, 'vgCal', `/date/${formattedDates[0]}`);
      this.setLastVisited(`/date/${formattedDates[0]}`)
    }
    
  }

  paintUrlDesktop = (info) => {

    const currentMonth = moment()._d
    const formattedCurrentMonth = moment(currentMonth).format('MMMM YYYY')
    const currentCalendarMonth = info.view.title
    const dateArray = moment(currentCalendarMonth, 'MMMM YYYY').format('MM YYYY').split(' ')
    dateArray.splice(1, 0, '01')
    const dateToPaintToUrl = dateArray.join('-')
    const pathnameArray = window.location.pathname.split('/')

    if (pathnameArray.includes('game')) {
      return
    } else if (formattedCurrentMonth === currentCalendarMonth) {
      window.history.pushState({}, 'vgCal', '/');
    } else {
      window.history.pushState({}, 'vgCal', `/date/${dateToPaintToUrl}`);
      this.setLastVisited(`/date/${dateToPaintToUrl}`)
    }

  }

  componentDidMount() {

    this.fetchGames();
    this.loadReleases();
    this.detectLocalStorage();

  }

  render() {

    // Styles object for our modal 
    const styles = { 
      overlay: { background: 'rgba(0, 0, 0, 0.35)' },
      modal: { padding: 0, borderRadius: '4px', width: '80%', backgroundColor: 'white' },
      closeButton: { cursor: 'pointer' },
      closeIcon: { fill: 'white', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
    }

    const contextValue = {
      games: this.state.games,
      releases: this.state.releases,
      filters: this.state.filters,
      favorites: this.state.favorites,
      game: this.state.game,
      open: this.state.open,
      error: this.state.error,
      loading: this.state.loading,
      calendar: this.calendar,
      checkboxes: this.checkboxes,
      setDefaultReleases: this.setDefaultReleases,
      onCloseModal: this.onCloseModal,
      handleSelect: this.handleSelect,
      handleClick: this.handleClick,
      removeFromFavorites: this.removeFromFavorites,
      setReleases: this.setReleases,
      setFilters: this.setFilters,
      setGame: this.setGame,
      setOpen: this.setOpen,
      setLoading: this.setLoading,
      setError: this.setError,
      paintUrl: this.paintUrl,
      paintUrlDesktop: this.paintUrlDesktop,
      setLastVisited: this.setLastVisited
    }

    // Since we're serving up two different views for mobile
    // and desktop and because we're using React Router, 
    // we need routes for each required URL for each view. 
    // This gives us a total of eight (!) routes:
    // -- Root * 2
    // -- /date/:date * 2
    // -- /game/:game * 2
    // -- Bad URL * 2

    return (
      <Context.Provider value={contextValue}>
      <div className="App">

        <Header />

        <main>      

          <div className={"calendar-wrapper"}>

            {/* Landing page info */}
            <InfoSidebar/>

            {/* Our loading overlay wraps all of our calendar components */}
            <LoadingOverlay
            active={this.state.loading}
            spinner={<PacmanLoader
                size={20}
                color={"yellow"}
              />}
            text=''
            styles={{zIndex: 10}}
            >

              {/* Weekly list view for phones / tablets */}
              <MediaQuery 
                maxWidth={1199}
                onChange={ this.syncViews }
              >

                <Switch>

                  {/* Root - mobile */}
                  <Route 
                    exact path="/"
                    render={(props) => {
                      return (
                        <FullCalendar 
                          defaultView="listWeek" 
                          plugins={[ listPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          height={ "auto" }
                          ref={this.calendar}
                          datesRender={ (info) => this.paintUrl(info) }
                          {...props}
                        />
                      )
                    }}
                  />

                  {/* Specified date - mobile */}
                  <Route 
                    path="/date/:date"
                    render={(props) => {

                      // URL date validation
                      const providedDate = props.match.params.date;
                      const parsedDate = providedDate.split('-');
                      const isDateValid = (
                        parsedDate.length === 3 && 
                        parsedDate[0].length === 4 &&
                        parsedDate[1].length === 2 &&
                        parsedDate[2].length === 2 &&
                        /* eslint no-self-compare: off */
                        // Checking for NaN; method described here:
                        // http://adripofjavascript.com/blog/drips/the-problem-with-testing-for-nan-in-javascript.html
                        // tldr: NaN is not equal to itself
                        (parsedDate.every(element => parseInt(element) === parseInt(element)))
                      )

                      return (
                        <FullCalendar 
                          defaultView="listWeek" 
                          plugins={[ listPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          height={ "auto" }
                          ref={this.calendar}
                          datesRender={ (info) => this.paintUrl(info) }
                          defaultDate={ isDateValid ? providedDate : null }                    
                        />
                      )
                    }}
                  />

                  {/* Specified game - mobile */}
                  <Route path="/game/:game" component={GameRouteForMobile} />

                  {/* Bad URL - mobile */}
                  <Route 
                    render={(props) => {
                      return (
                        <FullCalendar 
                          defaultView="listWeek" 
                          plugins={[ listPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          ref={this.calendar}
                          fixedWeekCount={ false }
                          datesRender={ (info) => this.paintUrl(info) }
                          {...props}
                        />
                      )
                    }}
                  />

                </Switch>                  
                    
              </MediaQuery>

              {/* Month grid view for laptops/desktops */}
              <MediaQuery 
                minWidth={1200}
                onChange={this.syncViews}
              >

                <Switch>

                  {/* Root - desktop */}
                  <Route 
                    exact path="/"
                    render={(props) => {
                      return (
                        <FullCalendar 
                          defaultView="dayGridMonth" 
                          plugins={[ dayGridPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          fixedWeekCount={ false }
                          // contentHeight={ 600 }
                          height={ "auto " }
                          ref={this.calendar}
                          gotoDate={ "auto" }
                          datesRender={ (info) => this.paintUrlDesktop(info) }
                          {...props}
                        />
                      )
                    }}
                  />

                  {/* Specified date - desktop */}
                  <Route 
                    path="/date/:date"
                    render={(props) => {

                      // URL date validation
                      const providedDate = props.match.params.date;
                      const parsedDate = providedDate.split('-');
                      const isDateValid = (
                        parsedDate.length === 3 && 
                        parsedDate[0].length === 4 &&
                        parsedDate[1].length === 2 &&
                        parsedDate[2].length === 2 &&
                        /* eslint no-self-compare: off */
                        // Checking for NaN on parseInt(); method described here:
                        // http://adripofjavascript.com/blog/drips/the-problem-with-testing-for-nan-in-javascript.html
                        // tldr: NaN is not equal to itself
                        (parsedDate.every(element => parseInt(element) === parseInt(element)))
                      )

                      return (
                        <FullCalendar 
                          defaultView="dayGridMonth" 
                          plugins={[ dayGridPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          fixedWeekCount={ false }
                          height={ "auto" }
                          ref={this.calendar}
                          datesRender={ (info) => this.paintUrlDesktop(info) }
                          defaultDate={ isDateValid ? providedDate : null }
                        />
                      )
                    }}
                  />

                  {/* Specified game - desktop */}
                  <Route path="/game/:game" component={GameRouteForDesktop} />

                  {/* Bad URL - desktop */}
                  <Route 
                    render={(props) => {
                      return (
                        <FullCalendar 
                          defaultView="dayGridMonth" 
                          plugins={[ dayGridPlugin ]} 
                          events={ this.state.releases }
                          eventClick={ this.handleClick }
                          fixedWeekCount={ false }
                          ref={this.calendar}
                          datesRender={ (info) => this.paintUrlDesktop(info) }
                          height={ "auto" }
                          {...props}
                        />
                      )
                    }}
                  />

                </Switch>
                
              </MediaQuery>

            </LoadingOverlay>

            {/* Filtering & favorites */}
            <FilteringSidebar />

            {/* Content modal */}

            <Modal 
              open={this.state.open} 
              onClose={this.onCloseModal}
              styles={styles}
              focusTrapped={false}
            >
              <img 
                alt='boxart' 
                className='boxart' 
                src={this.state.game.image}
                onLoad={this.onImgLoad}
              />
                
              <h2 className='modal-heading'>
                {this.state.game.gameTitle}
              </h2>
              <ul className="release-info">
                <li className="info"><strong>Release date:</strong> {this.state.game.releaseDate}</li>
                <li className="info"><strong>Platforms:</strong> {this.state.game.platforms}</li>
                <li className="info"><strong>Description:</strong> {this.state.game.description}</li>
                <button 
                onClick={this.addToFavorites}
                style={{ backgroundImage: `url(${this.state.game.image})` }}
                className={(this.state.favorites.includes(this.state.game.title))
                  ? 'favorited fav-button'
                  : 'fav-button'                    
                }
                >
                  {(this.state.favorites.includes(this.state.game.title))
                    ? 'Added to favorites'
                    : 'Add to favorites'                    
                  }
                  
                </button> 
              </ul>
              
              
            </Modal>

            {/* Error modal  */}

            <Modal 
              open={ this.state.error } 
              onClose={ this.onCloseModal }
              styles={styles}
            >
              <img 
                  alt='error' 
                  className='error' 
                  src={error}
              />
                  
              <h2 className='error-heading'>
                  Bad link? vgCal can't find that game, or it doesn't exist. Reload to try again, or give up, skeleton.
              </h2>
              
            </Modal>


          </div>
        </main>
      </div>
      </Context.Provider>
    );
  }
}
