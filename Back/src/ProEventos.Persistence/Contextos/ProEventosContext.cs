using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : DbContext
    {

        public ProEventosContext(DbContextOptions<ProEventosContext> options)
         : base(options){}
        public DbSet<Evento> Eventos {get; set;}
        public DbSet<Lote> Lotes {get; set;}
        public DbSet<Palestrante> Palestrantes {get; set;}
        public DbSet<PalestranteEvento> PalestranteEventos {get; set;}
        public DbSet<RedeSocial> RedesSociais {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // especifica quais os ids externos que existem dentro do palestrante eventos que vao criar a relação entre os 2
            modelBuilder.Entity<PalestranteEvento>().HasKey(PE => new {PE.EventoId, PE.PalestranteId});

            // configuração de delete cascade
            // diz para o model builder que há uma entidade que contém N outras entidades e cada uma delas só pertence a 1 (relação 1 - N)
            modelBuilder.Entity<Evento>().HasMany(e => e.RedesSociais).WithOne(rs => rs.Evento).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Palestrante>().HasMany(p => p.RedesSociais).WithOne(rs => rs.Palestrante).OnDelete(DeleteBehavior.Cascade);
        }
    }
}