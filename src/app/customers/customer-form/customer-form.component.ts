import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiResponse } from '../customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  standalone: true, // Standalone component,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatSelectModule]
})
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  customers: any[] = [];
  regions: string[] = [];
  filteredCountries: string[] = [];
  countriesByRegion: { [key: string]: string[] } = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      region: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRegionsAndCountries();
  }

  loadRegionsAndCountries(): void {
    this.http.get<ApiResponse>('https://api.first.org/data/v1/countries').subscribe(response => {
      for (const [code, data] of Object.entries(response.data)) {
        const region = data.region;
        if (!this.countriesByRegion[region]) {
          this.countriesByRegion[region] = [];
          this.regions.push(region);
        }
        this.countriesByRegion[region].push(data.country);
      }

      this.regions = [...new Set(this.regions)];
    });
  }


  onSubmit(): void {
    if (this.customerForm.valid) {
        const formData = this.customerForm.value;

        const storedCustomers = localStorage.getItem('customers');
        let customers = storedCustomers ? JSON.parse(storedCustomers) : [];

        customers.push(formData);

        localStorage.setItem('customers', JSON.stringify(customers));

        this.showNotification('Customer created successfully!');
        this.dialogRef.close(formData);
    } else {
        this.showNotification('Please fill out all required fields');
    }
}

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  onRegionChange(event: Event): void {
    const region = (event.target as HTMLSelectElement)?.value;
    this.filteredCountries = this.countriesByRegion[region] || [];
    this.customerForm.patchValue({ country: '' });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

