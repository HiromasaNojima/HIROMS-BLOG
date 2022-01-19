import { NgModule,  SecurityContext} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { BlogPostsComponent } from './component/blog-posts/blog-posts.component';
import { NgParticlesModule } from "ng-particles";
import { ParticlesComponent } from './component/particles/particles.component';
import { MarkdownModule } from 'ngx-markdown';
import { BlogPostComponent } from './component/blog-post/blog-post.component';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './component/contact/contact.component';
import { ThanksComponent } from './component/thanks/thanks.component';
import { TagsComponent } from './component/tags/tags.component';



const routes: Routes = [ 
  { path: 'tags', component: TagsComponent },
  { path: 'tags/:tag', component: BlogPostsComponent},
  { path: 'tags/:tag/:page', component: BlogPostsComponent},
  { path: 'entries/:entry', component: BlogPostComponent },
  { path: 'pages/:page', component: BlogPostsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'thanks', component: ThanksComponent },
  { path: '**', component: BlogPostsComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    BlogPostsComponent,
    ParticlesComponent,
    BlogPostComponent,
    ContactComponent,
    ThanksComponent,
    TagsComponent,
  ],
  imports: [
    BrowserModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    NgParticlesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(
      {
        sanitize: SecurityContext.NONE,
      }
    ),
    RouterModule.forRoot(
      routes,
      { 
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
