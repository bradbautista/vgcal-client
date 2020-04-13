import React, { Component } from 'react'
import Context from './../Context';
import './ContentModal.css';
import Modal from 'react-responsive-modal';

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
            modal: { padding: 0, borderRadius: '4px', width: '90%', backgroundColor: 'white'},
            closeButton: { cursor: 'pointer' },
            closeIcon: { fill: 'white', filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))' }
        }
      
        return(

            <Modal 
              open={this.context.open} 
              onClose={this.context.onCloseModal}
              styles={styles}
              focusTrapped={false}
            >
              <img 
                alt='boxart' 
                className='boxart' 
                src={this.context.game.image}
              />
                
              <h2 className='modal-heading'>
                {this.context.game.gameTitle}
              </h2>
              <ul className="release-info">
                <li className="info"><strong>Release date:</strong> {this.context.game.releaseDate}</li>
                <li className="info"><strong>Platforms:</strong> {this.context.game.platforms}</li>
                <li className="info"><strong>Description:</strong> {this.context.game.description}</li>
                <button 
                onClick={this.context.addToFavorites}

                // Some returns a boolean!
                className={(this.context.favorites.some(favorite => favorite.gameTitle === this.context.game.gameTitle))
                  ? 'favorited fav-button'
                  : 'unfavorited fav-button'                    
                }
                >
                  {(this.context.favorites.some(favorite => favorite.gameTitle === this.context.game.gameTitle))
                    ? 'Added to favorites'
                    : 'Add to favorites'                    
                  }
                  
                </button>
              </ul>
              
              
            </Modal>
        )
    }
}