import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AccountCircle } from '@mui/icons-material';

interface Props {
    error?: boolean
    onChange?: (login: string) => void
}

const LoginInput: React.FC<Props> = (props) => {
    const [value, setValue] = useState("")

    const handleInputValueChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.value)

        if (props.onChange) {
            props.onChange(evt.target.value)
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', width:"fit-content"}}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
                error={props.error}
                required
                type='text'
                placeholder='Логин'
                label='Логин'
                id='login-input'
                value={value}
                onChange={handleInputValueChange}
                variant="standard"
                style={{width:"100%"}}
            />
        </Box>
    )
}

export default LoginInput;