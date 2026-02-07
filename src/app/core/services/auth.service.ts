import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { SupabaseService } from './supabase.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService)
  private readonly router = inject(Router)

  readonly session = this.supabase.session
  readonly user = this.supabase.user
  readonly isAuthenticated = this.supabase.isAuthenticated
  readonly loading = this.supabase.loading

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.signInWithPassword(email, password)
    if (!error) {
      await this.router.navigate(['/dashboard'])
    }
    return { error }
  }

  async signUp(email: string, password: string) {
    const { error } = await this.supabase.signUp(email, password)
    return { error }
  }

  async signOut() {
    await this.supabase.signOut()
    await this.router.navigate(['/auth/login'])
  }
}
