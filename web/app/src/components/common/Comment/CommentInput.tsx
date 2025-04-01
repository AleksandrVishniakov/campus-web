import React, { useState } from 'react';
import {
    Box,
    TextField,
    useTheme,
    IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Props {
    onSubmit: (content: string) => void;
}

const CommentInput: React.FC<Props> = ({ onSubmit }) => {
    const theme = useTheme();
    const [content, setContent] = useState('');
    
    const handleSubmit = () => {
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'flex-end', 
            mb: 3,
            position: 'relative'
        }}>
            <TextField
                fullWidth
                multiline
                minRows={2}
                maxRows={6}
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="новый комментарий..."
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        backgroundColor: theme.palette.background.paper,
                        paddingRight: 6
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />
            
            <IconButton
                onClick={handleSubmit}
                disabled={!content.trim()}
                sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    color: theme.palette.primary.main,
                    '&:disabled': {
                        color: theme.palette.text.disabled
                    }
                }}
            >
                <SendIcon />
            </IconButton>
        </Box>
    );
};

export default CommentInput;