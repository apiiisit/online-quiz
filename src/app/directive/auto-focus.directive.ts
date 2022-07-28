import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective {

  constructor(private el: ElementRef) { }

  public ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    })
  }

}
