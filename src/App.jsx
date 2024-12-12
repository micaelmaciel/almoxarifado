import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material'; // Add this line
import axios from 'axios';

import Sidebar from './Components/Sidebar';
import BasicTable from './Components/BasicTable';
import LogTable from './Components/LogTable';
import ButtonUsage from './Components/BasicButton';
import Form from './Components/FormEntrada';
import FormSaida from './Components/FormSaida';
import LogTableSaida from './Components/LogTableSaida';
import FormCadastro from './Components/FormCadastro';
import ExportButtonExcel from './Components/ExportButtonExcel';

export function addItem(nome, quantidade, unidade) {
  return axios.post('http://localhost:3001/api/produtos', {
    nome: nome,
    quantidade: quantidade,
    unidade: unidade
  });
}

export function updateQuantity(nome, quantidade) {
  return axios.post('http://localhost:3001/api/produtos/add', {
    nome: nome,
    quantidade: quantidade
  });
}

export function addLog(data, nome_produto, quantidade, setor, responsavel) {
  return axios.post('http://localhost:3001/api/add_log', {
    data,
    nome_produto,
    quantidade,
    setor,
    responsavel
  });
}

export function subtractItem(nome, quantidade) {
  return axios.post('http://localhost:3001/api/produtos/subtract', {
    nome: nome,
    quantidade: quantidade
  });
}

export function removeLog(data, nome_produto, quantidade, setor, responsavel) {
  return axios.post('http://localhost:3001/api/remove_log', {
    data,
    nome_produto,
    quantidade,
    setor,
    responsavel
  });
}


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [products, setProducts] = useState([]); // Move these up
  const [logs, setLogs] = useState([]);
  const [removeLogs, setRemoveLogs] = useState([]);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenRemove = () => setOpenRemove(true);
  const handleCloseRemove = () => setOpenRemove(false);
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOpenCadastro = () => setOpenCadastro(true);
  const handleCloseCadastro = () => setOpenCadastro(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch('http://localhost:3001/api/produtos');
        const productsData = await productsRes.json();
        setProducts(productsData);

        const logsRes = await fetch('http://localhost:3001/api/add_log');
        const logsData = await logsRes.json();
        setLogs(logsData);

        const removeLogsRes = await fetch('http://localhost:3001/api/remove_log');
        const removeLogsData = await removeLogsRes.json();
        setRemoveLogs(removeLogsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <h1>Estoque</h1>
            <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <BasicTable refreshTrigger={refreshTrigger}/>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px', rowGap: '20px'}}>
                <ButtonUsage onClick={handleOpenCadastro} nome="Cadastrar" />
                <ButtonUsage onClick={handleOpenAdd} nome="Entrada" />
                <ButtonUsage onClick={handleOpenRemove} nome="Saída" />
                <ExportButtonExcel data={products} filename="estoque" />
              </div>
              <FormCadastro 
                open={openCadastro} 
                handleClose={handleCloseCadastro} 
                addItem={addItem} 
                onSubmitSuccess={handleRefresh} 
              />
              <Form 
                open={openAdd} 
                handleClose={handleCloseAdd} 
                updateQuantity={updateQuantity}  // Change this line
                addLog={addLog} 
                onSubmitSuccess={handleRefresh} 
              />              
              <FormSaida 
                open={openRemove} 
                handleClose={handleCloseRemove} 
                subtractItem={subtractItem} 
                removeLog={removeLog} 
                onSubmitSuccess={handleRefresh} 
              />
            </div>
          </>
        );
        case 'entrada':
          return (
            <>
            <h1>Histórico de entrada</h1>
            <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <LogTable refreshTrigger={refreshTrigger}/>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px', rowGap: '20px'}}>
              <ExportButtonExcel data={logs} filename="historico_entrada" />
              </div>
            </div>
          </>
          );
        case 'saida':
          return (
            <>
            <h1>Histórico de saída</h1>
            <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'center', alignContent: 'center'}}>
              <LogTableSaida refreshTrigger={refreshTrigger}/>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '20px', rowGap: '20px'}}>
              <ExportButtonExcel data={removeLogs} filename="historico_saida" />
              </div>
            </div>
          </>
          );
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