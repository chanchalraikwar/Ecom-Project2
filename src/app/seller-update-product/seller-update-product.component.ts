import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { FormsModule }   from '@angular/forms';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | product
  productMessage: undefined | string
  constructor(private route: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {
    let productid = this.route.snapshot.paramMap.get('id')
    console.warn(productid);
    productid && this.product.getproduct(productid).subscribe((data) => {
      console.warn(data)
      this.productData = data;
    })
  }
  submit(data: product) {
    console.warn(data);
    if(this.productData)
    {
      data.id=this.productData.id
      console.warn(data)
    }
    this.product.updateproduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = "Product has updated";
      }
    });

    setTimeout(() => (this.productMessage = undefined), 3000);
   
  }
}
