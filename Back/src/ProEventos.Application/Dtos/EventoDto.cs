using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string Local { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        public string DataEvento { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório"), StringLength(50,MinimumLength =3, ErrorMessage ="O Tema deve ter entre 3 e 50 caracteres")]
        public string Tema { get; set; }
        [
            Required(ErrorMessage = "O campo {0} é obrigatório"),
            Range(1,120000,ErrorMessage = "{0} não pode ser menor que 1 e maior que 120.000"),
            Display(Name = "Qtd Pessoas")
        ]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",ErrorMessage = "Não é uma imagem válida. (gif,jpg,jpeg,bmp ou png)")]
        public string ImagemURL { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório"),Phone(ErrorMessage = "O campo {0} está com número inválido")]
        public string Telefone { get; set; } 
        [Display(Name = "e-mail")] // altera o nome do campo exibido
        [
            Required(ErrorMessage = "O campo {0} é obrigatório"),
            EmailAddress(ErrorMessage =("Deve ser um endereço de {0} válido")),
        ]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}