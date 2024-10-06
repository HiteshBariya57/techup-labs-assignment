import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFormComponent } from '../../customers/customer-form/customer-form.component';
import { PinFormComponent } from '../pin-form/pin-form.component';
import { CommonModule } from '@angular/common';
import { PinService } from '../../../service/pin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pin-list',
  standalone: true,
  imports: [
    CustomerFormComponent,
    PinFormComponent,
    CommonModule
  ],
  templateUrl: './pin-list.component.html',
  styleUrl: './pin-list.component.css'
})
export class PinListComponent implements OnInit {
  pins: any[] = [];
  customers: any[] = [];

  constructor(private dialog: MatDialog, private pinService: PinService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const storedPins = localStorage.getItem('pins');
    this.pins = storedPins ? JSON.parse(storedPins) : [];

    this.pinService.pinAdded$.subscribe((newPin) => {
      this.pins.push(newPin);
    });
  }


  openCustomerFormDialog(): void {
    const dialogRef = this.dialog.open(CustomerFormComponent, {
    panelClass: 'customer-modal',
    maxWidth: '90vw',
    width: '600px',
      data: {}
    });
  }

  openPinFormDialog(): void {
    const storedCustomers = localStorage.getItem('customers');
    this.customers = storedCustomers ? JSON.parse(storedCustomers) : [];
    if (this.customers.length === 0) {
      this.snackBar.open('Please add a customer before creating a pin.', 'Close', {
        duration: 3000,
      });
      return;
    }
    const dialogRef = this.dialog.open(PinFormComponent, {
    panelClass: 'customer-modal',
    maxWidth: '90vw',
    width: '600px',
      data: {}
    });
  }

  clearData(): void {
    this.pins = [];
    localStorage.removeItem('pins');
    localStorage.removeItem('customers');
  }

}
