import React from 'react'
import TitleInput from '../common/inputs/IssueInputs/TitleInput';
import './CreateIssuePage.css'
import DescriptionInput from '../common/inputs/IssueInputs/DescriptionInput';
import ImageUploadInput from '../common/inputs/IssueInputs/ImageUploadInput';
import { Button } from '@mui/material';

interface Props {

}

const CreateIssuePage: React.FC<Props> = (props) => {
    return (
        <main className="CreateIssuePage">
            <h1 className="CreateIssuePage_title">
                Новая заявка
            </h1>

            <TitleInput/>
            <DescriptionInput/>
            <ImageUploadInput/>

            <Button
                variant='contained'
                fullWidth
            >Отправить</Button>
        </main>
    )
}

export default CreateIssuePage;