import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function BasicTable() {
  const [products, setProducts] = useState([]);

  const columns = [
    { id: 'code', label: 'Código' },
    { id: 'name', label: 'Nome' },
    { id: 'quantity', label: 'Quantidade' },
    { id: 'unit', label: 'Unidade' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/produtos');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
      <Table sx={{ minWidth: 650 }} aria-label="products table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align="center" sx={{ color: 'white'}}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.code}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {columns.map((column) => (
                <TableCell key={column.id} align='center' sx={{ color: 'white' }}>
                  {product[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}