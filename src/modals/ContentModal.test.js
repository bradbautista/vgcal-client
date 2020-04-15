import React from 'react';
import ReactDOM from 'react-dom';
import ContentModal from './ContentModal';
import Context from '../Context';
import { BrowserRouter } from 'react-router-dom';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Need to use Enzyme for modal snapshot tests b/c of
// react-test-renderer / js-dom issues

configure({ adapter: new Adapter() });

const game = {"platforms":"Nintendo Switch","image":"https://giantbomb1.cbsistatic.com/uploads/original/0/30/3177321-job.png","gameUrl":"/game/Good-Job!","gameTitle":"Good Job!","releaseDate":"March 26, 2020","description":"Solve workplace problems with the power of physics in this action puzzle game for the Nintendo Switch."}

const someFunc = () => { console.log('Do stuff') };

it('Renders the content modal without crashing', () => {
    const div = document.createElement('div');
    
    ReactDOM.render(<Context.Provider value={ 
        { 
            open: true, 
            onClose: () => someFunc(),
            game: game,
            addToFavorites: () => someFunc(),
            favorites: []
        }
    }><ContentModal /></Context.Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("renders the content modal correctly when the game is not favorited", () => {

    const subject = mount(
        <BrowserRouter>
            <Context.Provider value={ 
                { 
                    open: true, 
                    onClose: () => someFunc(),
                    game: game,
                    addToFavorites: () => someFunc(),
                    favorites: []
                }
            }>
                <ContentModal />
            </Context.Provider>
        </BrowserRouter>

    );
    expect(EnzymeToJson(subject)).toMatchSnapshot();
});

test("renders the content modal correctly when the game is favorited", () => {

    const subject = mount(
        <BrowserRouter>
            <Context.Provider value={ 
                { 
                    open: true, 
                    onClose: () => someFunc(),
                    game: game,
                    addToFavorites: () => someFunc(),
                    favorites: [game]
                }
            }>
                <ContentModal />
            </Context.Provider>
        </BrowserRouter>

    );
    expect(EnzymeToJson(subject)).toMatchSnapshot();
});