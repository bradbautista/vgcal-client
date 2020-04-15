import React from 'react';
import ReactDOM from 'react-dom';
import FiltersList from './filtersList';
import Context from '../../Context';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Context.Provider value={ { checkboxes: [] }}><FiltersList /></Context.Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders the filters list as expected', () => {
    
    const tree = renderer
        .create(
            
            <BrowserRouter>
                <Context.Provider value={ { checkboxes: [] }}>
                    <FiltersList />
                </Context.Provider>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})