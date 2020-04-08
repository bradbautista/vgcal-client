import React, { Component } from 'react'
import Context from '../../Context';
import config from '../../config';
import fileDownload from 'js-file-download';

  export default class favoritesList extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    getICS = () => {

        const releaseInfo = this.context.favorites.map(favorite => {
  
          const obj = {}
  
          obj.gameTitle = favorite.gameTitle;
          obj.releaseDate = favorite.releaseDate;
          obj.releaseDay = favorite.releaseDay;
  
          return obj;
  
        })
  
        const endpoint = config.VGCAL_API_FAVORITES_ENDPOINT;
        const url = `${endpoint}generate`;
        const options = {
          method: 'POST',
          body: JSON.stringify(releaseInfo),
          headers: {
            'content-type': 'application/json'
          }
        };
    
        return fetch(url, options)
          .then(res => {
            return res.blob();
          })
          .then(blob => {
            fileDownload(blob, 'vgCal-game-releases.ics');
            this.context.clearFavorites();
          })
          .catch(error => {
            console.error(error);
          });
  
    };

    static contextType = Context; 
  
    render() {
  
      return (
        <div className={"favorites-container"}>
                <h2 className="favorites-header">Your favorites</h2>
                {(this.context.favorites.length === 0)
                  ? ''
                  : <p>To delete a game from the list, click on it.</p>
                }
                <ul className="favorites-list">
                  {(this.context.favorites.length === 0)
                    ? <li className="favorites-prompt">Add games to your favorites list and you can export an ics file to add the release dates to your personal calendar.</li>
                    : this.context.favorites.map(favorite => {
                        return <li className="favorite" key={favorite.gameTitle} onClick={() => this.context.removeFromFavorites(favorite)}>{favorite.gameTitle}</li>
                    })
                  }
                </ul>
                <button
                  disabled={(this.context.favorites.length === 0)}
                  className={"export-button"}
                  onClick={() => this.getICS() }
                >Export to ICS</button>
        </div>
      );
    }
  }