import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NoteFormComponent } from './app/components/note-form.component';
import { NoteListComponent } from './app/components/note-list.component';
import { NotesService } from './app/services/notes.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Note } from './app/models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NoteFormComponent, 
    NoteListComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h1>Notes App</h1>
      <mat-form-field class="search-field">
        <mat-label>Search notes</mat-label>
        <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearch($event)" placeholder="Search by title or content">
      </mat-form-field>
      <app-note-form 
        [noteToEdit]="selectedNote" 
        (submitNote)="onNoteSubmit($event)"
      ></app-note-form>
      <app-note-list 
        [searchTerm]="searchTerm"
        (editNoteEvent)="onEditNote($event)"
      ></app-note-list>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
      margin: 20px 0;
      color: #333;
    }
    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }
  `]
})
export class App {
  searchTerm: string = '';
  selectedNote: Note | null = null;

  constructor(private notesService: NotesService) {}

  onNoteSubmit(noteData: { title: string; content: string }) {
    if (this.selectedNote) {
      this.notesService.updateNote({
        ...this.selectedNote,
        title: noteData.title,
        content: noteData.content
      });
      this.selectedNote = null;
    } else {
      this.notesService.addNote(noteData.title, noteData.content);
    }
  }

  onSearch(term: string) {
    this.notesService.setSearchTerm(term);
  }

  onEditNote(note: Note) {
    this.selectedNote = note;
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
}).catch(err => console.error(err));