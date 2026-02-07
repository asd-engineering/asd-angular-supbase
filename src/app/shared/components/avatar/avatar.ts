import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div class="avatar placeholder">
      <div
        class="bg-primary text-primary-content rounded-full"
        [style.width.px]="size"
        [style.height.px]="size"
      >
        <span class="text-sm">{{ initials }}</span>
      </div>
    </div>
  `,
})
export class Avatar {
  @Input() name = ''
  @Input() size = 40

  get initials(): string {
    return this.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
}
