import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[formControlName][appCurrencyMask]"
})
export class CurrencyMaskDirective {
  constructor(public ngControl: NgControl) {}

  @HostListener("ngModelChange", ["$event"])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener("keydown.backspace", ["$event"])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, "");
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }

    if (newVal.length === 0) {
      newVal = "";
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, "$1");
    } else if (4 <= newVal.length || newVal.length <= 5) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,3})/, "$1,$2");
    } else if (newVal.length == 6) {
        newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, "$1,$2");
    }else if (7 <= newVal.length ||newVal.length <= 8) {
      newVal = newVal.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})/, "$1,$2,$3");
    } else if (newVal.length == 9) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,3})/, "$1,$2,$3");
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,3})/,
        "$1,$2,$3,$4"
      );
    }

    this.ngControl.valueAccessor.writeValue("" + newVal);
    console.log(this.toNumber(newVal));
  }

  toNumber(val) {
    let valArr = val.split("");
    let valFiltered = valArr.filter(x => !isNaN(x));
    let valProcessed = valFiltered.join("");
    return valProcessed;
  }
}
