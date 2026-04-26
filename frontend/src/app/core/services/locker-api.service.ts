import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  ApiResponse,
  Locker,
  Package,
  StorePackageRequest,
  StorePackageResponse,
  RetrievePackageRequest,
  RetrievePackageResponse,
} from '../models';
import { ApiError } from '../errors/api-error';

/**
 * LockerApiService — single gateway for all HTTP communication.
 * Components never touch HttpClient directly (Dependency Inversion).
 * Error mapping to ApiError is centralised here.
 */
@Injectable({ providedIn: 'root' })
export class LockerApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ── Lockers ───────────────────────────────────────────────────────

  getLockers(): Observable<ApiResponse<Locker[]>> {
    return this.http.get<ApiResponse<Locker[]>>(`${this.baseUrl}/lockers`).pipe(
      catchError(err => throwError(() => ApiError.fromHttpError(err)))
    );
  }

  createLocker(size: string): Observable<ApiResponse<Locker>> {
    return this.http.post<ApiResponse<Locker>>(`${this.baseUrl}/lockers`, { size }).pipe(
      catchError(err => throwError(() => ApiError.fromHttpError(err)))
    );
  }

  // ── Packages ──────────────────────────────────────────────────────

  getPackages(): Observable<ApiResponse<Package[]>> {
    return this.http.get<ApiResponse<Package[]>>(`${this.baseUrl}/packages`).pipe(
      catchError(err => throwError(() => ApiError.fromHttpError(err)))
    );
  }

  storePackage(payload: StorePackageRequest): Observable<StorePackageResponse> {
    return this.http.post<StorePackageResponse>(`${this.baseUrl}/packages/store`, payload).pipe(
      catchError(err => throwError(() => ApiError.fromHttpError(err)))
    );
  }

  retrievePackage(payload: RetrievePackageRequest): Observable<RetrievePackageResponse> {
    return this.http.post<RetrievePackageResponse>(`${this.baseUrl}/packages/retrieve`, payload).pipe(
      catchError(err => throwError(() => ApiError.fromHttpError(err)))
    );
  }
}
