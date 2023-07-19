import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

// aqui dentro do @Component, vamos declarar o nosso provedor, em providers, que é o nosso AuthService.
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
// como é uma classe, temos as propriedades, por isso não botamos var, let, const, mas sim, public, etc, ou nada mesmo, pois estamos criando uma propriedade, só dizemos o nome delas e tipamos as mesmas.
export class LoginComponent implements OnInit {
  // aqui vamos criar as propriedade email e password, dai ele não fica dando erro por estarmos usando as propriedades, que antes não existiam, no login.componente.html
  email!: string;
  password!: string;
  // vamos colocar aqui uma mensagem, criando aqui uma propriedade message, para quando ele não autenticar mostrarmos uma mensagem para o usuário, informando que o email ou senha está inválido.
  message!: string;

  // aqui dentro do nosso construtor passamos nosso authService, do tipo AuthService.
  // também vamos utilizar a parte de rotas, o roteamento, para redirecionar da pagina de login para a pagina de produtos quando o usuário fizer login, para isso vamos adicionar um router, do tipo Router (Classe) aqui no construtor também.
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // método para fazer login, recebendo por parametro o valor dos campos email e password
  login(email: string, password: string) {
    // aqui vamos chamar o nosso authService, para fazer o login, para ele fazer a requisição para a api, para fazer login.
    // vamos criar também no pipe a validação de erro, para que quando retornar 401 nós setamos em message e mensagem de erro "Email ou senha inválida!", para ele exibir na tela. No pipe chamamos o método catchError, do rxjs/operators. Dai para o catchError passamos um error, que vai ser do tipo HttpErrorResponse, então validamos se tem algum erro com status 401, se houver seta a mensagem para a propriedade message, retornando dai a chamada da função throwError, passando uma função com o erro, para retornar o erro.
    // só precisamos fazer um subscribe, passando uma função, que vai executar o this.router.navigate para a rota /products, para ele encaminhar para tela de produtos, com rota /products.
    this.authService.login(email, password)
    .pipe(catchError((error: HttpErrorResponse) => {
      if (error.status == 401) {
        this.message = 'Invalid email or password!';

        return throwError(() => error);
      }
    }))
    .subscribe(() => this.router.navigate((['/products'])));
  }

  openRegisterView() {
    this.router.navigate(['/register']);
  }
}
