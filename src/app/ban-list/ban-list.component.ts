import { Component, OnInit } from '@angular/core';
import { BannedService } from "../services/banned.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-ban-list',
  templateUrl: './ban-list.component.html',
  styleUrls: ['./ban-list.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class BanListComponent implements OnInit {
  constructor(readonly banService: BannedService) {
  }

  ngOnInit(): void {
  }


  unban(id: string) {
    this.banService.unbanChannel(id);
  }
}
