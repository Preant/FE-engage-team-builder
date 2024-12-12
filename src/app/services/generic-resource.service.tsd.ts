import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Resource } from '@/app/models/Resource.model';

@Injectable()
export abstract class GenericResourceService<T extends Resource> {
  protected resourceSignal: WritableSignal<T[]> = signal<T[]>([]);
  readonly resources: Signal<T[]> = this.resourceSignal.asReadonly();

  protected constructor(
        protected http: HttpClient,
        protected dataPath: string
  ) {
  }

  public getResourceById(id: number): T {
    const resource: T | undefined = this.resourceSignal().find((resource: T): boolean => resource.id === id);
    if (!resource) {
      throw new Error(`Resource with id ${id} not found.`);
    }
    return resource;
  }

  public getResourceByIdentifier(identifier: string): T | undefined {
    return this.resourceSignal().find((resource: T): boolean => resource.identifier === identifier);
  }

  public async loadResourcesInformation(): Promise<void> {
    try {
      const resources: T[] = await firstValueFrom(
        this.http.get<T[]>(this.dataPath)
      );
      this.resourceSignal.set(resources);
    } catch (error) {
      console.error(`Error fetching resources:`, error);
      throw error;
    }
  }
}
