import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tokenDecimals'
})
export class TokenDecimalsPipe implements PipeTransform {

  transform(value: number): any {
    return (value / 10**18).toFixed(4);
  }

}
