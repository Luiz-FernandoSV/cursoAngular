using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain.Identity;
using ProEventos.Domain.Models;

namespace ProEventos.Persistence.Contextos
{
    public class ProEventosContext : IdentityDbContext<User,Role, int,
                                     IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, 
                                     IdentityRoleClaim<int>, IdentityUserToken<int>>
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
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new {ur.UserId,ur.RoleId});

                userRole.HasOne(ur => ur.Role) // diz que cada UserRole possui uma Role
                .WithMany(r => r.UserRoles) // diz que uma Role pode possuir várias UserRoles
                .HasForeignKey(ur => ur.RoleId) // diz que o campo RoleId dentro de UserRole é a FK que aponta para a Role
                .IsRequired(); // diz que UserRole obrigatoriamente precisa estar ligada a uma Role

                userRole.HasOne(ur => ur.User) // diz que cada UserRole possui um user
                .WithMany(u => u.UserRoles) // diz que um user pode possuir varias UserRoles
                .HasForeignKey(ur => ur.UserId) // diz que o campo UserId dentro de UserRole é a FK que aponta para User
                .IsRequired(); // diz que UserRole obrigatoriamente precisa estar ligada a um User
            });

            // especifica quais os ids externos que existem dentro do palestrante eventos que vao criar a relação entre os 2
            modelBuilder.Entity<PalestranteEvento>().HasKey(PE => new {PE.EventoId, PE.PalestranteId});

            // configuração de delete cascade
            // diz para o model builder que há uma entidade que contém N outras entidades e cada uma delas só pertence a 1 (relação 1 - N)
            modelBuilder.Entity<Evento>().HasMany(e => e.RedesSociais).WithOne(rs => rs.Evento).OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Palestrante>().HasMany(p => p.RedesSociais).WithOne(rs => rs.Palestrante).OnDelete(DeleteBehavior.Cascade);
        }
    }
}