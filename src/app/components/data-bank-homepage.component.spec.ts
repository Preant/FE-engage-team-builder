import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBankHomepageComponent } from './data-bank-homepage.component';

describe('DatabankHomepageComponent', () => {
    let component: DataBankHomepageComponent;
    let fixture: ComponentFixture<DataBankHomepageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DataBankHomepageComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DataBankHomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
