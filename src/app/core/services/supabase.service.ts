import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js'
import { environment } from '@env/environment'
import type { Database } from '@core/types/database.types'

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient<Database> | null = null
  private readonly platformId = inject(PLATFORM_ID)

  private readonly _session = signal<Session | null>(null)
  private readonly _user = signal<User | null>(null)
  private readonly _loading = signal(true)

  readonly session = this._session.asReadonly()
  readonly user = this._user.asReadonly()
  readonly loading = this._loading.asReadonly()
  readonly isAuthenticated = computed(() => !!this._session())

  constructor() {
    if (environment.supabaseUrl && environment.supabaseAnonKey) {
      this.client = createClient<Database>(environment.supabaseUrl, environment.supabaseAnonKey)
      if (isPlatformBrowser(this.platformId)) {
        this.initAuthListener()
      } else {
        this._loading.set(false)
      }
    } else {
      this._loading.set(false)
    }
  }

  get supabase(): SupabaseClient<Database> {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Check environment configuration.')
    }
    return this.client
  }

  private initAuthListener(): void {
    if (!this.client) return

    this.client.auth.onAuthStateChange((_event, session) => {
      this._session.set(session)
      this._user.set(session?.user ?? null)
      this._loading.set(false)
    })

    this.client.auth.getSession().then(({ data: { session } }) => {
      this._session.set(session)
      this._user.set(session?.user ?? null)
      this._loading.set(false)
    })
  }

  signInWithPassword(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password })
  }

  signUp(email: string, password: string) {
    return this.supabase.auth.signUp({ email, password })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  async getSession() {
    if (!this.client) return null
    const {
      data: { session },
    } = await this.client.auth.getSession()
    return session
  }
}
