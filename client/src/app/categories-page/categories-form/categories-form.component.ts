import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
// Customs
import { CategoriesService } from '../../shared/services/categories.service';
import { MaterialService } from '../../shared/services/material.service';
import { Category } from '../../shared/interfaces/category';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup;
  @ViewChild('input') inputRef: ElementRef;
  image: File;
  imagePreview = '';
  isNew = true;
  category: Category;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    this.form.disable();
    this._route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this._categoriesService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({ name: category.name });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message)
      );
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      // create
      obs$ = this._categoriesService.create(this.form.value.name, this.image);
    } else {
      // update
      obs$ = this._categoriesService.update(
        this.category._id,
        this.form.value.name,
        this.image
      );
    }
    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Saved changes');
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
      () => {
        this._router.navigate(['/categories']);
      }
    );
  }

  triggetClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(
      `Are you sure, what you want to delete "${this.category.name}" category?`
    );
    if (decision) {
      this._categoriesService
        .delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this._router.navigate(['/categories'])
        );
    }
  }
}
