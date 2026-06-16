import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent,
    ToastContainerComponent
]
})
export class AppComponent {
  title = 'frontend';
  isMenuOpen = false;
}
