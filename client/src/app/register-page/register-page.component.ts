import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Customs
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;
  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this._auth.register(this.form.value).subscribe(
      () => {
        this._router.navigate(['/login'], {
          queryParams: { registered: true }
        });
      },
      error => {
        MaterialService.toast(`Registration error + ${error.error.message}`);
        this.form.enable();
      }
    );
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}
