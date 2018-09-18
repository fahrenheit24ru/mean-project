import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Customs
import { PositionsService } from '../../../shared/services/positions.service';
import { Position } from '../../../shared/interfaces/position';
import { MaterialService } from '../../../shared/services/material.service';
import { MaterialInstance } from '../../../shared/interfaces/material-instance';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss']
})
export class PositionsFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  form: FormGroup;
  loading = true;
  positions: Position[] = [];
  positionId = null;
  modal: MaterialInstance;

  constructor(private _positionService: PositionsService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });
    this.loading = true;
    this._positionService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({ name: position.name, cost: position.cost });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
  }

  onDeletePosition(position: Position) {}

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this._positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Position was updated');
        },
        error => MaterialService.toast(error.error.message),
        () => {
          completed();
        }
      );
    } else {
      this._positionService.create(newPosition).subscribe(
        position => {
          this.positions.push(position);
          MaterialService.toast('Position was created');
        },
        error => MaterialService.toast(error.error.message),
        () => {
          completed();
        }
      );
    }
  }
}
