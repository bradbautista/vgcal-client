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
        console.log(this.context)

        const selectedGame = this.context.releases.filter(game => game.gameUrl.split('/').pop() === gameName).shift();

        if (typeof selectedGame !== "undefined") {
            this.context.setGame(selectedGame)
            this.context.setLoading(false)
            this.context.setOpen(true)
        } else if (this.state.timer > 7) {
            this.context.setError(true)
            this.context.setLoading(false)
        }
        else {
            this.setState({ timer: this.state.timer + 1 })
            this.context.setLoading(true)
            setTimeout(this.waitForGame, 1000);
            console.log(this.state.timer)
        }
    }

    componentDidMount() {   
        
        this.waitForGame()

    }
  
    render() {
  
        return (
            
            <>               
                <FullCalendar 
                defaultView="listWeek" 
                plugins={[ listPlugin ]} 
                events={ this.context.releases }
                eventClick={ this.context.handleClick }
                datesRender={ (info) => this.context.paintUrl(info) }
                height={ "auto" }
                />
            </>
            
        );
    }
  }