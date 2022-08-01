import { AbstractControl } from "@angular/forms";

const REX_NAME = /^([a-zA-Zก-ฮ0-9_@])+/;


export function customValue(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!REX_NAME.test(value)) {
        return { trim: true };
    }
    return null; // no error
}