import React from 'react';
import ReactDOM from 'react-dom';
import FiltersList from './filtersList';
import FavoritesList from './favoritesList';
import Context from '../../Context';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Context.Provider value={ { favorites: [], checkboxes: [] }}><FiltersList /><FavoritesList/></Context.Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders the filtering sidebar list as expected when there are no favorites', () => {
    
    const tree = renderer
        .create(
            
            <BrowserRouter>
                <Context.Provider value={ { favorites: [], checkboxes: [] }}>
                    <FiltersList />
                    <FavoritesList/>
                </Context.Provider>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})

it('Renders the filtering sidebar list as expected when there are favorites', () => {

    const favorites = [{"platforms":"Nintendo Switch","image":"https://giantbomb1.cbsistatic.com/uploads/original/0/30/3177321-job.png","gameUrl":"/game/Good-Job!","gameTitle":"Good Job!","releaseDate":"March 26, 2020","description":"Solve workplace problems with the power of physics in this action puzzle game for the Nintendo Switch."}]
    
    const tree = renderer
        .create(
            
            <BrowserRouter>
                <Context.Provider value={ { favorites: favorites, checkboxes: [] }}>
                    <FiltersList />
                    <FavoritesList/>
                </Context.Provider>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})