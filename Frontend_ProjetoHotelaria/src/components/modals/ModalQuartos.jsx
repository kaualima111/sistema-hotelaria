import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = 'http://localhost:8000';

function ModalQuartos(props) {
    const [quarto, setQuarto] = useState({
        numero: '',
        tipo: '',
        preco_diaria: '',
        status: 'livre'
    });

    useEffect(() => {
        if (props.quartoId && props.showModal) {
            axios.get(`${API_URL}/quartos/${props.quartoId}`)
                .then(response => {
                    setQuarto(response.data);
                })
                .catch(err => console.error('Erro ao carregar quarto:', err));
        }
    }, [props.quartoId, props.showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuarto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalvar = () => {
        axios.put(`${API_URL}/quartos/${props.quartoId}`, quarto)
            .then(() => {
                alert('Quarto atualizado com sucesso!');
                props.onHide();
                if (props.onUpdate) props.onUpdate();
            })
            .catch(err => {
                console.error('Erro ao atualizar:', err);
                alert('Erro ao atualizar quarto');
            });
    };

    return (
        <Modal show={props.showModal} onHide={props.onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalhes do Quarto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Número</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="numero"
                                    value={quarto.numero}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    name="tipo"
                                    value={quarto.tipo}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Solteiro">Solteiro</option>
                                    <option value="Casal">Casal</option>
                                    <option value="Duplo">Duplo</option>
                                    <option value="Suite">Suíte</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Preço Diária</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    name="preco_diaria"
                                    value={quarto.preco_diaria}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={quarto.status}
                                    onChange={handleChange}
                                >
                                    <option value="livre">Livre</option>
                                    <option value="ocupado">Ocupado</option>
                                    <option value="manutencao">Manutenção</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Fechar
                </Button>
                <Button variant="primary" onClick={handleSalvar}>
                    Salvar Alterações
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalQuartos;