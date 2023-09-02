import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  private frmBuilder = inject( FormBuilder );

  private authServ: AuthService = inject( AuthService );
   
  public loginFrm: FormGroup = this.frmBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    const { email, password } = this.loginFrm.value;
    this.authServ.login( email, password ).subscribe( data => {
      console.log(data);
    });
  }
}
