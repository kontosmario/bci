import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { tap } from 'rxjs/operators';

const API = 'https://jsonplaceholder.typicode.com/posts';
const STORAGE_KEY = 'miApp_posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private _posts$ = new BehaviorSubject<Post[]>([]);
  posts$ = this._posts$.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this._posts$.next(JSON.parse(saved));
    } else {
      this.loadInitial();
    }
  }

  private loadInitial() {
    this.http
      .get<Post[]>(API)
      .pipe(
        tap((list) => {
          this._posts$.next(list);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        })
      )
      .subscribe();
  }

  private saveLocal(data: Post[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    this._posts$.next(data);
  }

  create(post: Post) {
    const lista = [...this._posts$.value, { ...post, id: Date.now() }];
    this.saveLocal(lista);
  }

  update(post: Post) {
    const lista = this._posts$.value.map((p) => (p.id === post.id ? post : p));
    this.saveLocal(lista);
  }

  delete(id: number) {
    const lista = this._posts$.value.filter((p) => p.id !== id);
    this.saveLocal(lista);
  }
}
