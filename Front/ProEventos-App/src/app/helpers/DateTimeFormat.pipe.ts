import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '@app/util/constants';

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any): any {

    if (!value) {
      return null;
    }

    // Já é um Date
    if (value instanceof Date) {
      return super.transform(value, Constants.DATE_TIME_FMT);
    }

    // Veio como string "dd/MM/yyyy HH:mm:ss"
    if (typeof value === 'string') {
      const [data, hora] = value.split(' ');
      const [dia, mes, ano] = data.split('/');

      const date = new Date(`${ano}-${mes}-${dia}T${hora}`);

      return super.transform(date, Constants.DATE_TIME_FMT);
    }

    return super.transform(value, Constants.DATE_TIME_FMT);
  }
}
