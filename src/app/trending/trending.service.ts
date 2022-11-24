import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Channel } from "../services/banned.service";

@Injectable({
  providedIn: 'root'
})
export class TrendingService {
  readonly videosCollection = collection(this.firestore, 'messages');
  readonly videos$ = collectionData(this.videosCollection).pipe(map(((data) => {
    const set = new Set();

    return data
      .map(a => JSON.parse(a?.['trending'] || '[]'))
      .reduce((a: Channel[], b) => ([...a, ...b]), [])
      .filter((a: Channel) => {
        if (set.has(a.id)) {
          return false;
        }

        set.add(a.id);
        return true;
      })
  })));

  readonly languages$ = this.videos$.subscribe((videos: any[]) => {
    const languages = new Set(
      videos
        .map(v => v.snippet.defaultLanguage)
        .filter(l => !!l)
        .map(l => l.slice(0, 2))
    );
  })

  constructor(private readonly firestore: Firestore) {
  }

  getTrendingVideos(): Observable<any> {
    return this.videos$.pipe(map((result: any) => {
      return result || [];
    }));
  }
}

