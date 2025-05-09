import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Post } from '../../models/post.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar' : 'Nuevo' }} Post</h2>
    <form [formGroup]="f" mat-dialog-content class="!flex flex-col">
      <mat-form-field appearance="fill">
        <mat-label>Título</mat-label>
        <input matInput formControlName="title" />
        <mat-error *ngIf="f.get('title')?.hasError('required')">
          Requerido
        </mat-error>
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Contenido</mat-label>
        <textarea matInput formControlName="body"></textarea>
        <mat-error *ngIf="f.get('body')?.hasError('minlength')">
          + Mínimo 10 caracteres +
        </mat-error>
      </mat-form-field>
    </form>
    <mat-dialog-actions align="end">
      <button class="m-2" mat-flat-button mat-dialog-close color="warn">
        Cancelar
      </button>
      <button
        class="m-2"
        mat-flat-button
        [disabled]="f.invalid"
        (click)="save()"
      >
        Guardar
      </button>
    </mat-dialog-actions>
  `,
})
export class PostFormComponent implements OnInit {
  f!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PostFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post
  ) {}

  ngOnInit() {
    this.f = this.fb.group({
      userId: [1],
      title: ['', Validators.required],
      body: ['', [Validators.required, Validators.minLength(10)]],
    });
    if (this.data) {
      this.f.patchValue(this.data);
    }
  }

  save() {
    this.dialogRef.close({ ...this.data, ...this.f.value });
  }
}
