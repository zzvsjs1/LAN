import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { CurrentUserProvider } from "./common/CurUserContext";
import { USER_KEY } from "./backend/userUtils";
import { getFromLocalStorage, removeFromLocalStorage } from "./local-storage/localStorageUtils";
import { addUserLoginCount } from "./backend/loginRecordUtils";

import './scss/lan-custom-bootstrap.scss';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Check if we need to add user login count.
function addUserLoginCountAtStart() {
  const user = getFromLocalStorage(USER_KEY);

  // If we are login.
  if (user !== null) {
    // Just log.
    addUserLoginCount(user)
      .catch(reason => {
        console.log(reason);

        // If failed, logout.
        removeFromLocalStorage(USER_KEY);
      });
  }
}

// Call this function.
addUserLoginCountAtStart();

// Import BrowserRouter and render it around out whole app.
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
