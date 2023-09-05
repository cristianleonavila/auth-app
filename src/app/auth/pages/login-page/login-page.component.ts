import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private frmBuilder = inject( FormBuilder );

  private router = inject(Router);

  private authServ: AuthService = inject( AuthService );

  public loginFrm: FormGroup = this.frmBuilder.group({
    email: ['cristian.leon.avila@gmail.com', [Validators.required, Validators.email]],
    password: ['Ryzen*2023', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { email, password } = this.loginFrm.value;
    this.authServ.login( email, password )
    .subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: err,
          icon: 'error'})
      }
    });
  }
}
