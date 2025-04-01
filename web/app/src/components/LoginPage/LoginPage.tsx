import React from 'react'
import AuthForm from '../common/AuthForm/AuthForm'
import './LoginPage.css'
import AuthAPI from '../../api/auth/AuthAPI'

interface Props {
    authAPI: AuthAPI

    onNavigateToRegister?: ()=>void

    onError:(error: string)=>void
    onLogin:()=>void
}

const LoginPage: React.FC<Props> = (props) => {
    const handleNavigateToRegister = () => {
        if (props.onNavigateToRegister) {
            props.onNavigateToRegister()
        }
    }

    const handleSubmit = async (login: string, password: string) => {
        try {
            await props.authAPI.login(login, password)
        } catch(e: any) {
            props.onError(e.toString())
            return
        }

        props.onLogin()
    }

    return (
        <main className="LoginPage">
            <h1 className='LoginPage_title'>Вход</h1>
            <AuthForm onSubmit={handleSubmit}/>
            <button 
                className="LoginPage_registration-button"
                onClick={handleNavigateToRegister}
            >Нет аккаунта? Зарегистрироваться</button>
        </main>
    )
}

export default LoginPage