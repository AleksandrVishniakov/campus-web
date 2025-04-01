import { dividerClasses } from '@mui/material'
import './IssueBlock.css'

interface Props {
    id: number,
    authorID: number,
    title: string,
    description: string,
    isClosed: boolean,
    createdAt: Date,
    closedAt?: Date,
    name?: string,
    surname?: string,
    class?: string,
    room?: string,

    onClick: ()=>void
}

const IssueBlock: React.FC<Props> = (props) => {
    const formatDate = (d: Date): string => {
        const date = new Date(d)
        return date.toLocaleTimeString() + " " + date.toLocaleDateString()
    }

    return (
        <div className="IssueBlock" key={props.id}
            onClick={props.onClick}
        >
            <h5 className="IssueBlock_title">{props.title}</h5>
            <p className="IssueBlock_description">{props.description}</p>
            {props.class && props.room ?
                    <div style={{display:"flex", flexDirection:"row", gap: "30px", width:"100%", fontSize:"12px"}}>
                        <p>{props.class}</p>
                        <p>{props.room}</p>
                    </div> : null}
            <div className="inf">
                <p className="inf_time">{formatDate(props.createdAt)}</p>
                
                <div className="inf_status" style={{backgroundColor: props.isClosed ? "green" : "blue"}}>
                    {props.isClosed ? "готово" : "в работе"}
                </div>
            </div>
        </div>
    )
}

export default IssueBlock