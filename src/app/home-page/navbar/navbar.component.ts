import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { UtilsService } from 'src/app/utils/utils.service';

declare var anime: any;

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NgClass],
})
export class NavbarComponent implements OnInit {
  componentMap: Object = {
    '/': '.homeContent',
    '/about': '.aboutContent',
    '/algorithms': '.algorithmContent',
    '/feedback': '.feedbackContent',
  };

  constructor(public router: Router, public utils: UtilsService) {}

  ngOnInit(): void {}

  fadeCurrentPage(): void {
    anime({
      targets: [this.componentMap[this.router.url]],
      easing: 'easeInOutQuint',
      opacity: [1, 0],
      duration: 400,
    });
  }

  async goToPage(page: string): Promise<void> {
    if (!(this.router.url == page)) {
      this.fadeCurrentPage();
      await this.utils.delay(400);
      this.router.navigateByUrl(page, { skipLocationChange: true });
    }
  }
}
