import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss'],
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar: string = 'post'; // inicia com o modo de post
  get f(): any {
    return this.form.controls;
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
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
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
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public cssValidator(campo: FormControl): any {
    return { 'is-invalid': campo.errors && campo.touched };
  }

  public carregarEvento(): void {
    // variavel para guardar o ID do evento que vem na URL
    const eventoIdParam = this.router.snapshot.paramMap.get('id');
    console.log('ID da rota:', eventoIdParam);
    if (eventoIdParam !== null) {
      this.spinner.show();
      this.estadoSalvar = 'put'; // seta o modo do form para o de put
      // chama a função do service para buscar o evento, faz um casting do ID(string) para Number
      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          console.log(evento);
          this.evento = { ...evento }; // copia os dados do evento retornado para o evento do componente (eventoRetorno -> this.evento)
          this.form.patchValue(this.evento); // copia os dados do evento retornado para os campos do form
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

  public salvarAlteracao(): void {
    this.spinner.show();

    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
      }else{
        this.evento = {id: this.evento.id, ...this.form.value};
      }
        this.eventoService[this.estadoSalvar](this.evento).subscribe(
          () => this.toastr.success('Evento salvo com sucesso', 'Sucesso'),
          (error: any) => {
            this.toastr.error('Erro ao salvar evento', 'Erro');
          },
          () => this.spinner.hide()
        ).add(() => this.spinner.hide());
    }
  }
}
