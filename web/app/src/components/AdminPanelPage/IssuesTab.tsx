import React, { useEffect, useState } from 'react';
import { Button, TextField, Grid, Box, Tooltip, IconButton, useTheme, useMediaQuery } from '@mui/material';
import DateRangePicker from './DateRangePicker';
import FilterChipsInput from './FilterChipsInput';
import './AdminPanel.css';
import IssuesAPI from '../../api/issues/IssuesAPI';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import IssuesList from './IssuesList';

interface Props {
    issuesAPI: IssuesAPI

    onError: (e: string) => void
    onClose: () => void
    onOpenIssue: (
        id: number,
        name?: string,
        surname?: string,
        room?: string,
        classN?: string
    ) => void
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

const IssuesTab: React.FC<Props> = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [query, setQuery] = useState('');
    const [classes, setClasses] = useState<string[]>([]);
    const [rooms, setRooms] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'closed' | 'open'>('all');

    const [issues, setIssues] = useState<IssueWithMetadata[] | null>(null)

    const [isDataSubmitting, setDataSubmitting] = useState(false)

    const getIssues = async () => {
        try {
            const issues = await props.issuesAPI.filterIssues(
                null,
                statusFilter === "all" ? null : statusFilter === "closed",
                query === "" ? null : query,
                rooms && rooms.length > 0 ? rooms : null,
                classes && classes.length > 0 ? classes : null,
                dateRange[0] && dateRange[1] ? dateRange[0] : null,
                dateRange[0] && dateRange[1] ? dateRange[1] : null,
            )

            setIssues(issues)
        } catch (e: any) {
            props.onError(e)
            setIssues(null)
            return
        }
    }

    const onSearchIssues = async () => {
        setDataSubmitting(true)
        await getIssues()
        setDataSubmitting(false)
    }

    useEffect(() => {
        setDataSubmitting(true)
        getIssues().finally(() => {
            setDataSubmitting(false)
        })
    }, [])

    const handleAddItem = (set: string[], item: string, f: React.Dispatch<React.SetStateAction<string[]>>) => {
        for (let i = 0; i < set.length; i++) {
            if (set[i] === item) return
        }

        f([...set, item])
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={isMobile ? 12 : 4}>
                <div className="filters-section">
                    <FilterChipsInput
                        label="Классы"
                        values={classes}
                        onAdd={newClass => handleAddItem(classes, newClass, setClasses)}
                        onRemove={index => setClasses(classes.filter((_, i) => i !== index))}
                    />

                    <FilterChipsInput
                        label="Комнаты"
                        values={rooms}
                        onAdd={newRoom => handleAddItem(rooms, newRoom, setRooms)}
                        onRemove={index => setRooms(rooms.filter((_, i) => i !== index))}
                    />

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2, justifyContent: "space-between" }}>
                        <div style={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Все">
                                <IconButton
                                    size="small"
                                    color={statusFilter === 'all' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('all')}
                                >
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Выполненные">
                                <IconButton
                                    size="small"
                                    color={statusFilter === 'closed' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('closed')}
                                >
                                    <CheckCircleIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Не выполненные">
                                <IconButton
                                    size="small"
                                    color={statusFilter === 'open' ? 'primary' : 'default'}
                                    onClick={() => setStatusFilter('open')}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <p>статус</p>
                    </Box>

                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onSearchIssues}
                        sx={{ mt: 2 }}
                    >
                        Применить
                    </Button>
                </div>
            </Grid>

            <Grid item xs={isMobile ? 12: 8}>
                <div className="search-section">
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Поиск по заявкам..."
                    />
                    <Button
                        variant="contained"
                        sx={{ ml: 2 }}
                        onClick={onSearchIssues}
                    >
                        Найти
                    </Button>
                </div>

                <IssuesList issues={issues} onOpenIssue={props.onOpenIssue} />
            </Grid>
        </Grid>
    );
};

export default IssuesTab;