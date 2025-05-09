import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PostsService } from '../../services/posts.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { Post } from '../../models/post.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    FlexModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Mis Posts</span>
      <button mat-icon-button (click)="openForm()">
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>
    <div fxLayout="row wrap" fxLayout.xs="column wrap" fxLayoutGap="16px">
      <mat-card
        *ngFor="let p of posts$ | async"
        fxFlex="calc(40%)"
        class="m-3 p-3"
      >
        <mat-card-title>{{ p.title }}</mat-card-title>
        <mat-card-content>{{ p.body }}</mat-card-content>
        <mat-card-actions>
          <button mat-button (click)="openForm(p)">Editar</button>
          <button mat-button color="warn" (click)="delete(p.id)">Borrar</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
})
export class PostListComponent {
  posts$!: Observable<Post[]>;

  constructor(private postsService: PostsService, private dialog: MatDialog) {
    this.posts$ = this.postsService.posts$;
  }

  openForm(post?: Post) {
    const ref = this.dialog.open(PostFormComponent, { data: post });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        post
          ? this.postsService.update(result)
          : this.postsService.create(result);
      }
    });
  }

  delete(id?: number) {
    if (id == null) {
      return;
    }
    this.postsService.delete(id);
  }
}
