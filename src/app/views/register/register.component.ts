import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import User from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService]
})
export class RegisterComponent implements OnInit {
  debugger;
  user: User = {
    id: '',
    name: '',
    email: '',
    password: ''
  };
  confirmPassword: string;
  errorMessage: string;
  successMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  register(user: User, confirmPassword: string) {
    if (user.name == undefined || user.email == undefined || user.password == undefined) {
      this.errorMessage = "All the fields need to be filled in!";
      return;
    } 
    else if (!(user.password == confirmPassword)) {
      this.errorMessage = "The passwords are not the same!";
      return;
    } 
    else {
      debugger
      this.authService.register(this.user)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status == 400) {
          this.errorMessage = 'There is already a user with that name or email registered!';
  
          return throwError(() => error);
        }
      }))
      .subscribe(() => {
        debugger
        this.successMessage = "Account created successfully!";
        setTimeout(() => {
          this.router.navigate((['/products']));
        }, 3000);
      });
    }
  }

  openLoginView() {
    this.router.navigate(['/login']);
  }
}
