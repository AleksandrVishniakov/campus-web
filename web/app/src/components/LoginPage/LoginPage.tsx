import React from 'react'
import AuthForm from '../common/AuthForm/AuthForm'
import './LoginPage.css'

interface Props {
    onNavigateToRegister?: ()=>void
}

const LoginPage: React.FC<Props> = (props) => {
    const handleNavigateToRegister = () => {
        if (props.onNavigateToRegister) {
            props.onNavigateToRegister()
        }
    }

    return (
        <main className="LoginPage">
            <h1 className='LoginPage_title'>Вход</h1>
            <AuthForm/>
            <button 
                className="LoginPage_registration-button"
                onClick={handleNavigateToRegister}
            >Нет аккаунта? Зарегистрироваться</button>
        </main>
    )
}

export default LoginPage