using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain.Models;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {
    // Eventos
     Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams,bool includePalestrantes);
     Task<Evento> GetEventoByIdAsync(int userId ,int eventoId, bool includePalestrantes);
    }
}