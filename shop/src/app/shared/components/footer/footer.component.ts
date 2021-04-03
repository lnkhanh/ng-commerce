import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public version = environment.version;

  constructor() { }

  ngOnInit(): void {
  }

}
