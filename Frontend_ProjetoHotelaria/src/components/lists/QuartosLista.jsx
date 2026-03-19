import React, { useState } from 'react';
import { Pagination, Badge } from 'react-bootstrap';

export default function QuartosLista(props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const quartosPaginaAtual = props.data.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(props.data.length / itensPorPagina);

    const mudarPagina = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'livre': return <Badge bg="success">Livre</Badge>;
            case 'ocupado': return <Badge bg="danger">Ocupado</Badge>;
            case 'manutencao': return <Badge bg="warning">Manutenção</Badge>;
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
                        <th>Número</th>
                        <th>Tipo</th>
                        <th>Preço Diária</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {quartosPaginaAtual.map((quarto) => (
                        <tr key={quarto.id}>
                            <td>
                                <input
                                    type="radio"
                                    name="rdQuarto"
                                    onChange={() => props.handleSelecao(quarto.id)}
                                />
                            </td>
                            <td>{quarto.id}</td>
                            <td>{quarto.numero}</td>
                            <td>{quarto.tipo}</td>
                            <td>R$ {parseFloat(quarto.preco_diaria).toFixed(2)}</td>
                            <td>{getStatusBadge(quarto.status)}</td>
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