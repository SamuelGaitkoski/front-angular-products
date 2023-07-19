// vamos começar a implementar a parte de chamar a nossa api, para isso criamos essa classe de serviço, para conectar a mesma com a nossa api.
// para criar a classe de serviço fizemos: ng g s services/product.
// ng (angular) g (generate) s (service) service/product (caminho/nomeDaClasse).
// apagamamos o products.service.spec.ts criado junto, pois não vamos fazer testes.
// primeiro vamos definir nossas url's da nossa api, para as requisições.
// url da api: localhost:7116 (porta 7116).
// precisamos importar nosso pacote para as chamadas http, que é o ClientHttp, vamos fazer isso no app.module.ts.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Product from '../models/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // url da nossa api
  productApiUrl = 'https://localhost:7116/products';

  // aqui para nosso construtor vamos fazer um private http, que vai ser do tipo HttpClient, que é uma classe, e que vem do modulo http client que importamos no app.module.ts, ai ele adiciona nosso import.
  constructor(private http: HttpClient) { }

  // agora só precisamos implementar os métodos que vão fazer as requisições para a api:
  // como está dentro do product service poderia ser só get, create, update e delete, mas não tem problema, pode ser getProducts, createProduct, etc.
  // podemos colocar o que a chamada de cada método vai retornar, que vai ser um Observable de array de produto no caso do getProducts, array de produtos pois é o que o retorno da requisição vai retornar.
  getProducts(): Observable<Product[]> {
    // para fazer as chamadas podemos this.http.get(), dizemos dai que vamos receber como retorno da chamada um array de produtos, dai passamos para o método get nossa url.
    // para a autenticação, teremos que passar o token no header, para que o usuário que se logou tenha acesso as ações ligadas aos produtos, então depois da url vamos passar o headers, passando o "Bearer token" para a chave Authorization. 
    // para pegar o token vamos buscá-lo do local storage, dessa forma conseguimos passar ele dentro do header.
    // faremos o mesmo no createProduct, updateProduct e deleteProduct.
    var token = localStorage.getItem('token');
    
    return this.http.get<Product[]>(this.productApiUrl, {headers: {['Authorization']: `Bearer ${token}`}});
  }

  createProduct(product: Product): Observable<Product> {
    // para nosso create passamos this.http.post(), vamos receber um Product como retorno da chamada do método, ai como parametro para o método passamos nossa url e o produto que vamos criar, então passamos ele para a nossa api.
    // como quando criamos um produto novo, o id fica vazio (''), ele não consegue converter isso para Guid, pois nosso id é um Guid, então, para não dar erro, não vamos passar o product para não passar o id vazio, vamos passar um objeto anonimo sem o id dai. Vamos fazer assim para não termos que alterar nada na nossa api.
    var token = localStorage.getItem('token');

    return this.http.post<Product>(this.productApiUrl, {
      name: product.name,
      price: product.price,
      category: product.category
    },
    {headers: {['Authorization']: `Bearer ${token}`}}
    );
  }

  updateProduct(product: Product): Observable<Product> {
    // aqui é a mesma coisa, mas em vez de post é put o método que vamos usar.
    var token = localStorage.getItem('token');

    return this.http.put<Product>(this.productApiUrl, product, {headers: {['Authorization']: `Bearer ${token}`}});
  }

  // como nossa api retorna um NoContent, nosso método não vai retornar nada, nem nossa requisição.
  deleteProduct(id: string) {
    // para o delete só mudamos o método, que vai ser delete e passamos o id para a api, em vez do product.
    // aqui, como ele passa o id na url para o delete, vamos ter que concatenar o id na url para ele fazer a requisição.
    var token = localStorage.getItem('token');

    return this.http.delete(`${this.productApiUrl}?id=${id}`, {headers: {['Authorization']: `Bearer ${token}`}});
  }

  // agora nosso serviço ja está criado, a parte do serviço é isso mesmo.
  // Agora precisamos injetar o serviço dentro da nossa classe ProductsComponent, do nosso arquivo products.component.ts, para chamar os métodos que vão chamar a api quando criarmos um novo registro, editarmos um registro ja existente ou deletarmos um registro. Então vamos injetar o serviço dentro daquele construtor.
}
