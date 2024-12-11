import React, { useState } from 'react'; // Add useEffect
import Box from '@mui/material/Box';
import axios from 'axios';

import Sidebar from './Components/Sidebar';
import BasicTable from './Components/BasicTable';
import LogTable from './Components/LogTable';
import ButtonUsage from './Components/BasicButton';
import Form from './Components/Form';


export function addItem(nome, quantidade, unidade) {
  return axios.post('http://localhost:3001/api/produtos', {
    nome: nome,
    quantidade: quantidade,
    unidade: unidade
  });
}

export function addLog(data, nome_produto, quantidade, setor, responsavel) {
  return axios.post('http://localhost:3001/api/add_log', {
    data: data,
    nome_produto: nome_produto,
    quantidade: quantidade,
    setor: setor,
    responsavel: responsavel
  });
}


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <h1>Estoque</h1>
            <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <BasicTable refreshTrigger={refreshTrigger}/>
              <ButtonUsage onClick={handleOpen} nome="Adicionar" />
              <Form open={open} handleClose={handleClose} addItem={addItem} addLog={addLog} onSubmitSuccess={handleRefresh} />
            </div>
          </>
        );
        case 'entrada':
          return (
            <>
              <h1>Histórico de entrada</h1>
              <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <LogTable refreshTrigger={refreshTrigger} />
              </div>
            </>
          );
      case 'saida':
        return <h1>Histórico de saída</h1>;
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