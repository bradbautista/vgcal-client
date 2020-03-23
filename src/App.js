import React, { Component } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/list/main.css';
import MediaQuery from 'react-responsive';
import GameRouteForMobile from './GameRouteForMobile';
import GameRouteForDesktop from './GameRouteForDesktop';
import Modal from 'react-responsive-modal';
import Context from './Context'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from './Header'
import InfoSidebar from './infoSidebar'
import FilteringSidebar from './filteringSidebar'
import LoadingOverlay from 'react-loading-overlay';
import PacmanLoader from "react-spinners/PacmanLoader";
import './App.css';
import config from './config';
import moment from 'moment';
import error from './images/error.jpg';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      releases: [],
      favorites: [],
      open: false,
      loading: null,
      game: {
        date: undefined,
        platforms: [],
      },
      error: false,
      timer: 0,
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
      this.filterReleases(games)
    })
    .catch(error => {
      console.log(error);
    })

  }

  filterReleases = (games) => {

    console.log(games)

    const filteredGames = games.filter(game => {
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
      // Note these are distinct from title and url; the calendar uses
      // those properties in a way that makes it difficult to consume
      // and use them, so we're naming these such that they'll get passed
      // in extendedProps
      tempObj.gameUrl = `/game/${release.name.split(' ').join('-')}`;
      tempObj.gameTitle = release.name;
      // After we pass the date to the calendar it becomes
      // difficult to retrieve, so we're passing it again
      // as an extendedProp to make it easy to get to
      tempObj.releaseDate = `${year}-${month}-${day}`;
      tempObj.description = (release.deck === null)
                            ? 'No description available.'
                            : release.deck.replace(/(<([^>]+)>)/ig,"")
      

      return tempObj

    })

    // console.log(this.state.games)

    this.setState({ releases: [...releases] })

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

  handleClick = ({ event }) => {

    // event.preventDefault()

    // console.log(event)
    console.log(event._def.title)
    console.log(this)
    this.setState({ game: event._def.extendedProps })
    this.setState({ open: true });
    window.history.pushState({}, 'vgCal', event._def.extendedProps.gameUrl);
  }

  handleChange = selectedOption => {

    console.log(selectedOption);
    this.setState({game: selectedOption.value})
    this.setState({ selectedOption: selectedOption });
    this.setState({ open: true })
    window.history.pushState({}, 'vgCal', selectedOption.value.gameUrl);
  }

  formatPlatforms = (platforms) => {
    return platforms.map(platform => platform.name).join(', ');
  }

  formatDate = (date) => {
    return moment(date).format('MMMM D, YYYY')
  }
 
  onCloseModal = () => {

    this.setState({ open: false });
    this.setState({ error: false });
    window.history.pushState({}, 'vgCal', '/');

  };

  addToFavorites = () => {

    if (this.state.favorites.includes(this.state.game.gameTitle)) {
      return
    }

    this.setState({ favorites: [...this.state.favorites, this.state.game.gameTitle]})    

  }

  setStateAsync(state) {
    console.log(state)
    return new Promise((resolve) => {
      this.setGame(state, resolve)
  });
  }

  waitForGame = () => {

    const gameName = window.location.pathname;

    const selectedGame = this.state.releases.filter(game => game.gameUrl === gameName);

    // console.log(selectedGame)

    // this.setOpen(false)
    // setTimeout(this.setGame(selectedGame), 1500)
    // setTimeout(this.setOpen(true), 2000)


    // if (typeof this.state.game.platforms !== "undefined") {
    //   this.setGame(selectedGame);
    //   this.setLoading(false);
    //   this.setOpen(true)
    // } else if (this.state.timer > 7) {
    //   this.setError(true)
    //   this.setLoading(false)
    // } else {
    //   this.setState({ timer: this.state.timer + 1});
    //   this.setLoading(true);
    //   this.setOpen(false);
    //   setTimeout(this.waitForGame, 5000);
    //   console.log(this.state.timer)
    // }

  }

  syncViews = () => {
    
    this.setStateAsync(this.state.game)

  }

  componentDidMount() {

    this.fetchGames();
    // this.filterReleases(this.state.games);

  }

  render() {

    // Styles object for our modal 
    const styles = { 
      overlay: { background: 'rgba(0, 0, 0, 0.35)' },
      modal: { padding: 0, borderRadius: '4px', width: '80%', backgroundColor: 'white' },
      closeButton: { cursor: 'pointer' },
      closeIcon: { fill: 'white', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
    }

    const platforms = this.formatPlatforms(this.state.game.platforms)
    const date = this.formatDate(this.state.game.releaseDate)

    const contextValue = {
      releases: this.state.releases,
      open: this.state.open,
      favorites: this.state.favorites,
      game: this.state.game,
      error: this.state.error,
      loading: this.state.loading,
      onCloseModal: this.onCloseModal,
      handleChange: this.handleChange,
      handleClick: this.handleClick,
      setGame: this.setGame,
      formatPlatforms: this.formatPlatforms,
      formatDate: this.formatDate,
      setOpen: this.setOpen,
      setLoading: this.setLoading,
      setError: this.setError
    }

    // Since we're serving up two different views, we're going
    // to need to make some accommodations for different screen
    // sizes; overarching philosphy here is to minimize the extent
    // to which we serve up two different sites, so the number of
    // elements being <MediaQuery>'d are kept minimal

    return (
      <Context.Provider value={contextValue}>
      <div className="App">

        <Header releases={this.context.releases} />

        <main>      

          <div className={"calendar-wrapper"}>

            {/* Landing page info */}
            <InfoSidebar/>

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

                {/* Root */}
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
                      {...props}
                      />
                    )
                  }}
                />

                {/* Specified date */}
                <Route 
                  path="/date/:date"
                  render={(props) => {

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
                      defaultDate={ isDateValid ? providedDate : null }                    
                      />
                    )
                  }}
                />

                {/* Specified game */}
                <Route path="/game/:game" component={GameRouteForMobile} />                  
                    

              </MediaQuery>

              {/* Month grid view for laptops/desktops */}
              <MediaQuery 
                minWidth={1200}
                onChange={this.syncViews}
              >
      
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
                      // height={ "auto" }
                      {...props}
                      />
                    )
                  }}
                />

                <Route 
                  path="/date/:date"
                  render={(props) => {

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
                      defaultDate={ isDateValid ? providedDate : null }
                      />
                    )
                  }}
                />

                {/* Specified game */}
                <Route path="/game/:game" component={GameRouteForDesktop} /> 
                
              </MediaQuery>

            </LoadingOverlay>

            {/* Filtering & favorites */}
            <FilteringSidebar favorites={this.state.favorites} />

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
                <li className="info"><strong>Release date:</strong> {date}</li>
                <li className="info"><strong>Platforms:</strong> {platforms}</li>
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
