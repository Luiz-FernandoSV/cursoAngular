using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.API.Models
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int totalItems, int totalPages,int itemsPerPage)
        {
            this.CurrentPage = currentPage;
            this.TotalItems = totalItems;
            this.TotalPages = totalPages;
            this.ItemsPerPage = itemsPerPage;

        }
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}