import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <dialog class="modal" [class.modal-open]="open">
      <div class="modal-box">
        <h3 class="font-bold text-lg font-heading">{{ title }}</h3>
        <p class="py-4 text-muted">{{ message }}</p>
        <div class="modal-action">
          <button class="btn btn-ghost" (click)="cancelled.emit()">Cancel</button>
          <button class="btn btn-primary" (click)="confirmed.emit()">Confirm</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button (click)="cancelled.emit()">close</button>
      </form>
    </dialog>
  `,
})
export class ConfirmModal {
  @Input() open = false
  @Input() title = 'Confirm'
  @Input() message = 'Are you sure?'
  @Output() confirmed = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()
}
