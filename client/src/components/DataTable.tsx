import React from 'react';
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

interface DataTableProps {
  title: string;
  columns: { Header: string; accessor: string }[];
  data: any[];
  onAdd?: () => void;
  onDelete?: (id: number) => void;
  showAddForm?: boolean;
  handleSubmit?: (e: React.FormEvent) => void;
  description?: string;
  setDescription?: (desc: string) => void;
  value?: string;
  setValue?: (val: string) => void;
  onClose?: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  data,
  onAdd,
  onDelete,
  showAddForm,
  handleSubmit,
  description,
  setDescription,
  value,
  setValue,
  onClose
}) => (
  <Paper style={{ padding: 16, position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
      <h3>{title}</h3>
      {onClose && <IconButton onClick={onClose} style={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>}
    </div>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.accessor}>{column.Header}</TableCell>
            ))}
            {onDelete && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              {columns.map(column => (
                <TableCell key={column.accessor}>{row[column.accessor]}</TableCell>
              ))}
              {onDelete && row.canDelete && (
                <TableCell>
                  <IconButton color="error" onClick={() => onDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
          {showAddForm && (
            <TableRow>
              <TableCell colSpan={columns.length + (onDelete ? 1 : 0)}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription && setDescription(e.target.value)}
                    required
                    style={{ marginBottom: 8 }}
                  />
                  <TextField
                    label="Value"
                    value={value}
                    onChange={(e) => setValue && setValue(e.target.value)}
                    required
                    type="number"
                    inputProps={{ step: "0.01" }}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <Button type="submit" variant="contained" color="primary" style={{ marginRight: 8 }}>Add</Button>
                    <Button type="button" onClick={() => onClose && onClose()} variant="outlined">Cancel</Button>
                  </div>
                </form>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    {!showAddForm && onAdd && (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <Button variant="contained" color="primary" onClick={onAdd}>Add</Button>
      </div>
    )}
  </Paper>
);

export default DataTable;
