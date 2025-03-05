import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Note } from '../models/note.model';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="notes-grid">
      @for (note of notes$ | async; track note.id) {
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ note.title }}</mat-card-title>
            <mat-card-subtitle>
              Last updated: {{ note.updatedAt | date:'medium' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ note.content }}</p>
            <mat-chip-set>
              <mat-chip>
                {{ note.content.length }} characters
              </mat-chip>
            </mat-chip-set>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="warn" (click)="deleteNote(note.id)">
              <mat-icon>delete</mat-icon> Delete
            </button>
            <button mat-button color="primary" (click)="editNote(note)">
              <mat-icon>edit</mat-icon> Edit
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }
    mat-chip-set {
      margin-top: 16px;
    }
  `]
})
export class NoteListComponent {
  @Input() searchTerm: string = '';
  @Output() editNoteEvent = new EventEmitter<Note>();
  
  notes$ = this.notesService.getNotes();

  constructor(private notesService: NotesService) {}

  deleteNote(id: string) {
    this.notesService.deleteNote(id);
  }

  editNote(note: Note) {
    this.editNoteEvent.emit(note);
  }
}