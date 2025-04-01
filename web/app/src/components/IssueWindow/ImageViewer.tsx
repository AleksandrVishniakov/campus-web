import React, { useState } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

interface Props {
    imageUrls: string[];
}

const ImageViewer: React.FC<Props> = ({ imageUrls }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

    const handleOpenImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleClose = () => {
        setCurrentImageIndex(null);
    };

    if (!imageUrls || imageUrls.length === 0) {
        return null;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <ImageList cols={3} gap={8}>
                {imageUrls.map((url, index) => (
                    <ImageListItem key={url}>
                        <img
                            src={url}
                            alt={`Preview ${index}`}
                            loading="lazy"
                            style={{ height: 200, objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() => handleOpenImage(index)}
                        />
                        <ImageListItemBar
                            position="top"
                            actionIcon={
                                <IconButton
                                    color="primary"
                                    onClick={() => handleOpenImage(index)}
                                    sx={{ color: 'white' }}
                                >
                                    <ZoomInIcon />
                                </IconButton>
                            }
                            actionPosition="right"
                        />
                    </ImageListItem>
                ))}
            </ImageList>

            <Dialog
                open={currentImageIndex !== null}
                onClose={handleClose}
                maxWidth="lg"
            >
                <DialogContent>
                    {currentImageIndex !== null && (
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`Full size ${currentImageIndex}`}
                            style={{ 
                                maxWidth: '80vw',
                                maxHeight: '80vh',
                                objectFit: 'contain' 
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ImageViewer;