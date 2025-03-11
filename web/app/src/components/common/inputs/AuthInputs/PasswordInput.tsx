import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

interface Props {
    error?: boolean
    onChange?: (password: string) => void
}

const PasswordInput: React.FC<Props> = (props) => {
    const [value, setValue] = useState("")

    const handleInputValueChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.value)

        if (props.onChange) {
            props.onChange(evt.target.value)
        }
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-end', width:"fit-content"}}>
            <VpnKeyIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
                error={props.error}
                required
                type='password'
                placeholder='Пароль'
                label='Пароль'
                id='password-input'
                value={value}
                onChange={handleInputValueChange}
                variant="standard"
            />
        </Box>
    )
}

export default PasswordInput;