import { Component, OnDestroy} from '@angular/core';
import { ContentfulService } from 'src/app/service/contentful/contentful.service';
import { Entry } from 'contentful';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta/meta.service';

@Component({
  selector: 'app-blog-posts',
  templateUrl: './blog-posts.component.html',
  styleUrls: ['./blog-posts.component.css']
})
export class BlogPostsComponent implements OnDestroy{
  cols:number = 3;
  blogPosts: Entry<any>[] = [];
  tagName:any;
  paramsSubscription : Subscription;

  constructor(private service:ContentfulService, private route:ActivatedRoute, private router:Router, private pageTitle :Title, private metaService:MetaService) { 
    this.paramsSubscription = this.route.params.subscribe(
      params => {
        let tag = params['tag'];
        if (tag) {
          this.service.fetchTag(tag).then(res => {
            this.tagName = res[0].fields.name;
            this.pageTitle.setTitle(`タグ「${res[0].fields.name}」の記事一覧 - HIROM'S BLOG`);
            this.metaService.updateDescription(`タグ「${res[0].fields.name}」の記事一覧。ソフトウェアエンジニアの個人ブログ。主に技術に関する記事を執筆しています。`);
            this.service.fetchBlogPostByTagId(res[0].sys.id).then(res => {
              this.blogPosts = res;
            })
          })
        } else {
          this.service.fetchBlogPosts().then(blogPosts => {this.blogPosts = blogPosts});
          this.pageTitle.setTitle("最新の記事一覧 - HIROM'S BLOG");
          this.metaService.updateDescription("最新の記事一覧。ソフトウェアエンジニアの個人ブログ。主に技術に関する記事を執筆しています。");
        }
      }
    )
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
