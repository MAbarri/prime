import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {FormsModule} from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { RequestInterceptor } from './service/request.interceptor';
import { ArenaComponent } from './arena/arena.component';
import { ShopComponent } from './shop/shop.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { TokenDecimalsPipe } from './pipes/token-decimals.pipe';
import { InventoryComponent } from './inventory/inventory.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';


import { 
  AuthGuardService as AuthGuard 
} from './service/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    ArenaComponent,
    ShopComponent,
    MarketplaceComponent,
    TokenDecimalsPipe,
    InventoryComponent,
    AdminComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true,
  }, AuthGuard,
  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
