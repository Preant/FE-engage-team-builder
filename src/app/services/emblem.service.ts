import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { EMBLEM_DATA_PATH } from '@/app/config/config';
import { Emblem } from '@/app/models/Emblem.model';

@Injectable({
  providedIn: 'root'
})
export class EmblemService {
  private emblemDataPath: string = EMBLEM_DATA_PATH;
  private emblems: WritableSignal<Emblem[]> = signal<Emblem[]>([]);

  constructor(private http: HttpClient) {
  }

  public getEmblems() {
    return this.emblems.asReadonly();
  }

  public getEmblemByName(name: string): Emblem | undefined {
    return this.emblems().find((emblem: Emblem) => emblem.resourceIdentifier === name);
  }

  public async loadEmblemsInformation(): Promise<void> {
    try {
      const emblems: Emblem[] = await
      firstValueFrom(
        this.http.get<Emblem[]>(this.emblemDataPath)
      );
      this.emblems.set(emblems);
    } catch (error) {
      console.error('Error fetching emblems:', error);
      throw error;
    }
  }
}
