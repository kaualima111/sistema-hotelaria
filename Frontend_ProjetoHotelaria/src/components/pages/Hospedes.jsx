import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import { Row, Col } from 'react-bootstrap';
import axios from "axios";
import { cpfMask, cepMask, telefoneMask } from '../utils/Utils';
import HospedesLista from "../lists/HospedesLista";
import ModalHospedes from "../modals/ModalHospedes";

const API_URL = 'http://localhost:8000'; // URL do seu FastAPI

function Hospedes() {
  const [idHospede, setIdHospede] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [hospedes, setHospedes] = useState([]);
  const [carregaPagina, setCarregaPagina] = useState(false);

  // Carregar lista de hóspedes
  useEffect(() => {
    const fetchHospedes = async () => {
      try {
        const response = await axios.get(`${API_URL}/hospedes/`);
        setHospedes(response.data);
      } catch (err) {
        console.error('Erro ao carregar hóspedes:', err);
      }
    };
    fetchHospedes();
  }, [carregaPagina]);

  const limparFormulario = () => {
    setIdHospede(0);
    setNome('');
    setEmail('');
    setTelefone('');
    setCpf('');
    setCep('');
    setRua('');
    setNumero('');
    setCidade('');
  };

  const handleFillAddress = () => {
    if (cep) {
      const cepSemTraco = cep.replace('-', '');
      axios.get(`https://viacep.com.br/ws/${cepSemTraco}/json/`)
        .then(response => {
          setRua(response.data.logradouro || '');
          setCidade(response.data.localidade || '');
        })
        .catch(err => console.error('Erro ao buscar CEP:', err));
    }
  };

  const salvarHospede = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nome: nome,
        email: email,
        telefone: telefone,
        cpf: cpf
      };

      if (idHospede > 0) {
        // Atualizar
        await axios.put(`${API_URL}/hospedes/${idHospede}`, dataToSend);
        alert('Hóspede atualizado com sucesso!');
      } else {
        // Criar novo
        await axios.post(`${API_URL}/hospedes/`, dataToSend);
        alert('Hóspede cadastrado com sucesso!');
      }

      limparFormulario();
      setCarregaPagina(!carregaPagina);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar hóspede');
    }
  };

  const handleSelecao = (id) => {
    axios.get(`${API_URL}/hospedes/${id}`)
      .then(response => {
        const h = response.data;
        setIdHospede(h.id);
        setNome(h.nome);
        setEmail(h.email || '');
        setTelefone(h.telefone || '');
        setCpf(h.cpf || '');
      })
      .catch(err => console.error('Erro ao carregar hóspede:', err));
  };

  const excluirHospede = () => {
    if (idHospede > 0) {
      if (window.confirm('Deseja realmente excluir este hóspede?')) {
        axios.delete(`${API_URL}/hospedes/${idHospede}`)
          .then(() => {
            alert('Hóspede excluído com sucesso!');
            limparFormulario();
            setCarregaPagina(!carregaPagina);
          })
          .catch(err => console.error('Erro ao excluir:', err));
      }
    } else {
      alert('Selecione um hóspede para excluir');
    }
  };

  return (
    <Card className="m-3">
      <Card.Header className="bg-primary text-white">
        <h2>Cadastro de Hóspedes</h2>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control 
                  type="text" 
                  value={telefone}
                  onChange={(e) => setTelefone(telefoneMask(e.target.value))}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>CPF</Form.Label>
                <Form.Control 
                  type="text" 
                  value={cpf}
                  onChange={(e) => setCpf(cpfMask(e.target.value))}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>CEP</Form.Label>
                <Form.Control 
                  type="text" 
                  value={cep}
                  onChange={(e) => setCep(cepMask(e.target.value))}
                  onBlur={handleFillAddress}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Rua</Form.Label>
                <Form.Control 
                  type="text" 
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Número</Form.Label>
                <Form.Control 
                  type="text" 
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" onClick={salvarHospede} className="me-2">
              {idHospede > 0 ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button variant="secondary" onClick={limparFormulario} className="me-2">
              Limpar
            </Button>
            <Button variant="danger" onClick={excluirHospede}>
              Excluir
            </Button>
          </div>
        </Form>
        <hr />
        <HospedesLista 
          data={hospedes} 
          handleSelecao={handleSelecao}
        />
      </Card.Body>
    </Card>
  );
}

export default Hospedes;