import { Injectable } from '@angular/core';
import { createClient, Entry, EntryCollection } from 'contentful';
import { environment } from '../../../environments/environment'

export interface EntryWithTag {
  entry: Entry<any>;
  tag: Entry<any>;
}

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.token,
    environment: environment.contentful.environment
  });

  constructor() { }

  fetchBlogPosts(page: number, limit: number) :Promise<EntryCollection<any>>{
    return this.client.getEntries({content_type: 'blogPost', order: '-fields.publishedAt',
      skip: this.calculateSkipNum(page, limit), limit: limit}).then(res => res);
  }

  private calculateSkipNum(page: number, limit: number) :number {
    return (page - 1) * limit;
  }

  fetchBlogPostByTagId(tagId:string, page: number, limit: number) :Promise<EntryCollection<any>>{
    return this.client.getEntries({content_type: 'blogPost', order: '-fields.publishedAt', 'fields.tags.sys.id': tagId,
      skip: this.calculateSkipNum(page, limit), limit: limit}).then(res => res);
  }

  fetchBlogPost(slug:string) :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'blogPost', 'fields.slug': slug}).then(res => res.items);
  }

  fetchTag(tag:string) :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'tags', 'fields.slug': tag}).then(res => res.items);
  }

  fetchTags() :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'tags'}).then(res => res.items);
  }

}
