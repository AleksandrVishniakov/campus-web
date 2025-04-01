import { Button, CircularProgress, Dialog, DialogContent, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import "./IssueWindow.css"
import IssuesAPI from "../../api/issues/IssuesAPI";
import Comment from "../common/Comment/Comment";
import React, { useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import CommentInput from "../common/Comment/CommentInput";

interface Props {
    issuesAPI: IssuesAPI

    open: boolean
    data: IssueData | null

    onClose: () => void
    onError: (e: string) => void
}

interface IssueData {
    id: number
    name?: string
    surname?: string
    room?: string
    class?: string
}

interface IssueMetadata {
    id: number
    authorID: number
    title: string
    description: string
    imagesLinks: Array<string>
    isClosed: boolean
    createdAt: Date
    closedAt: Date | null
}


interface Comment {
    id: number
    authorID: number
    issueID: number
    content: string
    createdAt: Date
}

const IssueWindow: React.FC<Props> = (props) => {
    const [isDataSubmitting, setDataSubmitting] = useState(false)
    const [metadata, setMetadata] = useState<IssueMetadata | null>(null)
    const [comments, setComments] = useState<Comment[]|null>(null)

    const formatDate = (d: Date): string => {
        const date = new Date(d)
        return date.toLocaleTimeString() + " " + date.toLocaleDateString()
    }

    const getData = async (id: number) => {
        try {
            const data = await props.issuesAPI.getIssue(id)
            setMetadata(data)
        } catch (e: any) {
            props.onError(e)
            setMetadata(null)
            return
        }
    }

    const getComments = async () => {
        if (!props.data) return
        try {
            const comments = await props.issuesAPI.getComments(props.data.id)
            setComments(comments)
        } catch (e: any) {
            props.onError(e)
            setComments(null)
            return
        }
    }

    const markAsClosed = async () => {
        if (!metadata) return

        try {
            await props.issuesAPI.markAsClosed(metadata.id)
        } catch (e: any) {
            props.onError(e)
            return
        } finally {
            await getData(metadata.id)
        }
    }

    const updateComment = async (commentID: number, content: string) => {
        if (!props.data) return

        try {
            await props.issuesAPI.updateComment(props.data.id, commentID, content)
        } catch (e: any) {
            props.onError(e)
            return
        } finally {
            await getComments()
        }
    }

    const deleteComment = async (commentID: number) => {
        if (!props.data) return

        try {
            await props.issuesAPI.deleteComment(props.data.id, commentID)
        } catch (e: any) {
            props.onError(e)
            return
        } finally {
            await getComments()
        }
    }

    const newComment = async (content: string) => {
        if (!props.data) return

        try {
            await props.issuesAPI.newComment(props.data.id, content)
        } catch (e: any) {
            props.onError(e)
            return
        } finally {
            await getComments()
        }
    }

    useEffect(() => {
        if (!props.data?.id) return

        setDataSubmitting(true)

        getData(props.data?.id).finally(()=>{
            getComments().finally(()=>{
                setDataSubmitting(false)
            })
        })
    }, [props.data])

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.onClose}
            >
                <DialogContent>
                    <div className="IssueWindow_header">
                        <h3>заявка #{props.data?.id}</h3>
                        <IconButton onClick={props.onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>


                    {
                        !isDataSubmitting ?
                            metadata ?
                                <div className="issue-body">
                                    <div className="issue-info">
                                        <div className="issue-body_meta">
                                            <p className="issuer_name">{props.data?.name} {props.data?.surname}</p>
                                            <div className="issuer_info">
                                                <p>класс {props.data?.class}</p>
                                                <p>комната {props.data?.room}</p>
                                            </div>
                                        </div>

                                        <div className="issue-creation">
                                            <p>создано</p>
                                            <p>{formatDate(metadata.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="issue-status">
                                        <div className="inf_status" style={{ backgroundColor: metadata.isClosed ? "green" : "blue" }}>
                                            {metadata.isClosed ? "готово" : "в работе"}
                                        </div>

                                        {
                                            metadata.isClosed && metadata.closedAt ?
                                                <p>в {formatDate(metadata.closedAt)}</p>
                                                :
                                                <Button variant="contained" size="small" onClick={markAsClosed}>
                                                    Отметить выполненной
                                                </Button>
                                        }
                                    </div>

                                    <h1 className="issue-body_title">
                                        {metadata.title}
                                    </h1>
                                    <p className="issue-body_description">{metadata.description}</p>

                                    {metadata.imagesLinks && metadata.imagesLinks.length > 0 ? <h3>Прикреплённые изображения:</h3> : null}
                                    <ImageViewer imageUrls={metadata.imagesLinks}/>

                                    <h3 style={{marginBottom:"10px"}}>Комментарии</h3>
                                    {
                                        comments && comments.length > 0?
                                            comments.map((c) => {
                                                return <Comment
                                                    canEdit={window.localStorage.getItem("id") === ""+c.authorID}
                                                    key={c.id}
                                                    id={c.id}
                                                    byAuthor={c.authorID===metadata.authorID}
                                                    content={c.content}
                                                    createdAt={c.createdAt}
                                                    onEdit={updateComment}
                                                    onDelete={deleteComment}
                                                />
                                            })
                                        : <p style={{marginBottom:"10px"}}>Пока ничего нет</p>
                                    }

                                    <CommentInput onSubmit={newComment}/>
                                </div>
                                : <p>нет данных</p>

                            : <CircularProgress className="loadbar" />
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default IssueWindow;