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
  blogPosts: Entry<any>[] = [];
  tagName:any;
  paramsSubscription : Subscription;
  currentPageNumber!:number;
  totalPageNumber:any;
  nextPageLink:any;
  prePageLink:any;
  pageLimit:number = 12;

  constructor(private service:ContentfulService, private route:ActivatedRoute, private router:Router, private pageTitle :Title, private metaService:MetaService) { 
    this.paramsSubscription = this.route.params.subscribe(
      params => {
        let tag = params['tag'];
        let page = params['page'];
        if(!page) {
          page = 1;
        }
        this.currentPageNumber = page;
        if (tag) {
          this.service.fetchTag(tag).then(res => {
            this.tagName = res[0].fields.name;
            this.pageTitle.setTitle(`タグ「${res[0].fields.name}」の記事一覧 - HIROM'S BLOG`);
            this.metaService.updateDescription(`タグ「${res[0].fields.name}」の記事一覧。ソフトウェアエンジニアの個人ブログ。主に技術に関する記事を執筆しています。`);
            this.service.fetchBlogPostByTagId(res[0].sys.id, page, this.pageLimit).then(res => {
              this.blogPosts = res.items;
              this.totalPageNumber = this.calculateTotalPage(res.total);
              this.nextPageLink = this.createNextPageLink(res.total);
              this.prePageLink = this.createPrePageLink();
            })
          })
        } else {
          this.service.fetchBlogPosts(page, this.pageLimit).then(res => {
            this.blogPosts = res.items;
            this.totalPageNumber = this.calculateTotalPage(res.total);
            this.nextPageLink = this.createNextPageLink(res.total);
            this.prePageLink = this.createPrePageLink();
          });
          this.pageTitle.setTitle("最新の記事一覧 - HIROM'S BLOG");
          this.metaService.updateDescription("最新の記事一覧。ソフトウェアエンジニアの個人ブログ。主に技術に関する記事を執筆しています。");
        }
      }
    )
  }

  private calculateTotalPage(total: number) :number {
    if (total <= this.pageLimit) {
      return 1;
    }
    
    return Math.ceil(total / this.pageLimit);
  }

  private createNextPageLink(total: number) :string {
    if (this.noNextPage(total)) {
      return '';
    }

    let page:number = this.currentPageNumber;
    return this.createPageLink(++page);
  }

  private createPageLink(page:number) {
    if (this.tagName) {
      return `/tags/${this.tagName}/${page}`;
    } else {
      return `/pages/${page}`;
    }
  }

  private noNextPage(total: number) :boolean {
    return (this.currentPageNumber * this.pageLimit >= total);
  }

  private createPrePageLink() :string {
    if (this.currentPageNumber <= 1) {
      return '';
    }

    let page:number = this.currentPageNumber;
    return this.createPageLink(--page);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
