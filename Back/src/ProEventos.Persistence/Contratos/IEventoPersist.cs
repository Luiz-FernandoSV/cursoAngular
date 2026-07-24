using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
    // Eventos
     Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes);
     Task<Evento[]> GetAllEventosAsync(bool includePalestrantes);
     Task<Evento> GetEventosByIdAsync(int eventoId, bool includePalestrantes);
    }
}