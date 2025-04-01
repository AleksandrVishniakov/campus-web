import React from 'react'
import AuthForm from '../common/AuthForm/AuthForm'
import './RegisterPage.css'
import AuthAPI from '../../api/auth/AuthAPI'

interface Props {
    authAPI: AuthAPI
    onNavigateToLogin?: ()=>void
    onError:(error: string)=>void
    onRegister:()=>void
}

const RegisterPage: React.FC<Props> = (props) => {
    const handleNavigateToLogin = () => {
        if (props.onNavigateToLogin) {
            props.onNavigateToLogin()
        }
    }

    const handleSubmit = async (login: string, password: string) => {
        try {
            await props.authAPI.register(login, password)
        } catch(e: any) {
            props.onError(e.toString())
            return
        }

        props.onRegister()
    }

    return (
        <main className="RegisterPage">
            <h1 className='RegisterPage_title'>Регистрация</h1>
            <AuthForm onSubmit={handleSubmit}/>
            <button 
                className="RegisterPage_login-button"
                onClick={handleNavigateToLogin}
            >Уже есть аккаунт? Войти</button>
        </main>
    )
}

export default RegisterPage