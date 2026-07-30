import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { Constants } from "@app/util/constants";

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any): any {

    if (!value) return null;

    const [data, hora] = value.split(' ');
    const [dia, mes, ano] = data.split('/');

    const date = new Date(`${ano}-${mes}-${dia}T${hora}`);

    return super.transform(date, Constants.DATE_TIME_FMT);
  }

}

