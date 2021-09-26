import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ArenaComponent } from './arena/arena.component';
import { ShopComponent } from './shop/shop.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AdminComponent } from './admin/admin.component';

import { 
  AuthGuardService as AuthGuard 
} from './service/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
  { path: 'arena', component: ArenaComponent, canActivate: [AuthGuard]  },
  { path: 'shop', component: ShopComponent, canActivate: [AuthGuard]  },
  { path: 'marketplace', component: MarketplaceComponent, canActivate: [AuthGuard]  },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
