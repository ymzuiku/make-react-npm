import 'jest-styled-components';
import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import { toSnapshot } from 'react-test-renderer-helper';
import Adapter from 'enzyme-adapter-react-16';
import App from '../src/App';

Enzyme.configure({ adapter: new Adapter() });

it('App styled-compoments', () => {
  const comp = renderer.create(<App />);
  expect(toSnapshot(comp)).toMatchSnapshot();
});

it('App initAndUnmount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('App updateNoChange', () => {
  const wrapper = shallow(<App />);
  const firstDebug = wrapper.debug();
  expect(firstDebug).toMatchSnapshot('firstDebug');
  wrapper.update();
  expect(wrapper.debug()).toEqual(firstDebug);
});
