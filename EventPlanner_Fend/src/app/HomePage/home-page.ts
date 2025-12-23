import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  currentUser: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = JSON.parse(userStr);
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/events/create']);
  }

  navigateToMyEvents(): void {
    this.router.navigate(['/events/my-events']);
  }

  navigateToInvitedEvents(): void {
    this.router.navigate(['/events/invited']);
  }

  navigateToAllEvents(): void {
    this.router.navigate(['/events/all']);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}