import { ChangeEvent, useEffect, useState } from "react";
import AuthAPI from "../../api/auth/AuthAPI";
import "./ProfilePage.css"
import { Box, Button, Fab, Tab, Tabs, TextField } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileAPI from "../../api/profile/ProfileAPI";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import IssuesAPI from "../../api/issues/IssuesAPI";
import IssueBlock from "../common/IssueBlock/IssueBlock";
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';



function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


interface Props {
    authAPI: AuthAPI
    profileAPI: ProfileAPI
    issuesAPI: IssuesAPI

    onOpenIssue: (
        id: number,
        name?: string,
        surname?: string,
        room?: string,
        classN?: string
    ) => void
    onError: (e: string) => void
    onNewIssue: () => void
    onAdminPanel: ()=>void
    onExit: () => void
}

interface User {
    id: number
    login: string
    role: string
}

interface Metadata {
    userID: number
    name: string
    surname: string
    class: string
    room: string
    updatedAt: Date
}

interface IssueWithMetadata {
    id: number,
    authorID: number,
    title: string,
    description: string,
    isClosed: boolean,
    createdAt: Date,
    closedAt: Date,
    name: string,
    surname: string,
    class: string,
    room: string,
}

const ProfilePage: React.FC<Props> = (props) => {
    const [user, setUser] = useState<User | null>(null)
    const [metadata, setMetadata] = useState<Metadata | null | undefined>(null)

    const [nameInput, setNameInput] = useState(metadata ? metadata.name : "")
    const [surnameInput, setSurnameInput] = useState(metadata ? metadata.surname : "")
    const [classInput, setClassInput] = useState(metadata ? metadata.class : "")
    const [roomInput, setRoomInput] = useState(metadata ? metadata.room : "")

    const [issuesList, setIssuesList] = useState<IssueWithMetadata[] | null>(null)

    const [isFormEditable, setFormEditable] = useState(false)

    const [tabIndex, setTabIndex] = useState(0)

    const handleInputChange = (f: React.Dispatch<React.SetStateAction<string>>) => {
        return (evt: ChangeEvent<HTMLInputElement>) => {
            f(evt.target.value)
        }
    }

    const handleTabsChange = async (_: React.SyntheticEvent | null, newValue: number) => {
        if (window.localStorage.getItem("id") === null) return
        const userID = Number(window.localStorage.getItem("id"))
        let isClosed: boolean | null = newValue === 0 ? false : newValue === 1 ? true : null

        try {
            const issues = await props.issuesAPI.filterIssues(
                userID, isClosed, null, null, null, null, null
            )

            setIssuesList(issues)
        } catch (e: any) {
            props.onError(e)
            return
        }

        setTabIndex(newValue)
    }

    const updateMetadata = () => {
        if (window.localStorage.getItem("id") === null) return

        props.profileAPI.getProfile(Number(window.localStorage.getItem("id"))).then((meta) => {
            setMetadata(meta)
        }).catch((e) => {
            if (e.toString().split(" ")[1] === "404") {
                setMetadata(undefined)
                return
            }

            props.onError(e)
        })
    }

    useEffect(() => {
        if (window.localStorage.getItem("id") === null) return

        props.authAPI.getUser(Number(window.localStorage.getItem("id"))).then((user) => {
            setUser(user)
        }).catch((e) => {
            props.onError(e)
        })
    }, [])

    useEffect(() => {
        if (metadata === null) return

        if (metadata === undefined) {
            setNameInput("")
            setSurnameInput("")
            setClassInput("")
            setRoomInput("")
            return
        }

        setNameInput(metadata.name)
        setSurnameInput(metadata.surname)
        setClassInput(metadata.class)
        setRoomInput(metadata.room)
    }, [metadata])

    useEffect(() => {
        updateMetadata()
        handleTabsChange(null, 0)
    }, [])

    const handleEditData = async () => {
        try {
            await props.profileAPI.updateProfile(nameInput, surnameInput, classInput, roomInput)
        } catch (e: any) {
            props.onError(e)
        } finally {
            updateMetadata()
        }

        setFormEditable(false)
    }

    return (
        <main className="ProfilePage">
            {user && user.role === "student" ?
                <Fab variant="extended" className="fab"
                    onClick={props.onNewIssue}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    новая заявка
                </Fab> :
                <Fab variant="extended" className="fab"
                    onClick={props.onAdminPanel}
                >
                    <SettingsIcon sx={{ mr: 1 }} />
                    панель управления
                </Fab>
            }

            <h1>Профиль</h1>

            <div className="information">
                <div className="user_meta">
                    <h3>Персональная информация</h3>

                    <div className="meta_form">
                        <TextField
                            disabled={!isFormEditable}
                            required
                            type='text'
                            placeholder='Имя'
                            label='Имя'
                            id='name-input'
                            value={nameInput}
                            onChange={handleInputChange(setNameInput)}
                            variant="standard"
                            style={{ width: "100%" }}
                            fullWidth
                        />

                        <TextField
                            disabled={!isFormEditable}
                            required
                            type='text'
                            placeholder='Фамилия'
                            label='Фамилия'
                            id='surname-input'
                            value={surnameInput}
                            onChange={handleInputChange(setSurnameInput)}
                            variant="standard"
                            style={{ width: "100%" }}
                            fullWidth
                        />

                        <div>
                            <TextField
                                disabled={!isFormEditable}
                                required
                                type='text'
                                placeholder='Класс'
                                label='Класс'
                                id='class-input'
                                value={classInput}
                                onChange={handleInputChange(setClassInput)}
                                variant="standard"
                                style={{ width: "100%" }}
                                fullWidth
                            />

                            <TextField
                                disabled={!isFormEditable}
                                required
                                type='text'
                                placeholder='Комната'
                                label='Комната'
                                id='room-input'
                                value={roomInput}
                                onChange={handleInputChange(setRoomInput)}
                                variant="standard"
                                style={{ width: "100%" }}
                                fullWidth
                            />
                        </div>

                        <div>

                            {
                                !isFormEditable ?
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={() => { setFormEditable(true) }}
                                    >
                                        Изменить
                                    </Button> : <div></div>
                            }


                            {
                                isFormEditable ?
                                    <Button
                                        onClick={handleEditData}
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                    >
                                        Сохранить
                                    </Button> : <div></div>
                            }

                        </div>
                    </div>
                </div>


                <div className="user-info">
                    {user !== null ? <>
                        <div><p className="user-info_id">#{user.id}</p>
                            <p className="user-info_role">{user.role}</p></div>
                        <p className="user-info_login">{user.login}</p>
                    </> : <p>Ошибка загрузки данных</p>}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={props.onExit}
                    >
                        Выйти
                    </Button>
                </div>
            </div>


            <div className="issues_block">
                <h3>Отправленные заявки</h3>

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: "100%" }}>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabsChange}
                            aria-label="basic tabs"
                        >
                            <Tab label="в работе" {...a11yProps(0)} />
                            <Tab label="выполненные" {...a11yProps(1)} />
                            <Tab label="все" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <div className="issues_list">
                        {
                            issuesList && issuesList.length > 0 ?
                                issuesList.map((issue) => {
                                    return (
                                        <IssueBlock
                                            onClick={() => {
                                                props.onOpenIssue(
                                                    issue.id, issue.name, issue.surname, issue.room, issue.class
                                                )
                                            }}
                                            key={issue.id}
                                            id={issue.id}
                                            authorID={issue.authorID}
                                            title={issue.title}
                                            description={issue.description}
                                            isClosed={issue.isClosed}
                                            createdAt={issue.createdAt}
                                        />
                                    )
                                }) : <p>Пока ничего нет</p>
                        }
                    </div>
                </Box>
            </div>

        </main>
    )
}

export default ProfilePage