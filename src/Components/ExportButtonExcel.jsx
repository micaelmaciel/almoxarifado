import React from 'react';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

export default function ExportButtonExcel({ data, filename }) {
  const exportToExcel = () => {
    // Define column headers in Portuguese
    const headers = {
      code: 'Código',
      name: 'Nome',
      quantity: 'Quantidade',
      unit: 'Unidade',
      date: 'Data',
      product_name: 'Produto',
      sector: 'Setor',
      person: 'Responsável'
    };

    // Transform data to use Portuguese headers
    const transformedData = data.map(item => {
      const newItem = {};
      Object.keys(item).forEach(key => {
        newItem[headers[key] || key] = item[key];
      });
      return newItem;
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(transformedData);
    
    // Set column widths
    const colWidths = [];
    Object.keys(transformedData[0] || {}).forEach(() => {
      colWidths.push({ wch: 20 }); // width of 20 characters
    });
    ws['!cols'] = colWidths;

    // Create cell style object for center alignment
    const centerStyle = {
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      }
    };

    // Apply center alignment to all cells including headers
    if (ws['!ref']) {
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cellRef]) continue;
          ws[cellRef].s = centerStyle;
        }
      }
    }

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <Button 
      variant="contained" 
      onClick={exportToExcel}
      startIcon={<FileDownloadIcon />}
      sx={{ 
        backgroundColor: '#1e1e1e',
        '&:hover': {
          backgroundColor: '#333'
        },
        margin: '10px'
      }}
    >
      Exportar Excel
    </Button>
  );
}