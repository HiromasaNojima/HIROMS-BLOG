import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/service/contentful/contentful.service';
import { Entry } from 'contentful';
import { MetaService } from 'src/app/service/meta/meta.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags: Entry<any>[] = [];
  
  pageTitle = "タグ一覧";

  constructor(private service:ContentfulService, private metaService:MetaService, private title :Title) { }

  ngOnInit(): void {
    this.service.fetchTags().then(res => {
      this.tags = res;
    });
    this.title.setTitle(this.pageTitle + " - HIROM'S BLOG");
    this.metaService.updateDescription(this.pageTitle + "。ソフトウェアエンジニアの個人ブログ。主に技術に関する記事を執筆しています。");
  }

}
