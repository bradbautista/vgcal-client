import React, { Component } from 'react';
import Context from './Context';
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import './GameRoute.css';

export default class GameRouteForMobile extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        timer: 0,
      };
    }

    static contextType = Context;

    waitForGame = () => {

        const gameName = this.props.match.params.game;

        console.log(gameName)

        const selectedGame = this.context.games.filter(game => game.game_name.split(' ').join('-') === gameName)

        // Because the information in this.state.games is structured
        // differently than that in this.state.releases, but this.state.game
        // dependents rely on the releases structure, we must give
        // this data the same treatment it gets for consumption by the
        // select component

        const formattedGameObject = selectedGame.map(game => {
              
            const tempObj = {};

            tempObj.platforms = game.platforms;
            tempObj.image = game.boxart_url;
            tempObj.gameUrl = `/game/${game.game_name.split(' ').join('-')}`;
            tempObj.gameTitle = game.game_name;
            tempObj.releaseDate = game.release_date_utc;
            tempObj.description = game.game_description;

            return tempObj;

        }).shift();

        if (typeof formattedGameObject !== "undefined") {
            this.context.setGame(formattedGameObject);
            this.context.setLoading(false);
            this.context.setOpen(true);
        } else if (this.state.timer > 5) {
            this.context.setError(true);
            this.context.setLoading(false);
        }
        else {
            this.setState({ timer: this.state.timer + 1 })
            this.context.setLoading(true);
            setTimeout(this.waitForGame, 1000);
        }
    }

    componentDidMount() {   
        this.waitForGame();
    }
  
    render() {
  
        return (
            <>               
                <FullCalendar 
                defaultView="listWeek" 
                plugins={[ listPlugin ]} 
                events={ this.context.releases }
                eventClick={ this.context.handleClick }
                ref={this.context.calendar}
                datesRender={ (info) => this.context.paintUrl(info) }
                height={ "auto" }
                />
            </>
        );
    }
  }