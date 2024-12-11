import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function LogTableSaida({ refreshTrigger }) {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { id: 'date', label: 'Data' },
    { id: 'product_name', label: 'Produto' },
    { id: 'quantity', label: 'Quantidade' },
    { id: 'sector', label: 'Setor' },
    { id: 'person', label: 'Responsável' }
  ];

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/remove_log');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [refreshTrigger]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const filteredLogs = logs.filter((log) =>
    log.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.date.includes(searchTerm)
  );

  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ 
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#1e1e1e',
      '& .MuiTableCell-root': {
        color: 'white',
        borderColor: 'rgba(255, 255, 255, 0.12)'
      }
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          m: 2,
          width: 'calc(100% - 32px)',
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'white',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'white' }} />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id} 
                  align="center"
                  sx={{
                    backgroundColor: '#1e1e1e !important',
                    fontWeight: 'bold'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map((log, index) => (
              <TableRow hover key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {log[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLogs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Logs por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: 'white',
          '.MuiTablePagination-select': {
            color: 'white'
          },
          '.MuiTablePagination-selectIcon': {
            color: 'white'
          },
          '.MuiTablePagination-displayedRows': {
            color: 'white'
          }
        }}
      />
    </Paper>
  );
}