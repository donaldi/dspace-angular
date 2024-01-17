import { TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemListElementComponent } from './item-list-element.component';
import { Item } from '../../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { of as observableOf } from 'rxjs';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { DSONameServiceMock } from '../../../../mocks/dso-name.service.mock';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment.test';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../../../../shared/testing/active-router.stub';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.date.issued': [
      {
        language: 'en_US',
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is the abstract'
      }
    ]
  }
});

describe('ItemListElementComponent', () => {
  let comp;
  let fixture;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [TruncatePipe, TranslateModule.forRoot()],
    declarations: [ItemListElementComponent],
    providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: APP_CONFIG, useValue: environment },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useValue: {} },
    ],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(ItemListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the publication is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a PublicationListElementComponent`, () => {
      const publicationListElement = fixture.debugElement.query(By.css(`ds-item-search-result-list-element`));
      expect(publicationListElement).not.toBeNull();
    });
  });
});
