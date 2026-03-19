import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import QuartosLista from "../lists/QuartosLista";
import ModalQuartos from "../modals/ModalQuartos";
const API_URL = 'http://localhost:8000';

function Quartos() {
  const [idQuarto, setIdQuarto] = useState(0);
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState('');
  const [precoDiaria, setPrecoDiaria] = useState('');
  const [status, setStatus] = useState('livre');
  const [quartos, setQuartos] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  useEffect(() => {
    const fetchQuartos = async () => {
      try {
        const response = await axios.get(`${API_URL}/quartos/`);
        setQuartos(response.data);
      } catch (err) {
        console.error('Erro ao carregar quartos:', err);
      }
    };
    fetchQuartos();
  }, [carregaPagina]);

  const limparFormulario = () => {
    setIdQuarto(0);
    setNumero('');
    setTipo('');
    setPrecoDiaria('');
    setStatus('livre');
  };

  const salvarQuarto = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        numero: parseInt(numero),
        tipo: tipo,
        preco_diaria: parseFloat(precoDiaria),
        status: status
      };

      if (idQuarto > 0) {
        await axios.put(`${API_URL}/quartos/${idQuarto}`, dataToSend);
        alert('Quarto atualizado com sucesso!');
      } else {
        await axios.post(`${API_URL}/quartos/`, dataToSend);
        alert('Quarto cadastrado com sucesso!');
      }

      limparFormulario();
      setCarregaPagina(!carregaPagina);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar quarto');
    }
  };

  const handleSelecao = (id) => {
    axios.get(`${API_URL}/quartos/${id}`)
      .then(response => {
        const q = response.data;
        setIdQuarto(q.id);
        setNumero(q.numero);
        setTipo(q.tipo);
        setPrecoDiaria(q.preco_diaria);
        setStatus(q.status);
      })
      .catch(err => console.error('Erro ao carregar quarto:', err));
  };

  const excluirQuarto = () => {
    if (idQuarto > 0) {
      if (window.confirm('Deseja realmente excluir este quarto?')) {
        axios.delete(`${API_URL}/quartos/${idQuarto}`)
          .then(() => {
            alert('Quarto excluído com sucesso!');
            limparFormulario();
            setCarregaPagina(!carregaPagina);
          })
          .catch(err => console.error('Erro ao excluir:', err));
      }
    } else {
      alert('Selecione um quarto para excluir');
    }
  };

  return (
    <Card className="m-3">
      <Card.Header className="bg-success text-white">
        <h2>Cadastro de Quartos</h2>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control 
                  type="number" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="Solteiro">Solteiro</option>
                  <option value="Casal">Casal</option>
                  <option value="Duplo">Duplo</option>
                  <option value="Suite">Suíte</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Preço Diária</Form.Label>
                <Form.Control 
                  type="number" 
                  step="0.01"
                  value={precoDiaria}
                  onChange={(e) => setPrecoDiaria(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="livre">Livre</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="manutencao">Manutenção</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="success" onClick={salvarQuarto} className="me-2">
              {idQuarto > 0 ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button variant="secondary" onClick={limparFormulario} className="me-2">
              Limpar
            </Button>
            <Button variant="danger" onClick={excluirQuarto}>
              Excluir
            </Button>
          </div>
        </Form>
        <hr />
        <QuartosLista 
          data={quartos} 
          handleSelecao={handleSelecao}
        />
      </Card.Body>
    </Card>
  );
}

export default Quartos;