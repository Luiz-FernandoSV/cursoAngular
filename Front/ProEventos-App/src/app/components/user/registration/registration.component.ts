import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { User } from '@app/models/Identity/User';
import { AccountService } from '@app/services/Account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  user = {} as User;
  form! : FormGroup;
  constructor(private fb : FormBuilder, private accountService : AccountService, private router : Router, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.validation();
  }

  get f() : any{
    return this.form.controls;
  }

  private validation() : void {
    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.mustMatch('password','confirmePassword')
    }

    this.form = this.fb.group({
      primeiroNome: ['',Validators.required],
      ultimoNome: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      username: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4)]],
      confirmePassword: ['',Validators.required],
    },formOptions)
  }

  public register () : void{
    this.user = {... this.form.value};
    this.accountService.register(this.user).subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
      },
      (error : any) => {
        this.toastr.error('Campos inválidos ou vazios encontrados','Erro');
        console.log(error);
      },
    );
  }
}
