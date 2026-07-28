import { AbstractControl, FormGroup } from "@angular/forms";

export class ValidatorField {
  static mustMatch(controlName : string, matchControlName: string) : any {
    return (group: AbstractControl) => {
      const formGroup = group as FormGroup;
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchControlName];

      if(matchingControl.errors && !matchingControl.errors.mustMatch){
        return null;
      }

      if(control.value !== matchingControl.value){
        // cria um campo novo de erro para avisar que os valores devem ser iguais
        matchingControl.setErrors({
          mustMatch:true
        });
      }else {
        matchingControl.setErrors(null);
      }

      return null;
    }
  }}
