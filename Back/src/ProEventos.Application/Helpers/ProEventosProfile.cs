using AutoMapper;
using ProEventos.Domain.Models;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using System.Collections.Generic;
using ProEventos.Persistence.Models;

namespace ProEventos.API.Helpers
{
    public class ProEventosProfile : Profile
    {
        public ProEventosProfile()
        {
            // toda vez que um dado vier de um objeto Evento, contanto que os campos tenham o mesmo nome
            CreateMap<Evento, EventoDto>().ReverseMap(); // reverseMap habilita a conversão ao contrario
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();
        }
    }
}