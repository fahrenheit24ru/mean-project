import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// Customs
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/services/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    this._route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Now you can be logged in');
      } else if (params['accessDenied']) {
        MaterialService.toast('Must be authorized');
      } else if (params['sessionExpired']) {
        MaterialService.toast('Re-authorize please');
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.aSub = this._auth.login(this.form.value).subscribe(
      () => {
        MaterialService.toast(`You authorized as ${this.form.value.email}`);
        this._router.navigate(['/overview']);
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
