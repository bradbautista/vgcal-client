import React from 'react';
import ReactDOM from 'react-dom';
import InfoModal from './InfoModal';
import Context from '../Context';
import renderer from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import EnzymeToJson from 'enzyme-to-json';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Need to use Enzyme for modal snapshot tests b/c of
// react-test-renderer / js-dom issues

const someFunc = () => { console.log('Do stuff') };

it('Renders the info modal without crashing', () => {
    const div = document.createElement('div');
    
    ReactDOM.render(<Context.Provider value={ 
        { 
            hasVisited: false, 
            onClose: () => someFunc(),
        }
    }><InfoModal /></Context.Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("renders the info modal correctly", () => {

    const subject = mount(
        <BrowserRouter>
            <Context.Provider value={ 
                { 
                    hasVisited: false, 
                    onClose: () => someFunc(),
                }
            }>
                <InfoModal />
            </Context.Provider>
        </BrowserRouter>

    );
    expect(EnzymeToJson(subject)).toMatchSnapshot();
});