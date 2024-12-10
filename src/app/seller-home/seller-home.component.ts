import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { faTrash,faEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  icon=faTrash;
  editIcon=faEdit;
  removeCart = false;
  productQuantity: number = 1
  productMessage:undefined |string
  productData: undefined | product
  constructor(private product: ProductService) { }

  ngOnInit(): void {
  this.list();
  }
deleteProduct(id:number)
{
  console.warn(id);
  this.product.deleteProduct(id).subscribe((result)=>{
     if(result)
    {
      this.productMessage="This product is deleted";
      this.list();
    }
  })

setTimeout(() => (this.productMessage = undefined), 3000);
}

list()
{
  debugger
  this.product.productList().subscribe((result) => {
    console.warn(result);
    this.productList =result;
  })
}
addToCart() 
{
  if (this.productData) {
    this.productData.quantity = this.productQuantity;
    if (!localStorage.getItem('user')) {
      this.product.localAddToCart(this.productData);
      this.removeCart = true;
    }
    else {
      console.warn('user is logged in');
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;

      let cartData: cart = {
        ...this.productData,
        userId,
        productId: this.productData.id
      }
      delete cartData.id;
      this.product.addToCart(cartData).subscribe((result) => {
        if (result) {
          this.product.getCartList(userId);
          this.removeCart = true;
        }
      }
      );
    }

  }

}
}