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
  participantCount: number;
  createdAt: string;
}

interface Participant {
  id: number;
  eventId: number;
  userId: number;
  username: string;
  email: string;
  role: string;
  status: string;
  invitedAt: string;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './my-events.html',
  styleUrls: ['./my-events.css'],
  providers: [EventService]
})
export class MyEvents implements OnInit {
  currentUser: any;
  events: EventWithRole[] = [];
  isLoading: boolean = false;
  selectedEvent: EventWithRole | null = null;
  participants: Participant[] = [];
  showInviteModal: boolean = false;
  showParticipantsModal: boolean = false;
  inviteEmail: string = '';
  isInviting: boolean = false;

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
    this.eventService.getMyOrganizedEvents().subscribe({
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

  createNewEvent(): void {
    this.router.navigate(['/events/create']);
  }

  viewEvent(event: EventWithRole): void {
    this.selectedEvent = event;
    this.loadParticipants(event.id);
  }

  loadParticipants(eventId: number): void {
    this.eventService.getEventParticipants(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.participants = response.data || [];
          this.showParticipantsModal = true;
        }
      },
      error: (error) => {
        console.error('Error loading participants:', error);
        alert('Failed to load participants');
      }
    });
  }

  deleteEvent(event: EventWithRole): void {
    if (confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      this.eventService.deleteEvent(event.id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Event deleted successfully');
            this.loadEvents();
          }
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event');
        }
      });
    }
  }

  openInviteModal(event: EventWithRole): void {
    this.selectedEvent = event;
    this.inviteEmail = '';
    this.showInviteModal = true;
  }

  closeInviteModal(): void {
    this.showInviteModal = false;
    this.selectedEvent = null;
    this.inviteEmail = '';
  }

  closeParticipantsModal(): void {
    this.showParticipantsModal = false;
    this.selectedEvent = null;
    this.participants = [];
  }

  inviteUser(): void {
    if (!this.inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!this.selectedEvent) return;

    this.isInviting = true;
    this.eventService.inviteUser(this.selectedEvent.id, this.inviteEmail).subscribe({
      next: (response) => {
        this.isInviting = false;
        if (response.success) {
          alert('User invited successfully!');
          this.closeInviteModal();
          this.loadEvents();
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        this.isInviting = false;
        console.error('Error inviting user:', error);
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert('Failed to invite user');
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