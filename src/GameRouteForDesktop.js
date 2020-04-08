import React, { Component } from 'react';
import Context from './Context';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './GameRoute.css';

export default class GameRouteForDesktop extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
          timer: 0,
        };
    }

    static contextType = Context;

    waitForGame = () => {

        const gameName = this.props.match.params.game;

        const selectedGame = this.context.releases.filter(game => game.gameUrl.split('/').pop() === gameName).shift();

        if (typeof selectedGame !== "undefined") {
            this.context.setGame(selectedGame);
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
                defaultView="dayGridMonth" 
                plugins={[ dayGridPlugin ]} 
                events={ this.context.releases }
                eventClick={ this.context.handleClick }
                ref={this.context.calendar}
                datesRender={ (info) => this.context.paintUrlDesktop(info) }
                height={ "auto" }
                />
            </>
        );
    }
}