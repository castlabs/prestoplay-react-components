import { PrestoContextDecorator } from "../story/stories/prep";
import "./style.css"

import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      method: 'alphabetical',
      order: ['Intro'],
    },
  },
  decorators: [PrestoContextDecorator],
};

export default preview;
