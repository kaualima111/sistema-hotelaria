import React, { useState } from 'react';
import { Pagination, Badge } from 'react-bootstrap';

export default function ReservasLista(props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const reservasPaginaAtual = props.data.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(props.data.length / itensPorPagina);

    const mudarPagina = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
    };

    // Função para obter o nome do hóspede pelo ID
    const getHospedeNome = (id) => {
        if (!props.hospedes) return `ID: ${id}`;
        const hospede = props.hospedes.find(h => h.id === id);
        return hospede ? hospede.nome : `ID: ${id}`;
    };

    // Função para obter o número do quarto pelo ID
    const getQuartoInfo = (id) => {
        if (!props.quartos) return `ID: ${id}`;
        const quarto = props.quartos.find(q => q.id === id);
        return quarto ? `Quarto ${quarto.numero} (${quarto.tipo})` : `ID: ${id}`;
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

    const itensPaginacao = [];
    for (let numero = 1; numero <= totalPaginas; numero++) {
        itensPaginacao.push(
            <Pagination.Item
                key={numero}
                active={numero === paginaAtual}
                onClick={() => mudarPagina(numero)}
            >
                {numero}
            </Pagination.Item>
        );
    }

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Hóspede</th>
                        <th>Quarto</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reservasPaginaAtual.map((reserva) => (
                        <tr key={reserva.id}>
                            <td>
                                <input
                                    type="radio"
                                    name="rdReserva"
                                    onChange={() => props.handleSelecao(reserva.id)}
                                />
                            </td>
                            <td>{reserva.id}</td>
                            <td>{getHospedeNome(reserva.hospede_id)}</td>
                            <td>{getQuartoInfo(reserva.quarto_id)}</td>
                            <td>{reserva.data_checkin}</td>
                            <td>{reserva.data_checkout}</td>
                            <td>{getStatusBadge(reserva.status)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPaginas > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.First onClick={() => mudarPagina(1)} disabled={paginaAtual === 1} />
                        <Pagination.Prev onClick={() => mudarPagina(paginaAtual - 1)} 
                            disabled={paginaAtual === 1} />
                        {itensPaginacao}
                        <Pagination.Next onClick={() => mudarPagina(paginaAtual + 1)} 
                            disabled={paginaAtual === totalPaginas} />
                        <Pagination.Last onClick={() => mudarPagina(totalPaginas)} 
                            disabled={paginaAtual === totalPaginas} />
                    </Pagination>
                </div>
            )}
        </>
    );
}