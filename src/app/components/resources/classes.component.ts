import { Component, inject, Signal } from '@angular/core';


import { ClassDetailComponent } from '@/app/components/resources/details/class-detail.component';
import { Class } from '@/app/models/Class.model';
import { ClassService } from '@/app/services/resources.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [ClassDetailComponent],
  template: `
        <div class="min-h-screen p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            @for (combatClass of classes(); track combatClass.id) {
                <app-class-detail [classData]="combatClass"/>
            }
        </div>
    `
})
export class ClassesComponent {
  private readonly classService: ClassService = inject(ClassService);
  classes: Signal<Class[]> = this.classService.resources;
}
