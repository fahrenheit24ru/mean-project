import { Injectable, ElementRef } from '@angular/core';
import { MaterialInstance } from '../interfaces/material-instance';

declare var M;

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor() {}

  static toast(message: string) {
    M.toast({ html: message });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }
}
