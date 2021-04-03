// Angular
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
// Auth
import { AuthNoticeService } from './auth-notice/auth-notice.service';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent implements OnInit {
  // Public properties
  today: number = Date.now();
  headerLogo: string;

  constructor(
    public authNoticeService: AuthNoticeService,
  ) {}

  ngOnInit(): void {
  }
}
