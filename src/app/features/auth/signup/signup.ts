import { Component, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <h2 class="card-title justify-center font-heading">Create Account</h2>
    <form (ngSubmit)="onSubmit()" class="space-y-4 mt-4">
      <div class="form-control">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          class="input input-bordered w-full"
          [(ngModel)]="email"
          name="email"
          required
          autocomplete="email"
        />
      </div>
      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <input
          id="password"
          type="password"
          class="input input-bordered w-full"
          [(ngModel)]="password"
          name="password"
          required
          minlength="8"
          autocomplete="new-password"
        />
      </div>
      @if (errorMessage()) {
        <div class="alert alert-error text-sm">{{ errorMessage() }}</div>
      }
      @if (successMessage()) {
        <div class="alert alert-success text-sm">{{ successMessage() }}</div>
      }
      <button type="submit" class="btn btn-primary w-full" [disabled]="loading()">
        @if (loading()) {
          <span class="loading loading-spinner loading-sm"></span>
        }
        Sign Up
      </button>
    </form>
    <p class="text-center text-sm mt-4 text-muted">
      Already have an account?
      <a routerLink="/auth/login" class="link link-primary">Sign In</a>
    </p>
  `,
})
export class Signup {
  private readonly auth = inject(AuthService)

  email = ''
  password = ''
  loading = signal(false)
  errorMessage = signal('')
  successMessage = signal('')

  async onSubmit() {
    this.loading.set(true)
    this.errorMessage.set('')
    this.successMessage.set('')
    const { error } = await this.auth.signUp(this.email, this.password)
    if (error) {
      this.errorMessage.set(error.message)
    } else {
      this.successMessage.set('Check your email for a confirmation link.')
    }
    this.loading.set(false)
  }
}
