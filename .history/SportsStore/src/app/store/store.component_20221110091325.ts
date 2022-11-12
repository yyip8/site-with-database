import { Component } from "@angular/core";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
@Component({
    selector: "store",
    templateUrl: "store.component.html"
})
export class StoreComponent {
  public selectedCategory = "";
  public productsPerPage = 4;
  public selectedPage = 1;
    constructor(private repository: ProductRepository) { }
    get products(): Product[] {
      let pageIndex = (this.selectedPage - 1) * this.productsPerPage
        return this.repository.getProducts(this.selectedCategory)
            .slice(pageIndex, pageIndex + this.productsPerPage);
    }
     //return this.repository.getProducts(this.selectedCategory);
    //}
    get categories(): string[] {
        return this.repository.getCategories();
    }
    changeCategory(newCategory: string="") {
      this.selectedCategory = newCategory;
  }
}
