import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { SupabaseService } from '@core/services/supabase.service'

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div class="flex items-center justify-center p-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  `,
})
export class Callback implements OnInit {
  private readonly supabase = inject(SupabaseService)
  private readonly router = inject(Router)

  async ngOnInit() {
    const session = await this.supabase.getSession()
    if (session) {
      await this.router.navigate(['/dashboard'])
    } else {
      await this.router.navigate(['/auth/login'])
    }
  }
}
