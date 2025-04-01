import React, { forwardRef, useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import CreateIssuePage from './components/CreateIssuePage/CreateIssuePage';
import AuthAPI from './api/auth/AuthAPI';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileAPI from './api/profile/ProfileAPI';
import IssuesAPI from './api/issues/IssuesAPI';
import IssueWindow from './components/IssueWindow/IssueWindow';
import AdminPanelPage from './components/AdminPanelPage/AdminPanelPage';

enum Screens {
  Login = 1,
  Register = 2,
  CreateIssue = 3,
  Profile = 4,
  Admin = 5,
}

interface IssueData {
  id: number
  name?: string
  surname?: string
  room?: string
  class?: string
}

const App: React.FC<{
  authAPI: AuthAPI
  profileAPI: ProfileAPI
  issuesAPI: IssuesAPI
}> = (
  { authAPI, profileAPI, issuesAPI }
) => {
    const [errorOpen, setErrorOpen] = useState(false)
    const [errorText, setErrorText] = useState("")
    const [screen, setScreen] = useState(Screens.Login)
    const [issueOpen, setIssueOpen] = useState(false)
    const [issueData, setIssueData] = useState<IssueData | null>(null)

    const handleOpenIssue = (
      id: number,
      name?: string,
      surname?: string,
      room?: string,
      classN?: string
    ) => {
      setIssueData({
        id: id,
        name: name,
        surname: surname,
        room: room,
        class: classN,
      })

      setIssueOpen(true)
    }


    useEffect(() => {
      if (window.localStorage.getItem("token") !== null) {
        setScreen(Screens.Profile)
      }
    }, [])


    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }

      setErrorOpen(false);
    };

    const handleError = (e: any) => {
      switch (e.toString().split(" ")[1]) {
        case "400":
          setErrorText("Неверные данные")
          break
        case "401":
          setScreen(Screens.Login)
          setErrorText("Ошибка авторизации. Попробуйте войти ещё раз")
          break
        case "403":
          setErrorText("Ошибка доступа. У вас недостаточно прав")
          break
        case "404":
          setErrorText("Ничего не найдено")
          break
        case "500":
          setErrorText("Ошибка сервера")
          break
        default:
          setErrorText(e.toString())
      }

      setErrorOpen(true)
    }

    const handleExit = () => {
      window.localStorage.removeItem("token")
      window.localStorage.removeItem("id")
      setScreen(Screens.Login)
    }

    const navigation = () => {
      switch (screen) {
        case Screens.Login:
          return (
            <LoginPage
              authAPI={authAPI}
              onError={handleError}
              onLogin={() => { setScreen(Screens.Profile) }}
              onNavigateToRegister={() => { setScreen(Screens.Register) }}
            />
          )
        case Screens.Register:
          return (
            <RegisterPage
              authAPI={authAPI}
              onError={handleError}
              onRegister={() => { setScreen(Screens.Profile) }}
              onNavigateToLogin={() => { setScreen(Screens.Login) }}
            />
          )
        case Screens.CreateIssue:
          return (
            <CreateIssuePage
              issueAPI={issuesAPI}
              onError={handleError}
              onClose={() => { setScreen(Screens.Profile) }}
            />
          )
        case Screens.Profile:
          return (
            <ProfilePage
              authAPI={authAPI}
              profileAPI={profileAPI}
              issuesAPI={issuesAPI}
              onError={handleError}
              onExit={handleExit}
              onOpenIssue={handleOpenIssue}
              onNewIssue={() => { setScreen(Screens.CreateIssue) }}
              onAdminPanel={() => { setScreen(Screens.Admin) }}
            />
          )
        case Screens.Admin:
          return <AdminPanelPage
            issuesAPI={issuesAPI}
            onError={handleError}
            onClose={() => { setScreen(Screens.Profile) }}
            onOpenIssue={handleOpenIssue}
          />
      }
    }

    return (
      <div className="App">
        {navigation()}
        <IssueWindow
          issuesAPI={issuesAPI}
          onError={handleError}
          open={issueOpen}
          data={issueData}
          onClose={() => { setIssueOpen(false) }}
        />

        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {errorText}
          </Alert>
        </Snackbar>
      </div>
    );
  }

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default App;
