import React, { useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import CreateIssuePage from './components/CreateIssuePage/CreateIssuePage';

enum Screens {
  Login = 1,
  Register = 2,
  CreateIssue = 3,
  Profile = 4,
}

const App = () => {
  const [screen, setScreen] = useState(Screens.CreateIssue)

  const navigation = () => {
    switch (screen) {
      case Screens.Login:
        return (
          <LoginPage onNavigateToRegister={()=>{setScreen(Screens.Register)}}/>
        )
      case Screens.Register:
        return (
          <RegisterPage onNavigateToLogin={()=>{setScreen(Screens.Login)}}/>
        )
      case Screens.CreateIssue:
        return (
          <CreateIssuePage/>
        )
    }
  }

  return (
    <div className="App">
      {navigation()}
    </div>
  );
}

export default App;
