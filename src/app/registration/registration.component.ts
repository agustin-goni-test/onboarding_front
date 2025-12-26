import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

export class RegistrationComponent {
  rut: string = '';
  email: string = '';
  phone: string = '';

  constructor(private router: Router) { }

  onSubmit(): void {
    // For the moment, we are keeping this in variables only
    console.log('RUT:', this.rut);
    console.log('Email:', this.email);
    console.log('Phone:', this.phone);

    // Navigate to the input form after registration
    this.router.navigate(['/inference']);
  }

}
