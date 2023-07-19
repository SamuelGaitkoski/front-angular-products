import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './views/products/products.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

// criamos a nova rota products, passamos o nome do componente ProductsComponent, agora podemos abrir nosso componente
// products na rota: localhost:4200/products, vai exibir o que tiver no products.component.html.
// na rota raiz (path vazio ('')) ou rota /login, vai cair agora na pagina de login
const routes: Routes = [
  {
    path: '', component: LoginComponent
  }, 
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },  
  {
    path: 'products', component: ProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
