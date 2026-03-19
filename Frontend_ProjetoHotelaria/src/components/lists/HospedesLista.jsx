import React, { useState } from 'react';
import { Pagination } from 'react-bootstrap';

export default function HospedesLista(props) {
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const hospedePaginaAtual = props.data.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(props.data.length / itensPorPagina);

    const mudarPagina = (numeroPagina) => {
        setPaginaAtual(numeroPagina);
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
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>CPF</th>
                    </tr>
                </thead>
                <tbody>
                    {hospedePaginaAtual.map((hospede) => (
                        <tr key={hospede.id}>
                            <td>
                                <input
                                    type="radio"
                                    name="rdHospede"
                                    onChange={() => props.handleSelecao(hospede.id)}
                                />
                            </td>
                            <td>{hospede.id}</td>
                            <td>{hospede.nome}</td>
                            <td>{hospede.email || '-'}</td>
                            <td>{hospede.telefone || '-'}</td>
                            <td>{hospede.cpf || '-'}</td>
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