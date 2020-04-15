import React from 'react';
import ReactDOM from 'react-dom';
import ErrorModal from './ErrorModal';
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

it('Renders the error modal without crashing', () => {
    const div = document.createElement('div');
    const someFunc = () => { console.log('Do stuff') };

    ReactDOM.render(<Context.Provider value={ 
        { 
            error: true, 
            onClose: () => someFunc()
        }
    }><ErrorModal /></Context.Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("renders the error modal correctly", () => {

    const subject = mount(
        <BrowserRouter>
            <Context.Provider value={ 
                { 
                    error: true, 
                    onClose: () => someFunc()
                }
            }>
                <ErrorModal />
            </Context.Provider>
        </BrowserRouter>

    );
    expect(EnzymeToJson(subject)).toMatchSnapshot();
});