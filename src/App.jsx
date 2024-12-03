import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stock Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Item 1</TableCell>
              <TableCell>100</TableCell>
              <TableCell>
                <Button variant="contained">Edit</Button>
              </TableCell>
            </TableRow>
            {/* More rows can be added here */}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
