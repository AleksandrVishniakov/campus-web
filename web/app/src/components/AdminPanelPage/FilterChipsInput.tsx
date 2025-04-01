import React, { useState } from 'react';
import { TextField, Button, Chip, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface FilterChipsInputProps {
  label: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}

const FilterChipsInput: React.FC<FilterChipsInputProps> = ({ 
  label, 
  values, 
  onAdd, 
  onRemove 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <Box mb={1}>
      <div className="filter-input-container">
        <TextField
          label={label}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          fullWidth
          size="small"
        />
        <Button 
          variant="outlined" 
          onClick={handleAdd}
          
        >
          <AddIcon />
        </Button>
      </div>

      <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {values.map((value, index) => (
          <Chip
            key={index}
            label={value}
            onDelete={() => onRemove(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FilterChipsInput;