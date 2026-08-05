using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain.Identity;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace ProEventos.Application
{
    // Serviço responsável por criar um JWT para o usuário
    public class TokenService : ITokenService
    {
        // Permite acessar as configurações do appsettings.json
        private readonly IConfiguration _configuration;

        // Gerencia os usuários do Identity (buscar roles, criar usuários, etc.)
        private readonly UserManager<User> _userManager;

        // Converte objetos entre DTO e entidade
        private readonly IMapper _mapper;

        // Chave secreta usada para assinar o token
        private readonly SymmetricSecurityKey _key;

        public TokenService(
            IConfiguration configuration,
            UserManager<User> userManager,
            IMapper mapper
        )
        {
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;

            // Lê a chave secreta do appsettings.json
            // e transforma em uma chave criptográfica utilizada
            // para assinar o JWT.
            _key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["TokenKey"])
            );
        }

        // Método responsável por gerar o JWT
        public async Task<string> CreateToken(UserUpdateDto userUpdateDto)
        {
            // Converte o DTO recebido em um objeto User
            var user = _mapper.Map<User>(userUpdateDto);

            // Cria a lista de informações (Claims) que ficarão
            // armazenadas dentro do token.
            var claims = new List<Claim>
            {
                // Guarda o ID do usuário
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),

                // Guarda o nome do usuário
                new Claim(ClaimTypes.Name, user.UserName)
            };

            // Busca todas as Roles (permissões/cargos) do usuário
            var roles = await _userManager.GetRolesAsync(user);

            // Adiciona cada Role na lista de Claims
            claims.AddRange(
                roles.Select(role => new Claim(ClaimTypes.Role, role))
            );

            // Cria as credenciais de assinatura usando
            // a chave secreta e o algoritmo HmacSha512
            var creds = new SigningCredentials(
                _key,
                SecurityAlgorithms.HmacSha512Signature
            );

            // Define as informações do token
            var tokenDescription = new SecurityTokenDescriptor
            {
                // Informações do usuário que ficarão dentro do JWT
                Subject = new ClaimsIdentity(claims),

                // O token será válido por 1 dia
                Expires = DateTime.Now.AddDays(1),

                // Assinatura utilizada para validar que
                // o token não foi alterado
                SigningCredentials = creds
            };

            // Classe responsável por criar e manipular JWTs
            var tokenHandler = new JwtSecurityTokenHandler();

            // Cria o token com as configurações definidas acima
            var token = tokenHandler.CreateToken(tokenDescription);

            // Converte o token para uma string e retorna
            // Exemplo:
            // eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...
            return tokenHandler.WriteToken(token);
        }
    }
}