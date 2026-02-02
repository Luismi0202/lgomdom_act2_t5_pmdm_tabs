import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 tabs configured', () => {
    const tabs = fixture.debugElement.queryAll(By.css('ion-tab-button'));
    expect(tabs.length).toBe(5);
  });

  it('should have correct tab names', () => {
    const tabNames = ['home', 'search', 'favorites', 'stats', 'profile'];
    const tabs = fixture.debugElement.queryAll(By.css('ion-tab-button'));
    
    tabs.forEach((tab, index) => {
      expect(tab.attributes['tab']).toBe(tabNames[index]);
    });
  });

  it('should have correct icons for each tab', () => {
    const expectedIcons = ['home', 'search', 'star', 'stats-chart', 'person'];
    const icons = fixture.debugElement.queryAll(By.css('ion-icon'));
    
    icons.forEach((icon, index) => {
      const iconName = icon.attributes['name'] || icon.attributes['ng-reflect-name'];
      expect(iconName).toContain(expectedIcons[index]);
    });
  });

  it('should render tab labels', () => {
    const labels = fixture.debugElement.queryAll(By.css('ion-label'));
    expect(labels.length).toBe(5);
  });
});
