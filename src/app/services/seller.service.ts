import { EventEmitter, Injectable } from '@angular/core';
import { login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, observable } from 'rxjs';
import { Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false)
  isLoginError= new EventEmitter<boolean>(false)
  constructor(private http: HttpClient, private router: Router) { }
 
 
 
  userSignUp(data: signUp) {

    let result = this.http.post('http://localhost:3000/seller',
      data, { observe: 'response' }).subscribe((result) => {
        this.isSellerLoggedIn.next(true),
          localStorage.setItem('seller', JSON.stringify(result.body))
        this.router.navigate(['seller-home'])
        console.warn(result);
      })

  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true)
      this.router.navigate(['seller-home'])
    }
  }

  userLogin(data: login) {

    console.warn(data);
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`
      , { observe: 'response' }).subscribe((result: any) => {
        console.warn(result)

        if (result && result.body && result.body.length) {
          console.warn("User Logged In")
          localStorage.setItem('seller', JSON.stringify(result.body))
          this.router.navigate(['seller-home'])

        }
        else {
          this.isLoginError.emit(true);
          console.warn('Login Failed')
        }
      });


  }
}
