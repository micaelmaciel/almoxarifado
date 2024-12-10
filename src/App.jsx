import React, { useState } from 'react'; // Add useEffect
import Box from '@mui/material/Box';
import Sidebar from './Components/Sidebar';
import BasicTable from './Components/BasicTable';
import ButtonUsage from './Components/BasicButton';
import axios from 'axios';


function addItem(nome, quantidade, unidade) {
  axios.post('http://localhost:3001/api/produtos', {
    nome: nome,
    quantidade: quantidade,
    unidade: unidade
  });
}


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    console.log('rendering page...');
    switch (currentPage) {
      case 'home':
        return (
          <>
            <h1>Início</h1>
            <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <BasicTable />
              <ButtonUsage onClick={() => addItem()} nome="Adicionar" />
            </div>
          </>
          );
      case 'stocks':
        return <h1>Estoque</h1>;
      case 'settings':
        return <h1>Configurações</h1>;
      default:
        return <h1>404 Not Found</h1>;
    }
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          p: 3,
          backgroundColor: '#121212',
          overflow: 'auto'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;