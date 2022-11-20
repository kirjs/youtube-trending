import { Injectable } from '@angular/core';
import { collection, doc, docData, Firestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";


interface Trending {
  trending: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrendingService {
  readonly videosCollection = collection(this.firestore, 'messages');
  readonly videos$ = from(docData(doc(this.videosCollection, 'latest')));

  constructor(private readonly firestore: Firestore) {
  }


  getTrendingVideos(): Observable<any> {
    return this.videos$.pipe(map((a: any) => {
      const result = JSON.parse(a.trending);
      return result?.data?.items || [];
    }));
  }
}

