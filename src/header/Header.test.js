import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Context from '../Context';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

const someFunc = () => { console.log('Do stuff') };

const games = [{"id":6990,"boxart_url":"https://giantbomb1.cbsistatic.com/uploads/original/16/164924/3177373-0778025400-mediu.png","game_name":"Namcot Collection","game_description":"A collection of NES titles from Namco, from under their Namcot banner.","platforms":"Nintendo Switch","release_date_utc":"June 18, 2020","release_date_iso":"2020-06-18","release_day":"18","release_month":"06","release_year":"2020","release_quarter":null}]

it('Renders the header without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
        <Context.Provider value={ { handleSelect: () => { someFunc() }, games: games, setVisited: () => { someFunc() } } }>
            <Header />
        </Context.Provider>
    </BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders the header as expected', () => {
    
    const tree = renderer
        .create(
            
            <BrowserRouter>
                <Context.Provider value={ { handleSelect: () => { someFunc() }, games: games, setVisited: () => { someFunc() } } }>
                    <Header/>
                </Context.Provider>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})