import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { Lote } from '@app/models/Lote';
import { EventoService } from '@app/services/evento.service';
import { LoteService } from '@app/services/lote.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  eventoId : number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar: string = 'post'; // inicia com o modo de post
  modalRef : BsModalRef;
  loteAtual = {id:0,nome:'',indice:0};

  get modoEditar() : boolean{
    return this.estadoSalvar === 'put';
  }

  get f(): any {
    return this.form.controls;
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private loteService : LoteService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router : Router,
    private modalService : BsModalService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    // função de validação dos campos
    this.validation();
    // função pra puxar os dados do evento
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.fb.group({
      // 1º parametro = valor base (formState / estado inicial)
      // 2º parametro = validator
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      preco: [lote.preco, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public retornaTituloLote(nome: string) : string{
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  public cssValidator(campo: FormControl | AbstractControl): any {
    return { 'is-invalid': campo.errors && campo.touched };
  }

  public carregarEvento(): void {
    // variavel para guardar o ID do evento que vem na URL
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');
    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();
      this.estadoSalvar = 'put'; // seta o modo do form para o de put
      // chama a função do service para buscar o evento, faz um casting do ID(string) para Number
      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento }; // copia os dados do evento retornado para o evento do componente (eventoRetorno -> this.evento)
          this.form.patchValue(this.evento); // copia os dados do evento retornado para os campos do form
          this.carregarLotes(); // método que faz uma requisição ao banco para buscar os lotes do evento
          /*
          Forma reduzida da função acima

          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          })
            */
        },
        (error: any) => {
          (console.log(error),
            this.spinner.hide(),
            this.toastr.error('Erro ao tentar carregar o evento', 'Erro!'));
        },
        () => this.spinner.hide(),
      );
    }
  }

  public carregarLotes() : void{
    this.loteService.getLotesByEventoId(this.eventoId).subscribe(
      (lotesRetorno : Lote[]) => {
        lotesRetorno.forEach(lote => {
          this.lotes.push(this.criarLote(lote));
        })
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao carregar os lotes do evento','Erro!');
      }
    ).add(() => {this.spinner.hide()})
  }

  public salvarEvento(): void {
    this.spinner.show();

    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
      } else {
        this.evento = { id: this.evento.id, ...this.form.value };
      }
      this.eventoService[this.estadoSalvar](this.evento)
        .subscribe(
          (eventoRetorno : Evento) => {
            this.toastr.success('Evento salvo com sucesso', 'Sucesso')
            // redireciona paga a mesma página levando o id do evento recem criado
            this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
          },
          (error: any) => {
            this.toastr.error('Erro ao salvar evento', 'Erro');
          },
          () => this.spinner.hide(),
        )
        .add(() => this.spinner.hide());
    }
  }

  public salvarLotes() : void{
    if(this.form.controls.lotes.valid){
      this.spinner.show();
      this.loteService.saveLote(this.evento.id,this.form.value.lotes).subscribe(
        () => {
          this.toastr.success('Lotes salvos com sucesso','Sucesso');
          this.lotes.reset();
        },
        (error : any) => {
          console.log(error);
          this.toastr.success('Erro ao tentar salvar os lotes','Erro');
        }
      ).add(() => this.spinner.hide());
      this.spinner.hide();
    }
  }

  public removerLote(indice : number,template : TemplateRef<any>) : void{

    this.loteAtual.id = this.lotes.get(indice + '.id').value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, {class:'modal-sm'});
    this.lotes.removeAt(indice);


  }

  confirmDeleteLote() : void{
    this.modalRef.hide();
    this.spinner.show();
    this.loteService.deleteLote(this.loteAtual.id,this.eventoId).subscribe(
      () => {
        this.toastr.success('Lote deletado com sucesso','Sucesso');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error : any ) => {
        console.log(error);
        this.toastr.error(`Erro ao deletar o lote ${this.loteAtual.id}`,'Erro');
      }
    ).add(() => this.spinner.hide())
  }

  declineDeleteLote() : void {
    this.modalRef.hide();
  }
}
