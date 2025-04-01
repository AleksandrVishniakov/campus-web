import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AuthAPI from './api/auth/AuthAPI';
import ProfileAPI from './api/profile/ProfileAPI';
import IssuesAPI from './api/issues/IssuesAPI';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


const authAPI = new AuthAPI(
  `http://${document.location.hostname}:8000/api/v1`
)
const profileAPI = new ProfileAPI(
  `http://${document.location.hostname}:8001/api/v1`
)
const issuesAPI = new IssuesAPI(
  `http://${document.location.hostname}:8001/api/v1`
)

root.render(
  <React.StrictMode>
    <App 
      authAPI={authAPI}
      profileAPI={profileAPI}
      issuesAPI={issuesAPI}
    />
  </React.StrictMode>
);
