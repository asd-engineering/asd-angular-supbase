import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { SupabaseService } from '@core/services/supabase.service'

export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService)
  const router = inject(Router)

  const session = await supabase.getSession()

  if (!session) {
    return router.createUrlTree(['/auth/login'])
  }

  return true
}
