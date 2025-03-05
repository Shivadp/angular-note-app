import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notes = new BehaviorSubject<Note[]>([]);
  private searchTerm = new BehaviorSubject<string>('');

  getNotes(): Observable<Note[]> {
    return combineLatest([
      this.notes,
      this.searchTerm
    ]).pipe(
      map(([notes, term]) => {
        if (!term) return notes;
        return notes.filter(note => 
          note.title.toLowerCase().includes(term.toLowerCase()) ||
          note.content.toLowerCase().includes(term.toLowerCase())
        );
      })
    );
  }

  setSearchTerm(term: string): void {
    this.searchTerm.next(term);
  }

  addNote(title: string, content: string): void {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const currentNotes = this.notes.getValue();
    this.notes.next([newNote, ...currentNotes]);
  }

  updateNote(updatedNote: Note): void {
    const currentNotes = this.notes.getValue();
    const index = currentNotes.findIndex(note => note.id === updatedNote.id);
    if (index !== -1) {
      currentNotes[index] = {
        ...updatedNote,
        updatedAt: new Date()
      };
      this.notes.next([...currentNotes]);
    }
  }

  deleteNote(id: string): void {
    const currentNotes = this.notes.getValue();
    this.notes.next(currentNotes.filter(note => note.id !== id));
  }
}