import type { Preview } from "@storybook/react";
import "../app/app.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "20px", fontFamily: "Roboto Mono, monospace" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
