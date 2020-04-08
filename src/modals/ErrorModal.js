import React, { Component } from 'react'
import Context from './../Context';
import './ErrorModal.css';
import Modal from 'react-responsive-modal';
import error from '../images/error.jpg';

  export default class ErrorModal extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    static contextType = Context; 
 
    render() {

        const styles = { 
            overlay: { background: 'rgba(0, 0, 0, 0.35)' },
            modal: { padding: 0, borderRadius: '4px', width: '80%', backgroundColor: 'white' },
            closeButton: { cursor: 'pointer' },
            closeIcon: { fill: 'white', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
        }
      

        return(

            <Modal 
              open={ this.context.error } 
              onClose={ this.context.onCloseModal }
              styles={styles}
            >
              <img 
                  alt='error' 
                  className='error' 
                  src={error}
              />
                  
              <h2 className='error-heading'>
                  Bad link? vgCal can't find that game, or it doesn't exist. Reload to try again, or give up.
              </h2>
              
            </Modal>
        )
    }
}