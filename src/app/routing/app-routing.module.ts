import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlgorithmGuard } from './algorithm-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../home-page/home-content/home-content.component').then(
            (m) => m.HomeContentComponent,
          ),
        data: { animation: 'HomePage' },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../home-page/about-content/about-content.component').then(
            (m) => m.AboutContentComponent,
          ),
        data: { animation: 'AboutPage' },
      },
      {
        path: 'algorithms',
        loadComponent: () =>
          import('../home-page/algorithm-content/algorithm-content.component').then(
            (m) => m.AlgorithmContentComponent,
          ),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('../home-page/feedback-content/feedback-content.component').then(
            (m) => m.FeedbackContentComponent,
          ),
      },
    ],
  },
  {
    path: 'animation',
    loadComponent: () =>
      import('../algorithm-page/algorithm-page.component').then(
        (m) => m.AlgorithmPageComponent,
      ),
    canActivate: [AlgorithmGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
