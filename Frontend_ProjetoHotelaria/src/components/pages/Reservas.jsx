import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import { Row, Col, Alert } from 'react-bootstrap';
import axios from "axios";
import ReservasLista from "../lists/ReservasLista";
import ModalReservas from "../modals/ModalReservas";

const API_URL = 'http://localhost:8000';

function Reservas() {
  const [idReserva, setIdReserva] = useState(0);
  const [hospedeId, setHospedeId] = useState('');
  const [quartoId, setQuartoId] = useState('');
  const [dataCheckin, setDataCheckin] = useState('');
  const [dataCheckout, setDataCheckout] = useState('');
  const [status, setStatus] = useState('reservada');
  const [hospedes, setHospedes] = useState([]);
  const [quartos, setQuartos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);
  const [diarias, setDiarias] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservasRes, hospedesRes, quartosRes] = await Promise.all([
          axios.get(`${API_URL}/reservas/`),
          axios.get(`${API_URL}/hospedes/`),
          axios.get(`${API_URL}/quartos/`)
        ]);
        setReservas(reservasRes.data);
        setHospedes(hospedesRes.data);
        setQuartos(quartosRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        mostrarMensagem('Erro ao carregar dados do servidor', 'danger');
      }
    };
    fetchData();
  }, [carregaPagina]);

  // Função para mostrar mensagens
  const mostrarMensagem = (texto, tipo) => {
    setMensagem(texto);
    setTipoMensagem(tipo);
    setTimeout(() => {
      setMensagem('');
      setTipoMensagem('');
    }, 5000);
  };

  // Calcular diárias e valor total quando datas ou quarto mudam
  useEffect(() => {
    if (dataCheckin && dataCheckout && quartoId) {
      const checkin = new Date(dataCheckin);
      const checkout = new Date(dataCheckout);
      const diffTime = Math.abs(checkout - checkin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        setDiarias(diffDays);
        
        const quarto = quartos.find(q => q.id === parseInt(quartoId));
        if (quarto) {
          setValorTotal(diffDays * parseFloat(quarto.preco_diaria));
        }
      } else {
        setDiarias(0);
        setValorTotal(0);
      }
    }
  }, [dataCheckin, dataCheckout, quartoId, quartos]);

  const limparFormulario = () => {
    setIdReserva(0);
    setHospedeId('');
    setQuartoId('');
    setDataCheckin('');
    setDataCheckout('');
    setStatus('reservada');
    setDiarias(0);
    setValorTotal(0);
  };

  const salvarReserva = async (e) => {
    e.preventDefault();
    
    if (!hospedeId || !quartoId || !dataCheckin || !dataCheckout) {
      mostrarMensagem('Preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    if (new Date(dataCheckin) >= new Date(dataCheckout)) {
      mostrarMensagem('Data de check-out deve ser após a data de check-in!', 'warning');
      return;
    }

    try {
      const dataToSend = {
        hospede_id: parseInt(hospedeId),
        quarto_id: parseInt(quartoId),
        data_checkin: dataCheckin,
        data_checkout: dataCheckout,
        status: status
      };

      if (idReserva > 0) {
        await axios.put(`${API_URL}/reservas/${idReserva}`, dataToSend);
        mostrarMensagem('Reserva atualizada com sucesso!', 'success');
      } else {
        await axios.post(`${API_URL}/reservas/`, dataToSend);
        mostrarMensagem('Reserva criada com sucesso!', 'success');
      }

      limparFormulario();
      setCarregaPagina(!carregaPagina);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      mostrarMensagem(error.response?.data?.detail || 'Erro ao salvar reserva', 'danger');
    }
  };

  const handleSelecao = (id) => {
    axios.get(`${API_URL}/reservas/${id}`)
      .then(response => {
        const r = response.data;
        setIdReserva(r.id);
        setHospedeId(r.hospede_id);
        setQuartoId(r.quarto_id);
        setDataCheckin(r.data_checkin);
        setDataCheckout(r.data_checkout);
        setStatus(r.status);
      })
      .catch(err => {
        console.error('Erro ao carregar reserva:', err);
        mostrarMensagem('Erro ao carregar dados da reserva', 'danger');
      });
  };

  const handleCheckin = async () => {
    if (idReserva > 0) {
      try {
        await axios.put(`${API_URL}/reservas/${idReserva}/checkin`);
        mostrarMensagem('Check-in realizado com sucesso!', 'success');
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      } catch (error) {
        mostrarMensagem(error.response?.data?.detail || 'Erro ao fazer check-in', 'danger');
      }
    } else {
      mostrarMensagem('Selecione uma reserva', 'warning');
    }
  };

  const handleCheckout = async () => {
    if (idReserva > 0) {
      try {
        await axios.put(`${API_URL}/reservas/${idReserva}/checkout`);
        mostrarMensagem('Check-out realizado com sucesso!', 'success');
        limparFormulario();
        setCarregaPagina(!carregaPagina);
      } catch (error) {
        mostrarMensagem(error.response?.data?.detail || 'Erro ao fazer check-out', 'danger');
      }
    } else {
      mostrarMensagem('Selecione uma reserva', 'warning');
    }
  };

  const cancelarReserva = async () => {
    if (idReserva > 0) {
      if (window.confirm('Deseja cancelar esta reserva?')) {
        try {
          await axios.put(`${API_URL}/reservas/${idReserva}/cancelar`);
          mostrarMensagem('Reserva cancelada!', 'success');
          limparFormulario();
          setCarregaPagina(!carregaPagina);
        } catch (error) {
          mostrarMensagem(error.response?.data?.detail || 'Erro ao cancelar reserva', 'danger');
        }
      }
    } else {
      mostrarMensagem('Selecione uma reserva', 'warning');
    }
  };

  const excluirReserva = async () => {
    if (idReserva > 0) {
      if (window.confirm('Deseja realmente excluir esta reserva?')) {
        try {
          await axios.delete(`${API_URL}/reservas/${idReserva}`);
          mostrarMensagem('Reserva excluída com sucesso!', 'success');
          limparFormulario();
          setCarregaPagina(!carregaPagina);
        } catch (error) {
          console.error('Erro ao excluir:', error);
          mostrarMensagem(error.response?.data?.detail || 'Erro ao excluir reserva', 'danger');
        }
      }
    } else {
      mostrarMensagem('Selecione uma reserva', 'warning');
    }
  };

  return (
    <Card className="m-3">
      <Card.Header className="bg-info text-white">
        <h2>Reservas</h2>
      </Card.Header>
      <Card.Body>
        {mensagem && (
          <Alert variant={tipoMensagem} onClose={() => setMensagem('')} dismissible>
            {mensagem}
          </Alert>
        )}
        
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Hóspede *</Form.Label>
                <Form.Select 
                  value={hospedeId} 
                  onChange={(e) => setHospedeId(e.target.value)}
                >
                  <option value="">Selecione um hóspede</option>
                  {hospedes.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quarto *</Form.Label>
                <Form.Select 
                  value={quartoId} 
                  onChange={(e) => setQuartoId(e.target.value)}
                >
                  <option value="">Selecione um quarto</option>
                  {quartos.filter(q => q.status === 'livre' || q.id === parseInt(quartoId)).map(q => (
                    <option key={q.id} value={q.id}>
                      Quarto {q.numero} - {q.tipo} (R$ {parseFloat(q.preco_diaria).toFixed(2)})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Data Check-in *</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dataCheckin}
                  onChange={(e) => setDataCheckin(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Data Check-out *</Form.Label>
                <Form.Control 
                  type="date" 
                  value={dataCheckout}
                  onChange={(e) => setDataCheckout(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Diárias</Form.Label>
                <Form.Control 
                  type="text" 
                  value={diarias}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Valor Total</Form.Label>
                <Form.Control 
                  type="text" 
                  value={`R$ ${valorTotal.toFixed(2)}`}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="reservada">Reservada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="checkin_realizado">Check-in</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="mt-3">
            <Button variant="info" onClick={salvarReserva} className="me-2">
              {idReserva > 0 ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button variant="secondary" onClick={limparFormulario} className="me-2">
              Limpar
            </Button>
            <Button variant="success" onClick={handleCheckin} className="me-2">
              Check-in
            </Button>
            <Button variant="warning" onClick={handleCheckout} className="me-2">
              Check-out
            </Button>
            <Button variant="danger" onClick={cancelarReserva} className="me-2">
              Cancelar
            </Button>
            <Button variant="dark" onClick={excluirReserva}>
              Excluir
            </Button>
          </div>
        </Form>
        
        <hr />
        
        <ReservasLista 
          data={reservas} 
          hospedes={hospedes}
          quartos={quartos}
          handleSelecao={handleSelecao}
        />
      </Card.Body>
    </Card>
  );
}

export default Reservas;