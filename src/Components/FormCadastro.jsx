import React, { useState } from 'react';
import { 
    Modal, 
    Box, 
    TextField, 
    Button, 
    Typography,
    Select,         // Add these
    MenuItem,
    InputLabel,
    FormControl
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

export default function FormCadastro({ open, handleClose, addItem, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '0', // Default value is '0'
    unidade: ''
  });

  const units = ["Caixa", "Pacote", "Unitário"];


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem(formData.nome, formData.quantidade, formData.unidade);
      setFormData({ nome: '', quantidade: '0', unidade: '' });
      onSubmitSuccess();
      handleClose();
    } catch (error) {
      if (error.response?.data?.error?.includes('UNIQUE constraint failed')) {
        alert('Já existe um produto com esse nome!');
      } else {
        console.error('Error:', error);
        alert('Erro ao cadastrar produto');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          Cadastrar Produto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <TextField
            fullWidth
            label="Quantidade"
            name="quantidade"
            type="number"
            value={formData.quantidade}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel sx={{ color: 'white' }}>Unidade</InputLabel>
            <Select
              name="unidade"
              value={formData.unidade}
              onChange={handleChange}
              label="Unidade"
              sx={{ 
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                }
              }}
            >
              {["Caixa", "Pacote", "Individual"].map((unit) => (
                <MenuItem key={unit} value={unit}>{unit}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
              Cadastrar
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}