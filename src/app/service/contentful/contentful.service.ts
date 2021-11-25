import { Injectable } from '@angular/core';
import { createClient, Entry } from 'contentful';
import {environment} from '../../../environments/environment'

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

  fetchBlogPosts() :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'blogPost', order: '-fields.publishedAt'}).then(res => res.items);
  }

  fetchBlogPostByTagId(tagId:string) :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'blogPost', order: '-fields.publishedAt', 'fields.tags.sys.id': tagId}).then(res => res.items);
  }

  fetchBlogPost(slug:string) :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'blogPost', 'fields.slug': slug}).then(res => res.items);
  }

  fetchTag(tag:string) :Promise<Entry<any>[]>{
    return this.client.getEntries({content_type: 'tags', 'fields.slug': tag}).then(res => res.items);
  }

}
