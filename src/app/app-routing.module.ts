import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArenaComponent } from './arena/arena.component';
import { ShopComponent } from './shop/shop.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'arena', component: ArenaComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'inventory', component: InventoryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
