import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';

class BasicDashboardElement extends HTMLElement {
  connectedCallback() {
    ReactDOM.render(<App name={"Basic dashboard with web-components"} />, this);
  }
}

customElements.define('basic-dashboard', BasicDashboardElement);
