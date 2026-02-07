import { Component, inject } from '@angular/core'
import { AuthService } from '@core/services/auth.service'

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="card bg-base-200">
      <div class="card-body">
        <h2 class="card-title font-heading">Account Settings</h2>
        <div class="divider"></div>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-muted mb-1">Email</p>
            <p class="font-medium">{{ auth.user()?.email }}</p>
          </div>
          <div>
            <p class="text-sm text-muted mb-1">User ID</p>
            <p class="font-mono text-sm">{{ auth.user()?.id }}</p>
          </div>
        </div>
        <div class="card-actions justify-end mt-6">
          <button class="btn btn-error btn-outline btn-sm" (click)="auth.signOut()">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  `,
})
export class Settings {
  protected readonly auth = inject(AuthService)
}
