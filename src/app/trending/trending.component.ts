import { Component, ɵdetectChanges } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TrendingService } from "./trending.service";
import { CommonModule } from "@angular/common";

interface Channel {
  id: string;
  title: string;
}

const LOCAL_STORAGE_KEY = 'channels';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class TrendingComponent {
  readonly bannedChannels$ = new BehaviorSubject<Channel[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null') || [],
  );

  readonly videos$ = this.trendingService.getTrendingVideos();

  readonly filteredVideos$ = combineLatest([
    this.videos$,
    this.bannedChannels$,
  ]).pipe(
    map(([videos, bannedChannels]) => {
      return videos.filter(
        (video: any) =>
          !bannedChannels.find(
            channel => channel.id === video.snippet.channelId,
          ),
      );
    }),
    tap(() => {
      // TODO(kirjs): this is terrible / remove.
      requestAnimationFrame(() => {
        ɵdetectChanges(this);
      });
    }),
  );

  banChannel(id: string, title: string) {
    const current = this.bannedChannels$.getValue().filter(a => a.id !== id);
    this.bannedChannels$.next([...current, { id, title }]);
  }

  constructor(private trendingService: TrendingService) {
    this.bannedChannels$.subscribe(channels => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(channels));
    });
  }

  unban(id: string) {
    this.bannedChannels$.next(
      this.bannedChannels$.getValue().filter(a => a.id !== id),
    );
  }
}
