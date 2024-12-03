import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { WEAPON_DATA_PATH } from '@/app/config/config';
import { Weapon } from '@/app/models/Weapon.model';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  private weaponsDataPath: string = WEAPON_DATA_PATH;
  private weapons: WritableSignal<Weapon[]> = signal<Weapon[]>([]);

  constructor(private http: HttpClient) {
  }

  public getWeapons(): Signal<Weapon[]> {
    return this.weapons.asReadonly();
  }

  public getWeaponByIdentifier(name: string): Weapon | undefined {
    return this.weapons().find((weapon: Weapon): boolean => weapon.identifier === name);
  }

  public async loadWeaponsInformation(): Promise<void> {
    try {
      const weapons: Weapon[] = await firstValueFrom(
        this.http.get<Weapon[]>(this.weaponsDataPath)
      );
      this.weapons.set(weapons);
    } catch (error) {
      console.error('Error fetching weapons:', error);
      throw error;
    }
  }
}
