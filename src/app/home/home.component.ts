import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { BrowserModule } from '@angular/platform-browser'
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {
  popularProducts :undefined|product[]
  trendyProducts :undefined|product[]
  productData: undefined | product
  productQuantity: number = 1
  removeCart = false;
  cartData: product | undefined
  activeRoute: any;

  constructor(private product:ProductService) {}

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data)=>{
        this.popularProducts=data;
    })
    
    this.product.trendyproduct().subscribe((data)=>
      {
        this.trendyProducts =data
      });    
   } 

   addToCartHome(Id:string )
    {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id
     
    this.product.getproduct(Id).subscribe((result) => {
    this.productData = result;    
    this.product.localAddToCart(this.productData);
    this.product.getCartList(userId);
    let cartData: cart = {
      ...this.productData,
      userId,
      productId: this.productData.id
    }
    this.product.addToCart(cartData).subscribe((result) => {
      if (result) {
        this.product.getCartList(userId);
        this.removeCart = true;
      }
    }
    );    
    })

     
     

     

  }

   
}
