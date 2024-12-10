import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product
  productQuantity: number = 1
  removeCart = false;
  cartData: product | undefined
  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {

    let productid = this.activeRoute.snapshot.paramMap.get('productId');

    productid && this.product.getproduct(productid).subscribe((result) => {

      this.productData = result;
      let cardData = localStorage.getItem('localCart');
      if (productid && cardData) {
        let items = JSON.parse(cardData);
        items = items.filter((item: product) => productid !== item.id.toString());
        if (items.length) {
          this.removeCart = true;
        }
        else {
          this.removeCart = false;
        }
      }
      let user = localStorage.getItem('user');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.product.getCartList(userId);
        this.product.cartData.subscribe((result) => {
          let items = result.filter((item: product) => productid?.toString() === item.productId?.toString());
          if (items.length) {
            this.cartData = items[0];
            this.removeCart = true;
          }
        })
      }

    })
  }
  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }

  }
  addToCart() {
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
  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);

    } else {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      this.cartData && this.product.RemoveToCart(this.cartData.id)
        .subscribe((result) => {
          this.product.getCartList(userId);
        })
    }
    this.removeCart = false;

  }

}
