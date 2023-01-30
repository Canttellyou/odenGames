import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, GameInterface } from 'src/app/models/models';
import { HttpService } from 'src/app/services/http.service';
import { environment as env } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public sort: string;
  public games: Array<GameInterface>;
  public next: string;
  public previous = '';
  public currentURL = `${env.BASE_URL}/games`;
  private routeSub: Subscription;
  private gameSub: Subscription;
  public page = 0;
  public sortDisplay = true;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['game-search']) {
        this.searchGames('-relevance', params['game-search']);
        this.sortDisplay = false;
      } else {
        this.searchGames('-relevance');
        this.sortDisplay = true;
      }
    });
  }
  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  goToPage(pageName: string) {
    sessionStorage.setItem('url', `${env.BASE_URL}/games`);
    this.router.navigate([`${pageName}`]);
    this.searchGames('-relevance');
    this.sortDisplay = true;
  }
  getNext() {
    this.httpService
      .getOtherPage(this.next)
      .subscribe((gameList: APIResponse<GameInterface>) => {
        this.games = gameList.results;
        this.next = gameList.next;
        this.previous = gameList.previous;
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    this.currentURL = this.next;
    // this.sortDisplay = false;
    sessionStorage.setItem('url', this.next);
    if (this.currentURL.includes('page')) {
      this.sortDisplay = false;
    } else {
      this.sortDisplay = true;
    }
    console.log('Current', this.currentURL);
  }

  getPrevious() {
    this.httpService
      .getOtherPage(this.previous)
      .subscribe((gameList: APIResponse<GameInterface>) => {
        this.games = gameList.results;
        this.next = gameList.next;
        this.previous = gameList.previous;

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    this.currentURL = this.previous;
    console.log('Current', this.currentURL);
    sessionStorage.setItem('url', this.previous);
    if (this.currentURL.includes('page')) {
      this.sortDisplay = false;
    } else {
      this.sortDisplay = true;
    }
  }

  getUrl() {
    if (
      sessionStorage.getItem('url') &&
      sessionStorage.getItem('url') !== `${env.BASE_URL}/games` &&
      !window.location.href.includes('search')
    ) {
      this.sortDisplay = false;
      return sessionStorage.getItem('url');
    } else {
      return `${env.BASE_URL}/games`;
    }
  }
  sortGames(sort) {
    sessionStorage.setItem('url', `${env.BASE_URL}/games`);
    this.searchGames(sort);
  }

  searchGames(ordering: string, search?: string) {
    this.gameSub = this.httpService
      .getGameList(this.getUrl(), ordering, search)
      .subscribe((gameList: APIResponse<GameInterface>) => {
        this.games = gameList.results;
        this.next = gameList.next;
        if (gameList.previous) {
          this.previous = gameList.previous;
        }

        console.log(gameList);
      });
  }

  openGameDetails(id: string): void {
    this.router.navigate(['details', id]);
  }
}
