import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Resource } from '@/app/models/Resource.model';

@Injectable()
export abstract class GenericResourceService<T extends Resource> {
  protected resources: WritableSignal<T[]> = signal<T[]>([]);

  protected constructor(
        protected http: HttpClient,
        protected dataPath: string
  ) {
  }

  public getResources(): Signal<T[]> {
    return this.resources.asReadonly();
  }

  public getResourceById(id: number): T | undefined {
    return this.resources().find((resource: T): boolean => resource.id === id);
  }

  public getResourceByIdentifier(identifier: string): T | undefined {
    return this.resources().find((resource: T): boolean => resource.identifier === identifier);
  }

  public async loadResourcesInformation(): Promise<void> {
    try {
      const resources: T[] = await firstValueFrom(
        this.http.get<T[]>(this.dataPath)
      );
      this.resources.set(resources);
    } catch (error) {
      console.error(`Error fetching resources:`, error);
      throw error;
    }
  }
}
