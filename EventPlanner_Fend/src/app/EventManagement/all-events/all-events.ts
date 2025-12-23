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
  userStatus?: string;
  participantCount?: number;
  createdAt: string;
}

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './all-events.html',
  styleUrls: ['./all-events.css'],
  providers: [EventService]
})
export class AllEvents implements OnInit {
  currentUser: any;
  allEvents: EventWithRole[] = [];
  filteredEvents: EventWithRole[] = [];
  isLoading: boolean = false;

  searchQuery: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';
  sortBy: string = 'date';

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
    this.eventService.getAllMyEvents().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          const organized = response.data.organized || [];
          const invited = response.data.invited || [];
          this.allEvents = [...organized, ...invited];
          this.applyFilters();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading events:', error);
        alert('Failed to load events');
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.allEvents];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizerName.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (this.filterRole !== 'all') {
      filtered = filtered.filter(event => event.userRole === this.filterRole);
    }

    // Status filter (only for attendee events)
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(event => 
        event.userRole === 'attendee' && event.userStatus === this.filterStatus
      );
    }

    // Sort
    if (this.sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (this.sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    this.filteredEvents = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  quickUpdateStatus(event: EventWithRole, status: string): void {
    if (event.userRole !== 'attendee') {
      alert('You can only update status for events you are attending');
      return;
    }

    this.eventService.updateAttendeeStatus(event.id, status).subscribe({
      next: (response) => {
        if (response.success) {
          event.userStatus = status;
          alert('Status updated successfully!');
        } else {
          alert(response.message);
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status');
      }
    });
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
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

  getRoleBadgeColor(role: string): string {
    return role === 'organizer' ? '#f093fb' : '#4facfe';
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