import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Trash } from 'lucide-react'; // Using lucide-react for icons

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
  <Card className="p-4 relative">
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        {title}
        {onClose && <button onClick={onClose} className="absolute top-2 right-2"></button>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.accessor} className="font-semibold w-1/3">{column.Header}</TableCell>
              ))}
              {onDelete && <TableCell className="font-semibold text-right w-1/3">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.id}>
                {columns.map(column => (
                  <TableCell key={column.accessor} className="truncate w-1/3">{row[column.accessor]}</TableCell>
                ))}
                {onDelete && row.canDelete && (
                  <TableCell className="text-right w-1/3">
                    <button onClick={() => onDelete(row.id)} className="text-red-600">
                      <Trash className="w-4 h-4" />
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {showAddForm && (
              <TableRow>
                <TableCell colSpan={columns.length + (onDelete ? 1 : 0)}>
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                    <Input
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription && setDescription(e.target.value)}
                      required
                      className="mb-2"
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      onChange={(e) => setValue && setValue(e.target.value)}
                      required
                      type="number"
                      step="0.01"
                      className="mb-2"
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button type="submit">Add</Button>
                      <Button type="button" variant="outline" onClick={() => onClose && onClose()}>Cancel</Button>
                    </div>
                  </form>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!showAddForm && onAdd && (
        <div className="flex justify-end mt-4">
          <Button onClick={onAdd}>Add</Button>
        </div>
      )}
    </CardContent>
  </Card>
);

export default DataTable;
