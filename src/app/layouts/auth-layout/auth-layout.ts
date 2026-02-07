import { Component } from '@angular/core'
import { RouterOutlet, RouterLink } from '@angular/router'

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-base-100">
      <div class="w-full max-w-md p-6">
        <div class="text-center mb-8">
          <a routerLink="/" class="text-3xl font-heading font-bold">
            <span class="asd-letter">ASD</span> Angular
          </a>
        </div>
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayout {}
