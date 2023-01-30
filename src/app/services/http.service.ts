import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { APIResponse, GameInterface } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    url: string,
    ordering: string,
    search?: string
  ): Observable<APIResponse<GameInterface>> {
    //Getting the date
    const getCurrentMonth = () => {
      const month = new Date().getMonth() + 1;
      if (month < 10) {
        return `0${month}`;
      } else {
        return month;
      }
    };
    //Getting the date
    const getCurrentDay = () => {
      const day = new Date().getDate();
      if (day < 10) {
        return `0${day}`;
      } else {
        return day;
      }
    };
    //Current Day/Month/Year
    const currentYear = new Date().getFullYear();
    const currentMonth = getCurrentMonth();
    const currentDay = getCurrentDay();
    const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
    const lastYear = `${currentYear - 1}-${currentMonth}-${currentDay}`;
    const nextYear = `${currentYear + 1}-${currentMonth}-${currentDay}`;

    let params = new HttpParams()
      .set('ordering', ordering)
      .set('dates', `${lastYear},${currentDate}`);

    if (search) {
      params = new HttpParams().set('search', search);
    }
    if (url === `${env.BASE_URL}/games`) {
      return this.http.get<APIResponse<GameInterface>>(url, {
        params: params,
      });
    } else {
      return this.http.get<APIResponse<GameInterface>>(url);
    }
  }

  getOtherPage(url: string) {
    return this.http.get<APIResponse<GameInterface>>(url);
  }

  getGameDetails(id: string): Observable<GameInterface> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);

    const gameTrailersRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/movies`
    );

    const gameScreenshotsRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/screenshots`
    );

    return forkJoin({
      gameInfoRequest,
      gameTrailersRequest,
      gameScreenshotsRequest,
    }).pipe(
      map((resp: any) => {
        console.log('Resp', resp);

        return {
          ...resp['gameInfoRequest'],
          trailers: resp['gameTrailersRequest']?.results,
          screenshots: resp['gameScreenshotsRequest']?.results,
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
}
