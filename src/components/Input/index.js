import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({ error, label, type, value, onChange, name, onBlur }) {
    return (
        <TextField
            error={error}
            name={name}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            fullWidth={true}
            id={error ? "outlined-error-helper-text" : "outlined-basic"}
            label={label}
            type={type}
            helperText={error}
            variant="outlined" />
    );
}
