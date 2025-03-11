import React, { useState } from 'react'
import "./AuthForm.css"
import Button from '@mui/material/Button';
import LoginInput from '../inputs/AuthInputs/LoginInput';
import PasswordInput from '../inputs/AuthInputs/PasswordInput';

interface Props {
    onSubmit?: (login: string, password: string) => void
}

const AuthForm: React.FC<Props> = (props) => {
    const [loginInput, setLoginInput] = useState("")
    const [loginError, setLoginError] = useState(false)

    const [passwordInput, setPasswordInput] = useState("")
    const [passwordError, setPasswordError] = useState(false)

    const [isDataSubmitting, setDataSubmitting] = useState(false)

    const [errorText, setErrorText] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isDataSubmitting) return
        setDataSubmitting(true)
        let valid = true

        if (loginInput.length < 3) {
            setErrorText("Слишком короткий логин")
            setLoginError(true)
            valid = false
        }

        if (loginInput.length > 128) {
            setErrorText("Слишком длинный логин")
            setLoginError(true)
            valid = false
        }

        if (passwordInput.length < 5) {
            setErrorText("Слишком короткий пароль")
            setPasswordError(true)
            valid = false
        }

        if (passwordInput.length > 256) {
            setErrorText("Слишком длинный пароль")
            setPasswordError(true)
            valid = false
        }

        if (valid) {
            setErrorText("")
            setLoginError(false)
            setPasswordError(false)
            if (props.onSubmit) {
                props.onSubmit(loginInput, passwordInput)
            }
        }

        setDataSubmitting(false)
    }

    return (
        <form 
            className="AuthForm"
            onSubmit={handleSubmit}
        >
            <LoginInput
                error={loginError}
                onChange={(v)=>{setLoginInput(v)}}
            />

            <PasswordInput
                error={passwordError}
                onChange={(v)=>{setPasswordInput(v)}}
            />

            <Button
                className="AuthFrom_submit-button"
                type="submit"
                variant='contained'
            >Отправить</Button>

            <p 
                className={errorText === "" ? "AuthForm_error" : "AuthForm_error visible"}
            >{errorText}</p>
        </form>
    )
}

export default AuthForm;