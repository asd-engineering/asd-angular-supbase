import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="hero min-h-[calc(100vh-8rem)]">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl font-bold font-heading">
            <span class="asd-letter">ASD</span> Angular Boilerplate
          </h1>
          <p class="py-6 text-lg text-muted">
            Production-grade Angular + Supabase starter with SSR, Tailwind CSS 4, DaisyUI 5, and
            full ASD platform integration.
          </p>
          <div class="flex gap-4 justify-center">
            <a routerLink="/auth/login" class="btn btn-primary">Get Started</a>
            <a routerLink="/dashboard" class="btn btn-outline">Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Home {}
