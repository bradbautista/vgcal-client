import React from 'react';
import ReactDOM from 'react-dom';
import Checkbox from './checkbox';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  const platform = 'PlayStation'
  ReactDOM.render(<Checkbox key={platform} platform={platform}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Renders the checkbox as expected', () => {
    const platform = 'PlayStation'
    const tree = renderer
        .create(
            <BrowserRouter>
            <Checkbox key={platform} platform={platform}/>
            </BrowserRouter>
            )
        .toJSON();
    expect(tree).toMatchSnapshot();
        
})