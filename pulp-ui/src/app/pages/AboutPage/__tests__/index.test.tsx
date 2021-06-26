import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';

import { AboutPage } from '..';

const shallowRenderer = createRenderer();

describe('<AboutPage />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(<AboutPage />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
