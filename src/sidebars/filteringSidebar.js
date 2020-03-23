import React, { Component } from 'react'
import './filteringSidebar.css'
  
  export default class FilteringSidebar extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      };
  
    }
  
    render() {
  
        return (
          <div className="column-flex-container">
            <div className="filtering-sidebar">
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
              {/* TODO: MAKE FAVORITES CONTAINER ITS OWN COMPONENT */}
              <div className={"favorites-container"}>
                <h2 className="favorites-header">Your favorites</h2>
                <ul className="favorites-list">
                  {(this.props.favorites.length === 0)
                    ? <li>Add a game to your favorites list and you can export an ics file to add the release date to a calendar of your choice. Exports + persistent lists not working yet :(</li>
                    : this.props.favorites.map(favorite => {
                        return <li key={favorite}>{favorite}</li>
                    })
                  }
                </ul>
                <button>Export to ICS</button>
              </div>
            </div>
          </div>
        );
    }
  }