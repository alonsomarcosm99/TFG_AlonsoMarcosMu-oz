// delete-success-dialog.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-success-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="color: green;">El programa se ha eliminado correctamente</h2>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
    </mat-dialog-actions>
  `
})
export class DeleteSuccessDialogComponent {
  constructor(private dialog: MatDialog) {}

  close(): void {
    this.dialog.closeAll();
  }
}
