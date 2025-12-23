import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

    @Injectable({
    providedIn: 'root'
    })
    export class EventService {
    private apiUrl = 'http://localhost:8080/api/events';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.id}`
        });
    }

    createEvent(event: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, event, { headers: this.getHeaders() });
    }

    getMyOrganizedEvents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/organized`, { headers: this.getHeaders() });
    }

    getMyInvitedEvents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/invited`, { headers: this.getHeaders() });
    }

    getAllMyEvents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my-events`, { headers: this.getHeaders() });
    }

    getEventById(eventId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${eventId}`, { headers: this.getHeaders() });
    }

    getEventParticipants(eventId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${eventId}/participants`, { headers: this.getHeaders() });
    }

    inviteUser(eventId: number, email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${eventId}/invite`, { email }, { headers: this.getHeaders() });
    }

    updateAttendeeStatus(eventId: number, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${eventId}/status`, { status }, { headers: this.getHeaders() });
    }

    deleteEvent(eventId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${eventId}`, { headers: this.getHeaders() });
    }

    }