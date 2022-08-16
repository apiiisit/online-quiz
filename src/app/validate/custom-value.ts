import { AbstractControl } from "@angular/forms";

const REX_NAME = /^[A-Za-z0-9ก-๙_@]{6,}$/;

export function customValue(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!REX_NAME.test(value)) {
        return { trim: true };
    }
    return null;
}