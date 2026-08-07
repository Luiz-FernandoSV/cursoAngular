import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';
import { environment } from '@environments/environment';
import { PaginatedResult, Pagination } from '@app/models/Pagination';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss'],
})
export class EventoListaComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  public eventos: Evento[] = [];
  public widthImg = 150;
  public marginImg = 2;
  public eventoId: number = 0;
  public pagination = {} as Pagination;
  termoBuscaChanged: Subject<string> = new Subject();

  public filtrarEventos(event: any): void {
    if (this.termoBuscaChanged.observers.length == 0) {
      this.termoBuscaChanged
      .pipe(debounceTime(1000)) // cria um tempo de espera para fazer a requisição
      .subscribe((filtrarPor) => {
          this.spinner.show();
          this.eventoService
            .getEventos(
              this.pagination.currentPage,
              this.pagination.itemsPerPage,
              filtrarPor
            )
            .subscribe(
              (paginatedResult: PaginatedResult<Evento[]>) => {
                this.eventos = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
              },
              (error: any) => {
                this.spinner.hide();
                this.toastr.error('Erro ao carregar os eventos', 'Erro: ');
              },
            )
            .add(() => this.spinner.hide());
        });
    }
    this.termoBuscaChanged.next(event.value);
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {}

  public ngOnInit(): void {
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 3,
      totalItems: 1,
    } as Pagination;

    this.carregarEventos();
  }

  public carregarEventos(): any {
    this.spinner.show();
    this.eventoService
      .getEventos(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe(
        (paginatedResult: PaginatedResult<Evento[]>) => {
          this.eventos = paginatedResult.result;
          this.pagination = paginatedResult.pagination;
        },
        (error: any) => {
          this.spinner.hide();
          this.toastr.error('Erro ao carregar os eventos', 'Erro: ');
        },
        //   (eventosResp: Evento[]) => {
        //     this.eventos = eventosResp;
        //     this.eventosFiltrados = this.eventos;
        //   },
        //   (error) => console.log(error),
      )
      .add(() => this.spinner.hide());
  }
  public exibindoImagens: boolean = true;
  public mostrarImagens(): void {
    this.exibindoImagens = !this.exibindoImagens;
  }

  public retornaImagem(imageURL: string): string {
    return imageURL !== '' && imageURL !== null
      ? `${environment.apiURL}resources/images/${imageURL}`
      : 'assets/img/semImagem.jpg';
  }

  openModal(event: any, template: TemplateRef<void>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();
    this.eventoService
      .deleteEvento(this.eventoId)
      .subscribe(
        (result: any) => {
          if (result.message === 'Deletado') {
            this.toastr.success(
              'O Evento foi deletado com sucesso',
              'Deletado',
            );
            this.carregarEventos();
          }
        },
        (error: any) => {
          this.toastr.error(
            `Erro ao tentar deletar o evento ${this.eventoId}`,
            'Erro',
          );
        },
      )
      .add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef?.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }

  public pageChanged(event): void {
    this.pagination.currentPage = event.page;
    this.carregarEventos();
  }
}
