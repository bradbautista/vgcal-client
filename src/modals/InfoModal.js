import React, { Component } from 'react';
import Context from '../Context';
import './InfoModal.css';
import Modal from 'react-responsive-modal';

export default class InfoModal extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      };
  
    }

    static contextType = Context;    
  
    render() {

        // Styles object for our modal 
        const styles = { 
            overlay: { background: 'rgba(0, 0, 0, 0.35)' },
            modal: { padding: 0, borderRadius: '4px', backgroundColor: 'white', className: 'info-blodal' },
            closeButton: { cursor: 'pointer' },
            closeIcon: { fill: 'rgba(75, 75, 75, 0.75', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
          }
  
        return (
            <Modal
                open={ !this.context.hasVisited } 
                onClose={ () => this.context.setVisited(true) }
                styles={styles}
                // focusTrapped={true}
            >
                <div className={"info-modal"}>
                    <h2 className={"info-modal-header"}>Welcome to vgCal!</h2>
                    {/* <p className={"info-modal-prompt"}><strong>Here's some info about the site and how to use it:</strong></p> */}
                    <p className={"info-modal-graf"}>Click the left and right arrows above the calendar to change weeks or months. Click "today" to return to the present week or month.</p>
                    <p className={"info-modal-graf"}>Click on a release date to get more information about that release.</p>
                    <p className={"info-modal-prompt"}><strong>Want to set a reminder for a release?</strong></p>
                    <p className={"info-modal-graf"}>Click on a release, click "Add to favorites" and then click "Export to ICS" in the favorites bar. Your browser will download a calendar file you can import into the calendar of your choosing.</p>
                    <p className={"info-modal-prompt"}><strong>Want to navigate to a specific date via the URL bar?</strong></p> 
                    <p className={"info-modal-graf"}>Do it like this: https://vgcal.now.sh/date/12-31-2020</p>
                    <p className={"info-modal-prompt"}><strong>Want to navigate to a specific game via the URL bar?</strong></p> 
                    <p className={"info-modal-graf"}>Do it like this: https://vgcal.now.sh/game/Mount-&-Blade-II:-Bannerlord</p>
                    <p className={"info-modal-prompt"}><strong>I don't see the game I'm looking for.</strong></p> 
                    <p className={"info-modal-graf"}>vgCal uses the Giant Bomb API to populate its calendar. Add it to the <a className="gb-link" href="https://www.giantbomb.com/games/" target="_blank" rel="noopener noreferrer">Giant Bomb wiki</a> and it'll show up in the calendar — and lots of other places on the Internet!</p>
                    <p className={"info-modal-prompt"}><strong>Why does the calendar only span 2019 to 2021?</strong></p> 
                    <p className={"info-modal-graf"}>Right now vgCal's database is size-limited by the database provider. I'm looking into migrating the database to a different provider, which would allow for a much larger dataset.</p>
                    <p className={"info-modal-prompt"}><strong>Want to see this information again? Click the question-mark button in the header.</strong></p>
                               
                </div>
          </Modal>
        );
    }
  }