import React, { Component } from 'react';
import Context from '../Context';
import './InfoModal.css';
import Modal from 'react-responsive-modal';
import Collapsible from 'react-collapsible';
import wave from '../images/wave.gif'

export default class InfoModal extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
      };
  
    }

    static contextType = Context;    
  
    render() {

        const styles = { 
            overlay: { background: 'rgba(0, 0, 0, 0.35)' },
            modal: { padding: 0, borderRadius: '4px', backgroundColor: 'white' },
            closeButton: { cursor: 'pointer' },
            closeIcon: { fill: 'white', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
        };
  
        return (
            <Modal
                open={ !this.context.hasVisited } 
                onClose={ () => this.context.setVisited(true) }
                styles={styles}
                focusTrapped={false}
                classNames = {{ overlay: 'react-responsive-modal-overlay', modal: 'react-responsive-modal' }}
            >
                <img 
                    alt='hello' 
                    className='boxart' 
                    src={wave}
                />
                <div className={"info-modal"}>

                    <h2 className={"info-modal-header"}>Welcome to vgCal!</h2>
                    <h3 className={"info-modal-lede"}>vgCal helps you find video-game release information quickly.</h3>

                    <p className={"info-modal-graf"}>For more info on how to use the site, click a heading below. To see this info again, click on the question-mark button in the top bar.</p>

                    <Collapsible
                        trigger={`How do I use this?`}
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>Click the left and right arrows above the calendar to change weeks or months. Click "today" to return to the present week or month.</p>
                        <p className={"info-modal-graf"}>Click on a release to get more information about that release.</p>
                        <p className={"info-modal-graf"}>Know the name of the game but not the date? You can search for it in the searchable dropdown in the top bar.</p>
                    </Collapsible>

                    <Collapsible
                        trigger={`What does "Export to ICS" do?`}
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>Click on a release, click "Add to favorites" and it will show up in your favorites list. With one or more favorites in your list, click "Export to ICS" in the favorites bar. Your browser will download a calendar file you can import into the calendar of your choosing with the release dates as events.</p>

                        <p className={"info-modal-graf"}>vgCal will remember your favorites, but will forget them if you switch devices or browsers.</p>
                    </Collapsible>

                    <Collapsible
                        trigger="I want to go to a specific date."
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>Do it like this: https://vgcal.now.sh/date/12-31-2020</p>
                    </Collapsible>

                    <Collapsible
                        trigger="I want to go to a specific game."
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>Do it like this: https://vgcal.now.sh/game/Mount-&-Blade-II:-Bannerlord</p>
                    </Collapsible>

                    <Collapsible
                        trigger="I don't see the game I'm looking for."
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>If a game has a set release date, it'll show up on the calendar. If it has an ambiguous release date (like September 2020), you can look for it in the searchable dropdown. Still don't see it? vgCal uses the Giant Bomb API to populate its calendar. Add it to the <a className="gb-link" href="https://www.giantbomb.com/games/" target="_blank" rel="noopener noreferrer">Giant Bomb wiki</a> and it'll show up in the calendar — and lots of other places on the Web!</p>
                    </Collapsible>

                    <Collapsible
                        trigger="Why does the calendar only span 2019 to 2021?"
                        className="collapsible"
                        openedClassName="collapsible"
                        triggerClassName="info-modal-prompt trigger"
                        triggerOpenedClassName="info-modal-prompt trigger"
                        transitionTime={275}
                    >
                        <p className={"info-modal-graf"}>Right now vgCal's database is size-limited by the database provider. I'm looking into migrating the database to a different provider, which would allow for a much larger dataset.</p>
                    </Collapsible>
                               
                </div>
          </Modal>
        );
    }
  }