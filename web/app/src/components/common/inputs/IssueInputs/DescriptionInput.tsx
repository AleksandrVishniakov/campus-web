import { TextField } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'

interface Props {
    value?: string
    disabled?: boolean
    error?: boolean
    onChange?: (s: string) => void
}

const DescriptionInput: React.FC<Props> = (props) => {
    const [value, setValue] = useState(props.value)

    const handleInputValueChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.value)

        if (props.onChange) {
            props.onChange(evt.target.value)
        }
    }

    return (
        <div>
            <TextField
                className={props.disabled ? "DescriptionInput disabled" : "DescriptionInput"}
                error={props.error}
                type='text'
                placeholder='Описание'
                label='Описание'
                id='description-input'
                value={value}
                onChange={handleInputValueChange}
                variant="standard"
                disabled={props.disabled}
                fullWidth
                multiline
            />
        </div>
    )
}

export default DescriptionInput;