import { Component, ɵdetectChanges } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TrendingService } from "./trending.service";
import { CommonModule } from "@angular/common";
import { BannedService } from "../services/banned.service";

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class TrendingComponent {
  readonly videos$ = this.trendingService.getTrendingVideos();

  readonly filteredVideos$ = combineLatest([
    this.videos$,
    this.banService.bannedChannels$,
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
    this.banService.banChannel({id, title});
  }

  constructor(private readonly banService: BannedService,
              private readonly trendingService: TrendingService) {

  }

}
