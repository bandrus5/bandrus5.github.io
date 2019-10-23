import { Injectable } from '@angular/core';
import { User } from '../types/User';
import { Story } from '../types/Story';
import { ServerProxy } from './ServerProxy';
import { Subject } from 'rxjs';
import { Reservation } from '../types/Reservation';
import { Review } from '../types/Review';

@Injectable({
  providedIn: 'root'
})
export class DataStore {
  loggedInUser: User | null;
  allUsers: User[];
  allStories: Story[];
  reservations: Reservation[]; //TODO: split this into reservations and reviews
  userReservations: Reservation[];

  private _loggedInUserSubject = new Subject<User>();
  private _allStoriesSubject = new Subject<Story[]>();
  private _reservationsSubject = new Subject<Reservation[]>();

  loremText = 'lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque non euismod liber pellentesque ac augue lobortis facilisis magna ut molestie odio Ut sollicitudin condimentum venenati praesent ultricies feugiat augue non'.split(
    ' '
  );
  userNames = [
    'bettyTheBot',
    'tommyj',
    'shj1996',
    'megera',
    'bandr',
    'mstbrn',
    'hotman',
    'merric',
    'neo',
    'crest',
    'xkcd',
    'fanboy',
    'heyho',
    'bgibbard',
    'meyer',
    'hackerman'
  ];
  genres = 'Mystery Sci-Fi Fantasy Drama Romance Adventure Action Horror Fan-Fiction Humor Other'.split(
    ' '
  );

  private constructor(private server: ServerProxy) {
    this.loggedInUser = new User(0, 'bettyTheBot', [], [], [], 50);
    this.allUsers = [];
    this.allStories = [];
    this.reservations = [];
  }

  public async refresh() {
    this.server.getStories().subscribe(res => {
      this.allStories = (res as any[]).map(storyDTO => Story.fromDTO(storyDTO));
      this._allStoriesSubject.next(this.allStories);
    });
  }

  // TODO: b.datePosted isn't a date, looks like its just the string. figure that out
  getStoriesByUsername(username: string): Story[] {
    return this.allStories
      .filter(story => {
        return story.author == username;
      })
      .sort((a, b) => {
        return b.datePosted.getTime() - a.datePosted.getTime();
      });
  }

  addUsers(users: User[]) {
    users.forEach(user => {
      this.allUsers.push(user);
    });
  }

  addStories(stories: Story[]) {
    this.allStories.push(...stories);
  }

  reserveReview(story: Story) {
    const user = this.getLoggedInUser();
    const reservation = new Reservation(user.getUserID(), story.storyID);
    user.addReservedStory(reservation);
    this.server.reserveReview(user.getUserID(), parseInt(story.storyID));
    this.addReservation(reservation);
  }

  addReservation(reservation: Reservation) {
    const storyID = reservation.storyID;
    const story = this.allStories.filter(story => story.storyID == storyID)[0];
    story.desiredReviews -= 1;
    this.reservations.push(reservation);
  }

  logInUser(user: User) {
    this.loggedInUser = user;
    this._loggedInUserSubject.next(user);
  }

  getPostedStories(): Story[] {
    return this.getLoggedInUser().getPostedStories();
  }

  getStoryByID(storyID: string): Story {
    return this.allStories.filter(story => story.storyID == storyID)[0];
  }

  getReservedStories() {
    this.server
      .getReservationsByUser(this.getLoggedInUser().getUserID())
      .subscribe(
        (reservations: Reservation[]) => {
          this.userReservations = reservations;
          this._reservationsSubject.next(this.userReservations);
        },
        err => {
          console.log(err);
        }
      );
  }

  getReviewedStories(): Review[] {
    return this.getLoggedInUser().getReviewedStories();
  }

  getCredit(): number {
    return this.getLoggedInUser().getCredit();
  }

  getLoggedInUser(): User {
    return this.loggedInUser || new User(-1, 'Error: No User', [], [], [], 1);
  }

  searchStories(searchQuery: string): Story[] {
    return this.allStories.filter(story => {
      return (
        (story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        story.author !== this.getLoggedInUser().getName()
      );
    });
  }

  getAllStories() {
    return this.allStories;
  }

  generateReviewText(): string {
    let review = '';
    for (let i = 0; i < 130; i++) {
      review +=
        this.loremText[Math.floor(Math.random() * this.loremText.length)] + ' ';
    }
    return review;
  }

  generateRandomDate(): Date {
    const startDate = new Date(2018, 10, 1);
    const endDate = new Date(2019, 0, 1);
    return new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );
  }

  shuffleLoremText() {
    for (var i = 0; i < 100; i++) {
      var randomIndex = Math.floor(Math.random() * this.loremText.length);
      var randomIndex2 = Math.floor(Math.random() * this.loremText.length);
      var temp = this.loremText[randomIndex];
      this.loremText[randomIndex] = this.loremText[randomIndex2];
      this.loremText[randomIndex2] = temp;
    }
  }

  get loggedInUserSubject() {
    return this._loggedInUserSubject;
  }

  get allStoriesSubject() {
    return this._allStoriesSubject;
  }

  get reservationsSubject() {
    return this._reservationsSubject;
  }
}
