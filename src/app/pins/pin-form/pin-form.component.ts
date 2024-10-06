import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { PinService } from '../../../service/pin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pin-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    CommonModule,
    NgLabelTemplateDirective,
    NgOptionTemplateDirective,
    NgSelectComponent,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './pin-form.component.html',
  styleUrls: ['./pin-form.component.css']
})
export class PinFormComponent implements OnInit {
  pinForm!: FormGroup;
  uploader: FileUploader = new FileUploader({ url: 'your-upload-url-here' });
  imageTouched = false;
  collaborators = [];
  selectedCollaborator: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<PinFormComponent>, private pinService: PinService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.pinForm = this.fb.group({
      title: ['', Validators.required],
      collaborator: ['', Validators.required],
      privacy: ['', Validators.required],
      image: [null]
    });

    this.getCollaborators();

  }

  getCollaborators(): void {
    const storedCollaborators = localStorage.getItem('customers');
    if (storedCollaborators) {
      this.collaborators = JSON.parse(storedCollaborators);
    } else {
      this.collaborators = [];
    }
  }

  onFileSelected(event: any): void {
    const file = event[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            // Update the form with the base64 image data
            this.pinForm.patchValue({ image: e.target.result });
        };
        reader.readAsDataURL(file);
    }
}


  onSubmit(): void {
    this.imageTouched = true;
    if (this.pinForm.valid && this.uploader.getNotUploadedItems().length) {
      const formData = this.pinForm.value;
      const storedPins = localStorage.getItem('pins');
        let pins = storedPins ? JSON.parse(storedPins) : [];
        pins.push(formData);
        localStorage.setItem('pins', JSON.stringify(pins));
        this.pinService.addPin(formData);
        this.dialogRef.close();
    } else {
      this.snackBar.open('Please fill out all required fields', 'Close', {
        duration: 3000,
      });
    }
  }
}
