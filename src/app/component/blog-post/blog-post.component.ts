import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentfulService } from 'src/app/service/contentful/contentful.service';
import { BreakpointObserver,BreakpointState } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta/meta.service';
import { JsonLdService, ItemListElement } from 'src/app/service/json-ld/json-ld.service';
import { TocService } from 'ngx-toc';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit, OnDestroy {

  markdown:any;
  headings: HTMLElement[] = [];
  slug:string = "";
  title:string = "";
  tags:any;
  publishedAt:any;
  updatedAt:any;
  breadCrumbListTagName:any;
  breadCrumbListTagSlug:any;

  @ViewChild('toc') 
  element!: ElementRef;

  @ViewChild('tocContainer') 
  tocContainer!:ElementRef;

  finshedRendering: boolean = false;

  tocClass:string = 'card';
  tocWidth:any;

  breakPointSubsction!:Subscription;

  breadCrumbListTags : Set<string> = new Set<string>(['tech-memo', 'record-of-reading', 'random-note', 'portfolio']);

  calcTocWidth() {
    if (window.matchMedia('(min-width:992px)').matches) {
      this.tocWidth = this.tocContainer.nativeElement.offsetWidth - 8;
    } else {
      this.tocWidth = this.tocContainer.nativeElement.offsetWidth;
    }
  }

  onResize() {
    this.calcTocWidth();
  }

  constructor(private service:ContentfulService, private route:ActivatedRoute, private elementRef :ElementRef<HTMLElement>, 
    private renderer: Renderer2, private breakpointObserver: BreakpointObserver, private pageTitle :Title, 
    private metaService: MetaService, private jsonLdService: JsonLdService, private tocService: TocService, private router: Router) {
  }

  ngOnInit(): void {
    this.breakPointSubsction = this.breakpointObserver.observe(['(min-width:992px)'])
    .subscribe((state:BreakpointState) => {
      if (state.matches) {
        this.tocClass = 'fixed card';
      } else {
        this.tocClass = 'card';
      }
    })

    let entry:string | null = this.route.snapshot.paramMap.get("entry");
    if (entry != null) {
      this.slug = entry;
      this.service.fetchBlogPost(entry).then(blogPosts => {
          this.markdown = blogPosts[0].fields.body;
          this.title = blogPosts[0].fields.title;
          this.pageTitle.setTitle(blogPosts[0].fields.title + " - HIROM'S BLOG");
          this.tags = blogPosts[0].fields.tags;
          this.publishedAt = blogPosts[0].fields.publishedAt;
          this.updatedAt = blogPosts[0].fields.updatedAt;
          this.metaService.updateDescription(blogPosts[0].fields.description);
          this.jsonLdService.removeBreadcrumbList();
          this.jsonLdService.insertBreadcrumbList(this.createItemListElement());
        }
      )
    }
  }

  createItemListElement() : ItemListElement[] {
    let item : any;
    let name : string = '';
    for(let tag of this.tags) {
      if(this.breadCrumbListTags.has(tag.fields.slug)) {
        this.breadCrumbListTagName = tag.fields.name;
        this.breadCrumbListTagSlug = tag.fields.slug;
        name = tag.fields.name;
        item = 'https://hiroms-blog.com/tags/' + tag.fields.slug;
        break;
      }
    }

    let itemListElement : ItemListElement[] = [
      {
        '@type': 'ListItem',
        position: 2,
        name: name,
        item: item
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: this.title,
        item: null
      }
    ];

    return itemListElement;
  }

  ngOnDestroy() {
    this.jsonLdService.removeBreadcrumbList();
    this.breakPointSubsction.unsubscribe();
  }

  onReady() {
    this.elementRef.nativeElement.querySelectorAll<HTMLElement>("h1, h2, h3").forEach(x => {
      this.headings.push(x);
    });
    
    if (this.headings.length != 0 && !this.finshedRendering) {
      this.renderer.appendChild(this.element.nativeElement, this.tocService.createToc('toc-target', ['h1', 'h2', 'h3'], this.router.url, this.renderer));
      const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          this.elementRef.nativeElement.querySelector(`#toc a[href="${this.hrefValue(id)}"]`)?.parentElement?.classList.add('active');
        } else {
          this.elementRef.nativeElement.querySelector(`#toc a[href="${this.hrefValue(id)}"]`)?.parentElement?.classList.remove('active');
        }
      });

      this.finshedRendering = true;
      this.calcTocWidth();
      });

      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });
    }
  }

  hrefValue(id: any) :string {
    return '/entries/'+ this.slug + '#' + id;
  }

}