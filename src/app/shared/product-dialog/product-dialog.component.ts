import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Product from 'src/app/models/Product';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {
  // vamos criar um booleano aqui, isChange
  isChange!: boolean;

  // temos que injetar o MAT_DIALOG_DATA, e criar o data, que é o que utilizamos no product-dialog.component.html, para o dialog e os campos dentro dele. 
  // também colocamos no construtor o nome da nossa classe, que é ProductDialogComponent.
  // dai vamos dando ctrl + . para ele fazer os imports do que precisamos.
  // no data colocamos o tipo de dado que é o data, que é Product nesse caso.
  // para definirmos que o data da nossa tela Dialog é Product, então teremos data.name, data.price e data.category para seus respectivos campos.
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
  ) { }

  ngOnInit(): void {
    // se o id do item for diferente de vazio(''), é um produto que ja existe, pois ja tem id, então setamos o isChange true, caso contrário não é uma edição, então isChange false.
    if (this.data.id != '') {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onCancel() {
    // fechando a modal/dialog quando clicarmos em cancelar
    this.dialogRef.close();
  }
}
