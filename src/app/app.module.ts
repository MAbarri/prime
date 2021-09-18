import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {FormsModule} from "@angular/forms";
import { ArenaComponent } from './arena/arena.component';
import { ShopComponent } from './shop/shop.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { TokenDecimalsPipe } from './pipes/token-decimals.pipe';
import { InventoryComponent } from './inventory/inventory.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    ArenaComponent,
    ShopComponent,
    MarketplaceComponent,
    TokenDecimalsPipe,
    InventoryComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
