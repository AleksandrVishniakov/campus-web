import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    useTheme,
    TextField,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
    id: number;
    byAuthor: boolean;
    content: string;
    createdAt: Date;
    canEdit?: boolean;
    onEdit?: (id: number, content: string) => void;
    onDelete?: (id: number) => void;
}

const Comment: React.FC<Props> = ({ 
    id, 
    byAuthor, 
    content, 
    createdAt, 
    canEdit = false, 
    onEdit, 
    onDelete 
}) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current && !isEditing) {
            const el = contentRef.current;
            setHasOverflow(el.scrollHeight > el.clientHeight);
        }
    }, [content, isEditing]);

    const formatDate = (d: Date): string => {
        const date = new Date(d);
        return date.toLocaleTimeString() + " " + date.toLocaleDateString();
    }

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(content);
    };

    const handleSave = () => {
        setIsEditing(false);
        onEdit?.(id, editedContent);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(content);
    };

    const handleDelete = () => {
        onDelete?.(id);
    };

    const formattedDate = formatDate(createdAt);

    return (
        <Box
            sx={{
                maxWidth: '80%',
                ml: byAuthor ? 'auto' : 0,
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: byAuthor 
                    ? theme.palette.primary.light
                    : theme.palette.grey[200],
                position: 'relative',
                '&:hover .comment-actions': {
                    opacity: 1
                }
            }}
        >
            {canEdit && !isEditing && (
                <Box className="comment-actions" 
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        bgcolor: 'background.paper',
                        borderRadius: 1
                    }}
                >
                    <IconButton onClick={handleEdit} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleDelete} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            {isEditing ? (
                <>
                    <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSave}
                            startIcon={<SaveIcon />}
                        >
                            Сохранить
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancel}
                            startIcon={<CancelIcon />}
                        >
                            Отмена
                        </Button>
                    </Box>
                </>
            ) : (
                <>
                    <Typography
                        ref={contentRef}
                        sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: expanded ? 'unset' : 6,
                            pr: canEdit ? 4 : 0
                        }}
                    >
                        {content}
                    </Typography>
                    
                    {hasOverflow && (
                        <Button
                            size="small"
                            onClick={() => setExpanded(!expanded)}
                            sx={{ mt: 1, p: 0, minWidth: 0 }}
                        >
                            {expanded ? 'Свернуть' : 'Развернуть'}
                        </Button>
                    )}
                </>
            )}

            <Typography
                variant="caption"
                component="div"
                sx={{ 
                    color: '#545454', 
                    fontSize: '14px',
                    textAlign: byAuthor ? 'right' : 'left',
                    mt: 1
                }}
            >
                {formattedDate}
            </Typography>
        </Box>
    );
};

export default Comment;