import React, { useState } from 'react';
import { 
  Modal, 
  Box, 
  TextField, 
  Button, 
  Typography 
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#1e1e1e',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'white'
};

export default function Form({ open, handleClose, addItem, addLog, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    unidade: '',
    setor: '',
    data: new Date().toISOString().split('T')[0], // Initialize with today's date
    responsavel: ''
  });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await addItem(formData.nome, formData.quantidade, formData.unidade);
    await addLog(
      formData.data, 
      formData.nome, 
      formData.quantidade, 
      formData.setor, 
      formData.responsavel
    );

    setFormData({ nome: '', quantidade: '', unidade: '', setor: '', data: '', responsavel: '' });
    onSubmitSuccess();
    handleClose();
  } catch (error) {
    console.error('Detailed error:', error.response?.data || error);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="modal-title"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2" mb={2}>
          Adicionar Produto
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ input: { color: 'white' }, label: { color: 'white' }, flex: 2 }}
            />
            <TextField
              label="Quantidade"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ input: { color: 'white' }, label: { color: 'white' }, flex: 1 }}
            />
          </Box>
          <TextField
            fullWidth
            label="Unidade"
            name="unidade"
            value={formData.unidade}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Data"
            name="data"
            type="date" // Add this
            value={formData.data}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ 
              input: { color: 'white' }, 
              label: { color: 'white' } 
            }}
          />
          <TextField
            fullWidth
            label="Responsável"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Setor"
            name="setor"
            value={formData.setor}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              color="primary"
            >
              Adicionar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}