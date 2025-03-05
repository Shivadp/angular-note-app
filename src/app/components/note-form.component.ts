import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <form [formGroup]="noteForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" placeholder="Note title">
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Content</mat-label>
            <textarea matInput formControlName="content" placeholder="Note content" rows="4"></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="!noteForm.valid">
            {{ noteToEdit ? 'Update Note' : 'Add Note' }}
          </button>
          @if (noteToEdit) {
            <button mat-button type="button" (click)="cancelEdit()">
              Cancel
            </button>
          }
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    button {
      margin-right: 8px;
    }
  `]
})
export class NoteFormComponent implements OnChanges {
  @Input() noteToEdit: Note | null = null;
  @Output() submitNote = new EventEmitter<{ title: string; content: string }>();

  noteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['noteToEdit'] && this.noteToEdit) {
      this.noteForm.patchValue({
        title: this.noteToEdit.title,
        content: this.noteToEdit.content
      });
    }
  }

  onSubmit() {
    if (this.noteForm.valid) {
      this.submitNote.emit(this.noteForm.value);
      this.noteForm.reset();
     
    }
  }

  cancelEdit() {
    this.noteToEdit = null;
    this.noteForm.reset();
  }
}