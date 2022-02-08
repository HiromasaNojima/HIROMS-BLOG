import { Injectable } from '@angular/core';

interface BreadCrumbList {
  '@context': string;
  '@type': string;
  name: string;
  itemListElement: ItemListElement[];
}

export interface ItemListElement {
  '@type' : string;
  position : number;
  name: string;
  item: any;
}

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {

  scriptType : string = 'application/ld+json';

  constructor() {}

  removeBreadcrumbList(): void {
    let scripts = document.getElementsByTagName('script');
    for(let i = 0; i < scripts.length; i++) {
      if(scripts[i].type == 'application/ld+json'){
        document.head.removeChild(scripts[i]);
      };
    }
  }

  insertBreadcrumbList(items: ItemListElement[]): void {
    let script = document.createElement('script');
    script.type = this.scriptType;
    
    let itemListElement : ItemListElement[] = [];
    itemListElement.push({ 
      '@type': 'ListItem',
      position: 1,
      name: 'ホーム',
      item: 'https://hiroms-blog.com'
    });
    items.forEach(e => {
      itemListElement.push(e);
    })
    
    let breadCrumbList: BreadCrumbList = {
      '@context' : 'https://schema.org',
      '@type' : 'BreadcrumbList',
      name : '🍞パンくずリスト',
      itemListElement : itemListElement
    }

    script.text = JSON.stringify(breadCrumbList, (_, value) => {
      if (value !== null) return value
    });

    document.head.appendChild(script);
  }
}
