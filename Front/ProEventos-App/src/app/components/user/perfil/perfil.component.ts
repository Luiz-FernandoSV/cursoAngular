import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/Identity/User';
import { UserUpdate } from '@app/models/Identity/UserUpdate';
import { AccountService } from '@app/services/Account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  userUpdate = {} as UserUpdate;
  form!: FormGroup;

  get f(): any {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    public accountService : AccountService,
    private router : Router,
    private toastr : ToastrService,
    private spinner : NgxSpinnerService
  ) {}

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  private carregarUsuario() : void{
    this.spinner.show();
    this.accountService.getUser().subscribe(
      (userRetorno : UserUpdate) => {
        this.userUpdate = userRetorno;
        this.form.patchValue(this.userUpdate);
        this.toastr.success('Usuario carregado com sucesso','Sucesso');
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao buscar usuario','Erro');
        this.router.navigateByUrl('/dashboard');
      },
    ).add(() => {this.spinner.hide()});
  }

  private validation() {
    const formOptions : AbstractControlOptions = {
      validators: ValidatorField.mustMatch('password','confirmePassword')
    };

    this.form = this.fb.group({
      userName: [''],
      titulo: ['NaoInformado',Validators.required],
      primeiroNome: ['', Validators.required],
      ultimoNome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['',Validators.required],
      funcao: ['NaoInformado',Validators.required],
      descricao: ['',Validators.required],
      password: ['',[Validators.nullValidator,Validators.minLength(4)]],
      confirmePassword: ['',[Validators.nullValidator]],
    },formOptions);
  }

  public resetForm(event: any) : void{
    event.preventDefault();
    this.form.reset();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario() {
    this.userUpdate = {... this.form.value};
    this.spinner.show();

    this.accountService.updateUser(this.userUpdate).subscribe(
      () => {
        this.toastr.success('Usuario atualizado com sucesso','Sucesso');
      },
      (error: any) => {
        console.log(error);
        this.toastr.error('Erro ao atualizar usuario','Erro');
      }
    ).add(() => this.spinner.hide());
  }

}
