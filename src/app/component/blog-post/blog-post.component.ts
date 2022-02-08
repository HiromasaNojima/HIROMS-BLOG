import { Component, OnInit, ElementRef, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentfulService } from 'src/app/service/contentful/contentful.service';
import { BreakpointObserver,BreakpointState } from '@angular/cdk/layout';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MetaService } from 'src/app/service/meta/meta.service';
import { JsonLdService, ItemListElement } from 'src/app/service/json-ld/json-ld.service';

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
    private metaService: MetaService, private jsonLdService: JsonLdService) {
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
        name = tag.fields.name;
        item = 'https://hiroms-blog.com/tags/' + tag.fields.slug
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
      this.createToc(this.headings);
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

  createToc(headings: HTMLElement[]) {
    let toc = this.renderer.createElement('ul');
    let lih1 = this.createLi(headings[0]);
    let ulh2;
    let ulh3;
    
    for(let i = 1; i < headings.length; i++) {
      if (headings[i].tagName == 'H1') {
        this.renderer.appendChild(toc, this.appendToLih1(lih1, ulh3, ulh2));
        
        lih1 = this.createLi(headings[i]);
        ulh2 = null;
        ulh3 = null;
      }

      if (headings[i].tagName == 'H2') {
        if (headings[i-1]?.tagName == 'H3') {
          // case: h2 -> h3 -> h2
          this.renderer.appendChild(ulh2, ulh3);
          ulh3 = null;
        }

        ulh2 = this.appendUl(ulh2, headings[i], 'H2');
      }

      if (headings[i].tagName == 'H3') {
        ulh3 = this.appendUl(ulh3, headings[i], 'H2');
      }
    }
    
    if (lih1) {
      this.renderer.appendChild(toc, this.appendToLih1(lih1, ulh3, ulh2));
    }
    this.renderer.appendChild(this.element.nativeElement, toc);
  }

  private appendToLih1(lih1: any, ulh3: any, ulh2: any) {
    if (ulh3) {
      this.renderer.appendChild(ulh2, ulh3);
    }
    if (ulh2) {
      this.renderer.appendChild(lih1, ulh2);
    }

    return lih1;
  }

  createLi(heading: HTMLElement): string {
    let li = this.renderer.createElement('li');
    let a = this.renderer.createElement('a');
    this.renderer.setProperty(a, 'href', this.hrefValue(heading.id));
    let text = this.renderer.createText(heading.innerText);
    this.renderer.appendChild(a, text);
    this.renderer.appendChild(li, a);

    if (heading.tagName == 'H1') {
      this.renderer.addClass(li,'leading');
    }

    return li;
  }

  appendUl(ul:any, heading: HTMLElement, tagname:string): string {
    if (!ul) {
      ul = this.renderer.createElement('ul');
    }
    this.renderer.appendChild(ul, this.createLi(heading));
    return ul;
  }

  hrefValue(id: any) :string {
    return '/entries/'+ this.slug + '#' + id;
  }

}