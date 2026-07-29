using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Domain.Models
{
    public class Lote
    {
        public int Id {get;set;}
        // [MaxLength(50)] = tamanho máximo do campo 
        public string Nome {get;set;}
        public decimal Preco { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Quantidade { get; set; }
        // [ForeignKey("EventosDetalhes")] = diz que é uma chave estrangeira
        public int EventoId {get;set;}
        public Evento Evento { get; set; }

        // [NotMapped] = diz que é um campo que não vai ser mapeado / inserido no banco de dados
        //public int contagemDias {get;set;}

    }
}