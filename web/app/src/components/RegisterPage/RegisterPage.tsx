import React from 'react'
import AuthForm from '../common/AuthForm/AuthForm'
import './RegisterPage.css'

interface Props {
    onNavigateToLogin?: ()=>void
}

const RegisterPage: React.FC<Props> = (props) => {
    const handleNavigateToLogin = () => {
        if (props.onNavigateToLogin) {
            props.onNavigateToLogin()
        }
    }

    return (
        <main className="RegisterPage">
            <h1 className='RegisterPage_title'>Регистрация</h1>
            <AuthForm/>
            <button 
                className="RegisterPage_login-button"
                onClick={handleNavigateToLogin}
            >Уже есть аккаунт? Войти</button>
        </main>
    )
}

export default RegisterPage