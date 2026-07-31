using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
    // Lotes
    /// <summary>
    ///     Metodo get que retornara uma lista de lotes por eventoId
    /// </summary>
    /// <param name="eventoId">Codigo chave da tabela Evento</param>
    /// <returns>Lista de lotes</returns>
     public Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

     /// <summary>
     ///    Metodo get que retornara apenas 1 ltoe
     /// </summary>
     /// <param name="eventoId">Codigo chave da tabela Evento</param>
     /// <param name="id">Codigo chave da tabela Chave</param>
     /// <returns>Apenas 1 lote</returns>
     public Task<Lote> GetLoteByIdsAsync(int eventoId, int id );
    }
}