import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from "./user.service";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  ReplaySubject,
  switchMap,
  take,
  takeUntil
} from "rxjs";
import { doc, docData, docSnapshots, Firestore, setDoc } from "@angular/fire/firestore";


const LOCAL_STORAGE_KEY = 'channels';

export interface Channel {
  id: string;
  title: string;
}


function userDoc(firestore: Firestore, uid: string) {
  return doc(firestore, `banned/${uid}`);
}

@Injectable({
  providedIn: 'root'
})
export class BannedService implements OnDestroy {
  private readonly destroy$ = new ReplaySubject<void>(1);
  readonly localBannedChannels$ = new BehaviorSubject<Channel[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null') || [],
  );

  readonly remoteBannedChannels$: Observable<Channel[]> = this.user.user$.pipe(
    filter(u => !!u),
    switchMap(user => {
      return docData(userDoc(this.firestore, user!.uid)).pipe(map(a => {
        return JSON.parse(a?.['channels'] || '[]') as Channel[];
      }))
    }))


  readonly bannedChannels$ = this.user.user$.pipe(switchMap(user => {
    const hasUser = !!user;
    return hasUser ? this.remoteBannedChannels$ : this.localBannedChannels$;
  }));


  ngOnDestroy() {
    this.destroy$.next();
  }

  constructor(
    private readonly user: UserService,
    private readonly firestore: Firestore,
  ) {
    this.localBannedChannels$.pipe(takeUntil(this.destroy$)).subscribe(channels => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(channels));
    });

    user.user$.subscribe(user => {
      if (user) {
        this.migrateToFirebase(user.uid);
      }
    });
  }

  migrateToFirebase(uid: string) {
    const userChannels = doc(this.firestore, `banned/${uid}`);
    combineLatest([
      this.localBannedChannels$.pipe(filter(a => a.length > 0)),
      docSnapshots(userChannels).pipe(map(r => r.data() ?? {})),
    ]).pipe(
      take(1),
      takeUntil(this.destroy$),
    ).subscribe(async ([local, remote]) => {
        const remoteChannels = JSON.parse(remote?.['channels'] || '[]');
        console.log(local, remoteChannels);
        debugger;
        const merged = [...remoteChannels, ...local];
        // TODO: dedupe
        const result = {channels: JSON.stringify(merged)};
        await setDoc(userChannels, result);
        this.localBannedChannels$.next([]);
      }
    );

    console.log(uid);
  }

  banChannel(c: Channel) {
    if (!this.user.hasCurrentUser()) {
      const current = this.localBannedChannels$.getValue().filter(a => a.id !== c.id);
      this.localBannedChannels$.next([...current, c]);
    } else {
      combineLatest([this.remoteBannedChannels$.pipe(), this.user.user$]).pipe(
        take(1),
        switchMap(([channels, user]) => {
          const result = [c, ...channels];
          return setDoc(userDoc(this.firestore, user!.uid), {channels: JSON.stringify(result)});
        }),
        take(1),
        takeUntil(this.destroy$),
      ).subscribe()
    }
  }

  unbanChannel(id: string) {
    if (!this.user.hasCurrentUser()) {
      this.localBannedChannels$.next(
        this.localBannedChannels$.getValue().filter(a => a.id !== id),
      );
    } else {
      combineLatest([this.remoteBannedChannels$.pipe(), this.user.user$]).pipe(
        take(1),
        switchMap(([channels, user]) => {
          const result = channels.filter(a => a.id !== id);
          return setDoc(userDoc(this.firestore, user!.uid), {channels: JSON.stringify(result)});
        }),
        take(1),
        takeUntil(this.destroy$),
      ).subscribe()
    }
  }
}
