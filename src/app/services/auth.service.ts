import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import LoginResponse from '../models/LoginResponse';
import User from '../models/User';

// Arquivo criado para fazermos a requisição para a nossa api referente a autenticação, para fazer o login nesse caso.
// Não criamos ainda a tela de cadastro, mas isso ficará como um exercício, que é mais um CRUD e mais uma tela, podemos criar um botão de cadastrar e abrir outro formulário para preencher o usuário, email e senha, e fazer o cadastro dai.
// Para fazer a requisição para nossa api, para fazer o login, criamos o auth.service.ts, em /services.
// vamos criar um modelo de LoginResponse e um modelo de User para recebermos eles na nossa requisição para a api, json que vamos receber da nossa api. Criamos os models em models.

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Rota para a nossa api.
  authApiUrl = 'https://localhost:7116';

  constructor(private http: HttpClient) { }

  // método que vai fazer a requisição para a api, passando o email e password para ele verificar se existe esse login e então fazer o login e a autenticação.
  // esse método vai retornar um LoginResponse, que vai ser o que será retornado pela requisição ao endpoint da api.
  login(email: string, password: string): Observable<LoginResponse> {
    // passamos para o método post nossa rota 'https://localhost:7116/auth/login', para cair no endpoint de login e um objeto com o email e password rpeenchido nos campos.
    // não precisamos passar email: email, password: password, pois ele ja entende que o nome da chave do objeto é email e o valor é email também, ja que são os mesmos nomes. Objeto é contituido por pares de chave/valor.
    // vamos fazer um pipe() também, pois precisamos guardar o token, que é um dos dados que receberemos no LoginResponse, para utilizarmos o token nas próximas requisições, dentro do pipe() vamos chamar o método tap(), vamos passar um objeto para o tap(), ai vamos fazer um next: p => setToken, passando o p.Token para a função, setToken é um método privado que vamos criar, que vai receber o nosso token.
    // quando ele receber o retorno da requisição e for resolver isso no subscribe, ele vai setar o token recebido da requisição.
    return this.http.post<LoginResponse>(`${this.authApiUrl}/auth/login`, { email, password })
    .pipe(
      tap({
        next: p => this.setToken(p.token)
      })
    );
  }

  // método para verificar se o usuário está logado.
  // podemos chamar esse método na tela de produtos, para que sempre que ele chamar direto a url /products, chamamos esse método no construtor da tela de produtos, para verificar se o usuário está logado. Caso não estiver mandamos o mesmo para a tela de login. Para caso o usuário tente acessar a tela de produtos direto pela url, sem estar logado.
  // criamos um método para verificar se o usuário está logado, então botamos o nome do método como isLoggedIn (está lgoado), como nos métodos do .NET para validar string, string.IsNullOrEmpty(), etc. O is na frente é um padrão de nomenclatura, retornando um booleano, programando em inglês no caso.
  isLoggedIn() {
    // para verificar se o usuário está logado vamos dar um getItem('token') no local storage, dai se tiver valor o item vai ser diferente de null, dai vai retornar true, indicando que o usuário está logado, caso contrário vai retornar false.
    return localStorage.getItem('token') != null;
  }

  // método para log out, desconectar do login.
  logout() {
    // quando for feito o log out, vamos remover o token do local storage, usando o método removeItem(), dai o usuário não ficará mais logado e autenticado.
    localStorage.removeItem('token');
  }

  // método privado que criamos, que vai receber o nosso token.
  private setToken(token: string) {
    // vamos pegar esse token e guardar no nosso localStorage, pelo método setItem.
    // vamos passar a chave, identificando que item é esse, e o valor, mandando o token dai.
    localStorage.setItem('token', token);
    // os cookies geralmente tem uma data de validade e são exluidos quando essa data é atingida, o local storage fica armazenado até que seja explicitamente excluído pelo usuário/site.
    // O LocalStorage é uma forma de salvar dados no computador do cliente. Ele permite que salvemos pares de chaves e valores no web browser sem uma data de expiração. Essa forma de armazenamento só pode ser acessada via JavaScript e HTML5, mas é importante saber que o usuário pode limpar os dados/cache do browser se quiser.
    // Nesse caso, nosso token irá expirar em 1 hora, então a partir desse momento o usuário terá que fazer login novamente para acessar os alterar os produtos novamente.
  }

  register(user: User) {
    debugger
    return this.http.post<User>(`${this.authApiUrl}/account`, user);
  }

  // Se irmos na aba Application após fazermos o login, podemos ver que temos o nosso token no Local Storage, token que adicionamos no Local Storage, com key (chave) token e Value, que é o token todo dai.
}
