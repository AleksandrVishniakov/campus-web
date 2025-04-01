import React, { useState } from 'react'
import TitleInput from '../common/inputs/IssueInputs/TitleInput';
import './CreateIssuePage.css'
import DescriptionInput from '../common/inputs/IssueInputs/DescriptionInput';
import ImageUploadInput from '../common/inputs/IssueInputs/ImageUploadInput';
import { Button, IconButton } from '@mui/material';
import IssuesAPI from '../../api/issues/IssuesAPI';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    issueAPI: IssuesAPI
    onError: (e: string) => void
    onClose: () => void
}

const CreateIssuePage: React.FC<Props> = (props) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState<File[]>(new Array<File>())

    const handleSubmit = async () => {
        if (!window.localStorage.getItem("id")) return

        try {
            await props.issueAPI.createIssue(title, description, files)
        } catch (e: any) {
            props.onError(e)
            return
        }

        props.onClose()
    }

    return (
        <main className="CreateIssuePage">
            <div className="CreateIssuePage_container">
                <h1 className="CreateIssuePage_title">
                    Новая заявка
                </h1>
                <IconButton aria-label="delete" onClick={props.onClose}>
                    <CloseIcon />
                </IconButton>
            </div>

            <TitleInput
                value={title}
                onChange={(s) => { setTitle(s) }}
            />
            <DescriptionInput
                value={title}
                onChange={(s) => { setDescription(s) }}
            />
            <ImageUploadInput
                onChange={(f) => { setFiles(f) }}
            />

            <Button
                variant='contained'
                fullWidth
                onClick={handleSubmit}
            >Отправить</Button>
        </main>
    )
}

export default CreateIssuePage;