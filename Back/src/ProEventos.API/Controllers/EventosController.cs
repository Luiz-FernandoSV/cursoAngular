using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Data;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly DataContext _context;

        public EventosController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _context.Eventos; 
        }

        [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
            return _context.Eventos.Where(evento => evento.EventoId == id);
        }
        

        [HttpPost]
        public string Post(string nome)
        {
            return $"Primeiro post!";
        }

        [HttpPut("{nome}")]
        public string Put(string nome)
        {
            return $"Primeiro put! feito por {nome}";
        }

        [HttpDelete("{nome}")]
        public string Delete(string nome)
        {
            return $"Primeiro delete! oremos para que nao faça isso em prod ein {nome}";
        }


    }




}