using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IPalestrantePersist
    {
    // Palestrantes
    Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string Nome, bool includeEventos);
     Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos);
     Task<Palestrante> GetPalestrantesByIdAsync(int palestranteId, bool includeEventos);
    }
}