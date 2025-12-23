import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EventService } from '../services/event.service';

interface EventWithRole {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizerId: number;
  organizerName: string;
  userRole: string;
  userStatus: string;
  createdAt: string;
}

@Component({
  selector: 'app-invited-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './invited-events.html',
  styleUrls: ['./invited-events.css'],
  providers: [EventService]
})
export class InvitedEvents implements OnInit {
  currentUser: any;
  events: EventWithRole[] = [];
  isLoading: boolean = false;
  selectedEvent: EventWithRole | null = null;
  showStatusModal: boolean = false;
  selectedStatus: string = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.currentUser = JSON.parse(userStr);
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getMyInvitedEvents().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.events = response.data || [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading events:', error);
        alert('Failed to load events');
      }
    });
  }

  openStatusModal(event: EventWithRole): void {
    this.selectedEvent = event;
    this.selectedStatus = event.userStatus || 'maybe';
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedEvent = null;
    this.selectedStatus = '';
  }

  updateStatus(): void {
    if (!this.selectedEvent) return;

    this.eventService.updateAttendeeStatus(this.selectedEvent.id, this.selectedStatus).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Status updated successfully!');
          this.closeStatusModal();
          this.loadEvents();
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert('Failed to update status');
        }
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(timeStr: string): string {
    return timeStr;
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'going': return '#4caf50';
      case 'maybe': return '#ff9800';
      case 'not going': return '#f44336';
      default: return '#999';
    }
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'going': return '✓';
      case 'maybe': return '?';
      case 'not going': return '✗';
      default: return '-';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }
  }
}