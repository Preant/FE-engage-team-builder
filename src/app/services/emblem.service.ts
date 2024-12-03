import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

import { EMBLEM_DATA_PATH } from '@/app/config/config';
import { Emblem } from '@/app/models/Emblem.model';

@Injectable({
  providedIn: 'root'
})
export class EmblemService {
  private emblemDataPath: string = EMBLEM_DATA_PATH;
  private emblems: WritableSignal<Emblem[]> = signal<Emblem[]>([]);

  constructor(private http: HttpClient) {
    this.loadEmblemsInformation();
  }

  public getEmblems() {
    return this.emblems.asReadonly();
  }

  public getEmblemByName(name: string): Emblem | undefined {
    return this.emblems().find((emblem: Emblem) => emblem.resourceIdentifier === name);
  }

  private loadEmblemsInformation(): void {
    this.http.get<Emblem[]>(this.emblemDataPath).subscribe({
      next: (emblems: Emblem[]): void => {
        this.emblems.set(emblems);
      },
      error: (error: any): void => {
        console.error('Error fetching emblems:', error);
      }
    });
  }
}
