import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";

const API_URL = 'http://localhost:8000';

function ModalReservas(props) {
    const [reserva, setReserva] = useState({
        hospede_id: '',
        quarto_id: '',
        data_checkin: '',
        data_checkout: '',
        status: ''
    });
    const [hospedeNome, setHospedeNome] = useState('');
    const [quartoInfo, setQuartoInfo] = useState('');

    useEffect(() => {
        if (props.reservaId && props.showModal) {
            // Carregar dados da reserva
            axios.get(`${API_URL}/reservas/${props.reservaId}`)
                .then(response => {
                    setReserva(response.data);
                    
                    // Buscar nome do hóspede
                    axios.get(`${API_URL}/hospedes/${response.data.hospede_id}`)
                        .then(hospRes => setHospedeNome(hospRes.data.nome))
                        .catch(err => console.error('Erro ao carregar hóspede:', err));
                    
                    // Buscar informações do quarto
                    axios.get(`${API_URL}/quartos/${response.data.quarto_id}`)
                        .then(quartRes => setQuartoInfo(`Quarto ${quartRes.data.numero} - ${quartRes.data.tipo}`))
                        .catch(err => console.error('Erro ao carregar quarto:', err));
                })
                .catch(err => console.error('Erro ao carregar reserva:', err));
        }
    }, [props.reservaId, props.showModal]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReserva(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckin = () => {
        axios.put(`${API_URL}/reservas/${props.reservaId}/checkin`)
            .then(() => {
                alert('Check-in realizado com sucesso!');
                props.onHide();
                if (props.onUpdate) props.onUpdate();
            })
            .catch(err => {
                alert(err.response?.data?.detail || 'Erro ao fazer check-in');
            });
    };

    const handleCheckout = () => {
        axios.put(`${API_URL}/reservas/${props.reservaId}/checkout`)
            .then(() => {
                alert('Check-out realizado com sucesso!');
                props.onHide();
                if (props.onUpdate) props.onUpdate();
            })
            .catch(err => {
                alert(err.response?.data?.detail || 'Erro ao fazer check-out');
            });
    };

    const handleCancelar = () => {
        if (window.confirm('Deseja cancelar esta reserva?')) {
            axios.put(`${API_URL}/reservas/${props.reservaId}/cancelar`)
                .then(() => {
                    alert('Reserva cancelada!');
                    props.onHide();
                    if (props.onUpdate) props.onUpdate();
                })
                .catch(err => {
                    alert(err.response?.data?.detail || 'Erro ao cancelar reserva');
                });
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'reservada': return <Badge bg="primary">Reservada</Badge>;
            case 'confirmada': return <Badge bg="info">Confirmada</Badge>;
            case 'checkin_realizado': return <Badge bg="success">Check-in</Badge>;
            case 'finalizada': return <Badge bg="secondary">Finalizada</Badge>;
            case 'cancelada': return <Badge bg="danger">Cancelada</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Modal show={props.showModal} onHide={props.onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalhes da Reserva</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Hóspede</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={hospedeNome}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Quarto</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={quartoInfo}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data Check-in</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="data_checkin"
                                    value={reserva.data_checkin}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data Check-out</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="data_checkout"
                                    value={reserva.data_checkout}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <div className="mt-2">
                                    {getStatusBadge(reserva.status)}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Fechar
                </Button>
                
                {reserva.status === 'reservada' && (
                    <>
                        <Button variant="success" onClick={handleCheckin}>
                            Check-in
                        </Button>
                        <Button variant="danger" onClick={handleCancelar}>
                            Cancelar
                        </Button>
                    </>
                )}
                
                {reserva.status === 'checkin_realizado' && (
                    <Button variant="warning" onClick={handleCheckout}>
                        Check-out
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalReservas;