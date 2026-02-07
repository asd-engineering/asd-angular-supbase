import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast toast-end">
      <div class="alert" [class]="'alert-' + type">
        <span>{{ message }}</span>
      </div>
    </div>
  `,
})
export class Toast {
  @Input() message = ''
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'info'
}
