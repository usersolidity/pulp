import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { SplashPage } from '../SplashPage';

const shallowRenderer = createRenderer();

describe('<HomePage />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<SplashPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
