import React, { ChangeEvent, useState, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface Props {
    onChange?: (files: File[]) => void;
    error?: boolean;
    maxFiles?: number;
}

const ImageUploadInput: React.FC<Props> = ({ onChange, error, maxFiles = 5 }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files).filter(file =>
            file.type.startsWith('image/')
        );

        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);

        setFiles(updatedFiles);
        updatePreviews(updatedFiles);
        onChange?.(updatedFiles);
    };

    const updatePreviews = (files: File[]) => {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleRemove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        updatePreviews(newFiles);
        onChange?.(newFiles);
    };

    return (
        <Box sx={{ display: 'flex', width: '100%', justifyContent:'space-between', flexWrap:'wrap'}}>
            <Button
                variant="outlined"
                component="label"
                color={error ? 'error' : 'primary'}
                startIcon={<AddPhotoAlternateIcon />}
            >
                Добавить изображения
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={files.length >= maxFiles}
                />
            </Button>

            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                {`Максимум ${maxFiles} изображений (осталось ${maxFiles - files.length})`}
            </Typography>

            {previews.length > 0 && (
                <ImageList cols={3} gap={8} sx={{ mt: 2 }}>
                    {previews.map((url, index) => (
                        <ImageListItem key={url}>
                            <img
                                src={url}
                                alt={`Preview ${index}`}
                                loading="lazy"
                                style={{ height: 200, objectFit: 'cover' }}
                            />
                            <ImageListItemBar
                                position="top"
                                actionIcon={
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                actionPosition="right"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
        </Box>
    );
};

export default ImageUploadInput;