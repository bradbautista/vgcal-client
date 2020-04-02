import React, { Component } from 'react'
import './infoSidebar.css'
  
  export default class InfoSidebar extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      };
  
    }
  
    render() {
  
      return (
        <div className="column-flex-container">
          <div className={"info-sidebar"}>
              <h2 className={"info-sidebar-header"}>Welcome to vgCal!</h2>
              <p className={"info-graf"}>Here's some info about how to use the site:</p>
              <p className={"info-graf"}>Click the left and right arrows above the calendar to change weeks or months. Click "today" to return to the present week or month.</p>
              <p className={"info-graf"}>Click on a release date to get more information about that release.</p>
              <p className={"info-graf"}>Want to set a reminder for a release? Click on a release, click "Add to favorites" and then click "Export to ICS" in the favorites bar. Your browser will download a calendar file you can import into the calendar of your choosing, or email to yourself maybe</p>
              <p className={"info-graf"}>Want to navigate to a specific date? Do it like this: https://vgcal.now.sh/date/20-12-01</p>
              <p className={"info-graf"}>Want to navigate to a specific game? Do it like this: https://vgcal.now.sh/game/Mount-&-Blade-II:-Bannerlord</p>
              
        </div>
      </div>
      );
    }
  }