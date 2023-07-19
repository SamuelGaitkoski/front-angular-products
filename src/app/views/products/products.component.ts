import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import Product from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductDialogComponent } from 'src/app/shared/product-dialog/product-dialog.component';

// precisamos colocar um providers aqui dentro do component, passando qual é o nosso provider, que é o nosso productService.
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductService, AuthService]
})
export class ProductsComponent implements OnInit {
  // table é do tipo MatTable, e passamos que ele é any.
  // agora no nosso products.component.html precisamos dizer que aquela tabela que temos la é esse table que estamos usando aqui, para isso precisamos colocar um # e passar o identificador dessa tabela (#table).
  @ViewChild(MatTable) table!: MatTable<any>;

  // para nosso dataSource, fonte de onde os dados vão vir para a tabela, vamos criar um array de produtos, que é do tipo array de produtos também.
  products: Product[] = [];
  // definição do displayedColumns, que são as colunas que vamos exibir.
  displayedColumns: string[] = ['name', 'price', 'category', 'actions'];

  // dentro do construtor precisamos passar o dialog, que pegamos da documentação também.
  // ctrl + . para importar o que precisamos.
  // para injetarmos o serviço aqui dentro do construtor do ProductsComponent, para chamarmos aqui os métodos que fazem a chamada para a nossa api, no construtor vamos criar um productService, que é do tipo ProductService. E no construtor, quando for chamar nossa api, de inicio podemos chamar o método get para ele listar todos os produtos da nossa tabela, então dentro do construtor damos um this.productService.getProducts().subscribe(data => this.products = data), .subscribe porque os dados vão retornar como um observable de array de produtos, e o nosso products vai receber o data, o que retornar do método, que é um array de produtos. Em vez de data dentro do subscribe poderia ter um p, a, qualquer letra ou palavra. Data é o nosso retorno, um array de produtos. 
  // Iamos fazer o getProducts do inicio no método ngOnInit, mas podemos fazer isso no construtor também, então não teremos problemas.
  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
    ) {
      // aqui, inicialmente, antes dele chamar nosso getProduts, vamos verificar se o usuário não está logado, chamando o método IsLoggedIn(), se o usuário não estiver logado vamos redirecionar o mesmo para a tela de login, pelo router.navigate, passando para o navigate a rota /login.
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      } 

      this.productService.getProducts().subscribe(data => {
        console.log(data);
        this.products = data;
      });
     }

  ngOnInit(): void {
  }

  // método para abrir o modal Dialog.
  // podemos passar para o openDialog um produto, no caso de uma edição de registro, ou null caso for um produto novo.
  openDialog(product: Product | null) {
    // pegamos o código da documentação do componente Dialog para abrir a modal.
    // colocamos após o open o nome da classe do nosso componente Dialog que queremos abrir
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      // aqui no data é o que vamos passar para os campos, que vai ser o produt, que é o nosso data, como definimos no Dialog.
      // se product for diferente de null passamos o product, caso contrário passamos no nosso data um objeto com as propriedades vazias, passando id também porque se não passarmos nada vai dar erro no nosso Dialog.
      data: product != null ? product : {
        id: '',
        name: '',
        price: 0,
        category: 0
      },
    });

    // o aferClosed chamado no dialog é quando damos o cadastrar/ok e é a parte de sucesso, que é quando chamaremos o método do back para cadastrar no banco o produto.
    dialogRef.afterClosed().subscribe(result => {
      // result retorna um objeto com os valores do produto novo ou editado, se cancelarmos a criação ou edição do produto, ele retorna undefined.
      // então, se result for diferente de undefined, vamos verificar se é um produto novo que está sendo inserido ou um produto ja existente que está sendo editado.
      if (result !== undefined) {
        // como o openDialog é chamado tanto para criação de um novo produto quanto para a edição, vamos verificar quando é um novo produto ou a edição de um, vamos pegar a lista de produtos e fazer um map, para verificar se tem um produto com id igual ao id do produto que foi editado, se tiver é uma edição (produto ja esta na lista), então vamos chamar o updateProdut para fazer a requsição, caso contrário vamos chamar o método que faz a requisição para a api para criar um novo produto.
        if (this.products.map(p => p.id).includes(result.id)) {
          // vamos fazer um subscribe dai, 
          this.productService.updateProduct(result).subscribe(data => {
            // fazendo um console.log para o que retornou da requisição para a api.
            console.log(data);
            // agora, queremos atualizar nossa tabela com o produto editado. Para não fazer um getProducts novamente, vamos buscar na lista de produtos um produto com indice igual ao do produto alterado, pois o data retorna o produto alterado (retorno da requisição) 
            const index = this.products.findIndex(p => p.id === data.id);
            // vamos atualizar o produto da lista de productos que foi editado aqui, indo no produto pelo indice e trocando ele.
            this.products[index] = data;
            // vamos chamar um renderRows() na tabela, mas para identificarmos essa tabela, temos que passar um id na tabela e trazer ele para ca para enxergarmos ele aqui no nosso products.component.ts, para isso vamos criar aqui um ViewChild, passando o tipo do componente "MatTable", dai chamamos ele de table.
            this.table.renderRows();
          });
        } else {
          // aqui faz o mesmo com o subscribe, para atualizar a tabela de produtos, mas chama o createProduct();
          // faz um this.products.push(), adicionando o novo registro cadastrado.
          this.productService.createProduct(result).subscribe(data => {
            debugger;
            console.log(data);
            this.products.push(data);
            this.table.renderRows();
          })
        }
      }
    });
  }

  // métodos que vamos chamar para editar um produto ja existente e deletar um produto.
  updateProduct(product: Product) {
    // vamos fazer o mesmo que fizemos no openDialog, para adicionar um produto novo, então, para não repetir o codigo de la para ca, vamos só chamar o openDialog, passando o produto da linha da tabela. Ai quando clicarmos no editar ele vai pegar o produto e passar para preencher os campos da modal.
    this.openDialog(product);
  }

  deleteProduct(id: string) {
    // para o delete também temos que fazer o subscribe, se não ele não vai executar.
    // não receberemos nenhum retorno da requisição para o delete da api, então podemos fazer uma arrow function anonima e sem parametros. 
    this.productService.deleteProduct(id).subscribe(() => {
      // agora vamos atualizar a nossa tabela, então vamos fazer com que nossos produtos recebam os produtos com id diferente do id do produto deletado, assim ele traz todos os produtos que não são aquele deletado e tira ele da lista de produtos.
      this.products = this.products.filter(p => p.id != id);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
