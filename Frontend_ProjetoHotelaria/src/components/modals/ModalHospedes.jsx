import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const API_URL = 'http://localhost:8000';

function ModalHospedes(props) {
    const [hospede, setHospede] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: ''
    });

    useEffect(() => {
        if (props.hospedeId && props.showModal) {
            // Carregar dados do hóspede quando o modal abrir
            axios.get(`${API_URL}/hospedes/${props.hospedeId}`)
                .then(response => {
                    setHospede(response.data);
                })
                .catch(err => console.error('Erro ao carregar hóspede:', err));
        }
    }, [props.hospedeId, props.showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospede(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalvar = () => {
        // Lógica para salvar as alterações
        axios.put(`${API_URL}/hospedes/${props.hospedeId}`, hospede)
            .then(() => {
                alert('Hóspede atualizado com sucesso!');
                props.onHide(); // Fecha o modal
                if (props.onUpdate) props.onUpdate(); // Atualiza a lista
            })
            .catch(err => {
                console.error('Erro ao atualizar:', err);
                alert('Erro ao atualizar hóspede');
            });
    };

    return (
        <Modal show={props.showModal} onHide={props.onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalhes do Hóspede</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={8}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome"
                                    value={hospede.nome}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>CPF</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="cpf"
                                    value={hospede.cpf}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={hospede.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefone"
                                    value={hospede.telefone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data de Cadastro</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={hospede.data_cadastro ? new Date(hospede.data_cadastro).toLocaleDateString() : ''}
                                    disabled
                                />
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

export default ModalHospedes;