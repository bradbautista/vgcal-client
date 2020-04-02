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
  
        const endpoint = config.VGRDC_API_ENDPOINT;
        const url = `${endpoint}api/favorites/generate`;
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
            fileDownload(blob, 'gamereleases.ics')
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
                <ul className="favorites-list">
                  {(this.context.favorites.length === 0)
                    ? <li>Add games to your favorites list and you can export an ics file to add the release dates to your personal calendar. To delete a game from the list, just click on it.</li>
                    : this.context.favorites.map(favorite => {
                        return <li key={favorite.gameTitle} onClick={() => this.context.removeFromFavorites(favorite)}>{favorite.gameTitle}</li>
                    })
                  }
                </ul>
                <button
                  onClick={() => this.getICS() }
                >Export to ICS</button>
        </div>
      );
    }
  }