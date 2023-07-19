import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// vamos importar aqui os componentes que vamos utilizar da biblioteca Angular Material, indo nos components da biblioteca, em API e copiando o import do componente para colocar aqui. Dai colocamos o nome do componente nos imports la em baixo.
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
// componente pelo qual vamos fazer as chamadas http
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Angular Material importou algumas coisas para ca.
import { ProductsComponent } from './views/products/products.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ProductDialogComponent } from './shared/product-dialog/product-dialog.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductDialogComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule
  ],
  entryComponents: [AppComponent, ProductsComponent, ProductDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
