import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from "./user.service";
import { BehaviorSubject, takeUntil } from "rxjs";

const LOCAL_STORAGE_KEY = 'channels';

export interface Channel {
  id: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BannedService implements OnDestroy {
  private readonly destroy$ = new BehaviorSubject<void>(undefined);
  readonly bannedChannels$ = new BehaviorSubject<Channel[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null') || [],
  );

  ngOnDestroy() {
    this.destroy$.next();
  }

  constructor(private user: UserService) {
    this.bannedChannels$.pipe(takeUntil(this.destroy$)).subscribe(channels => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(channels));
    });
  }

  banChannel(c: Channel) {
    if (!this.user.hasCurrentUser()) {
      const current = this.bannedChannels$.getValue().filter(a => a.id !== c.id);
      this.bannedChannels$.next([...current, c]);
    } else {
      // TODO
    }
    debugger;
  }

  unbanChannel(id: string) {
    this.bannedChannels$.next(
      this.bannedChannels$.getValue().filter(a => a.id !== id),
    );
  }


}
