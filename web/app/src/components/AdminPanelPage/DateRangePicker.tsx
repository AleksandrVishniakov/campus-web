import React from 'react';
import { TextField, Box } from '@mui/material';

interface DateRangePickerProps {
  value: [Date | null, Date | null];
  onChange: (value: [Date | null, Date | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange([newDate, value[1]]);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;
    onChange([value[0], newDate]);
  };

  return (
    <Box mt={2}>
      <TextField
        label="Начальная дата"
        type="date"
        value={formatDate(value[0])}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
      />
      <TextField
        label="Конечная дата"
        type="date"
        value={formatDate(value[1])}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default DateRangePicker;