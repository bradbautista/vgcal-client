import React from 'react';
import ReactDOM from 'react-dom';
import GameRouteForDesktop from './GameRouteForDesktop';
import Context from './Context';
import { BrowserRouter } from 'react-router-dom';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Need to use Enzyme for these route snapshot tests b/c of 
// react-test-renderer / js-dom issues

configure({ adapter: new Adapter() });

const someFunc = () => { console.log('Do stuff') };

const match = { params : { game: 'Namcot-Collection'} }

const games = [{"id":6990,"boxart_url":"https://giantbomb1.cbsistatic.com/uploads/original/16/164924/3177373-0778025400-mediu.png","game_name":"Namcot Collection","game_description":"A collection of NES titles from Namco, from under their Namcot banner.","platforms":"Nintendo Switch","release_date_utc":"June 18, 2020","release_date_iso":"2020-06-18","release_day":"18","release_month":"06","release_year":"2020","release_quarter":null}]

it('Renders the calendar without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
        <Context.Provider value={ { games: games, handleClick: () => { someFunc() }, calendar: React.createRef(), paintUrlDesktop: () => { someFunc() }, setGame: () => { someFunc() }, setLoading: () => { someFunc() }, setError: () => { someFunc() }, setOpen: () => { someFunc() } } }>
            <GameRouteForDesktop match={match} />
        </Context.Provider>
    </BrowserRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("resolves the url and renders the calendar", () => {

    const subject = mount(
        <BrowserRouter>
            <Context.Provider value={ { games: games, handleClick: () => { someFunc() }, calendar: React.createRef(), paintUrlDesktop: () => { someFunc() }, setGame: () => { someFunc() }, setLoading: () => { someFunc() }, setError: () => { someFunc() }, setOpen: () => { someFunc() } } }>
                <GameRouteForDesktop match={match} />
            </Context.Provider>
        </BrowserRouter>

    );
    expect(EnzymeToJson(subject)).toMatchSnapshot();
});
