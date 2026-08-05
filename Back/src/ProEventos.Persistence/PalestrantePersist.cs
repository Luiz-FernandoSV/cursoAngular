using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Models;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contextos;

namespace ProEventos.Persistence
{
    public class PalestrantePersist : IPalestrantePersist
    {

        private readonly ProEventosContext _context;

        public PalestrantePersist(ProEventosContext context)
        {
            _context = context;
        }
    
        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(e => e.RedesSociais);

            if (includeEventos)
            {
                query = query
                .Include(e => e.PalestranteEventos)
                .ThenInclude(pe => pe.EventoId);
            }

            query = query.AsNoTracking()
            .OrderBy(p => p.Id)
            .Where(p => p.User.PrimeiroNome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(e => e.RedesSociais);

            if (includeEventos)
            {
                query = query.AsNoTracking()
                .Include(e => e.PalestranteEventos)
                .ThenInclude(pe => pe.Evento);
            }

            query = query
            .OrderBy(p => p.Id);

            return await query.ToArrayAsync();
        }
        public async Task<Palestrante > GetPalestrantesByIdAsync(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(e => e.RedesSociais);

            if (includeEventos)
            {
                query = query.AsNoTracking()
                .Include(e => e.PalestranteEventos)
                .ThenInclude(pe => pe.EventoId);
            }

            query = query
            .OrderBy(p => p.Id)
            .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }


    }
}