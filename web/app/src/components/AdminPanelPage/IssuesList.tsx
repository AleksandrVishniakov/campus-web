import { useEffect, useState } from "react";
import IssueBlock from "../common/IssueBlock/IssueBlock";
import { Pagination } from "@mui/material";

interface Props {
    issues: IssueWithMetadata[] | null;
    onOpenIssue: (
        id: number,
        name?: string,
        surname?: string,
        room?: string,
        classN?: string
    ) => void;
}

interface IssueWithMetadata {
    id: number;
    authorID: number;
    title: string;
    description: string;
    isClosed: boolean;
    createdAt: Date;
    closedAt: Date;
    name: string;
    surname: string;
    class: string;
    room: string;
}

const ITEMS_PER_PAGE = 10;

const IssuesList: React.FC<Props> = (props) => {
    const [page, setPage] = useState(1);

    useEffect(()=>{
        setPage(1)
    },[props.issues])
    
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const paginatedIssues = props.issues?.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    ) || [];

    const pageCount = Math.ceil((props.issues?.length || 0) / ITEMS_PER_PAGE);

    return (
        <div className="issuesList">
            {props.issues && props.issues.length > 0 ? (
                <>
                    <div className="issuesList">
                        {paginatedIssues.map((issue) => (
                            <IssueBlock
                                onClick={() => {
                                    props.onOpenIssue(
                                        issue.id,
                                        issue.name,
                                        issue.surname,
                                        issue.room,
                                        issue.class
                                    );
                                }}
                                key={issue.id}
                                id={issue.id}
                                authorID={issue.authorID}
                                title={issue.title}
                                description={issue.description}
                                isClosed={issue.isClosed}
                                createdAt={issue.createdAt}
                            />
                        ))}
                    </div>
                    
                    {pageCount > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <Pagination
                                count={pageCount}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                sx={{ 
                                    '& .MuiPaginationItem-root': {
                                        color: 'text.primary'
                                    }
                                }}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p style={{ marginTop: "50px" }}>ничего не найдено</p>
            )}
        </div>
    );
};

export default IssuesList;