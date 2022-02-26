import { Component,ChangeDetectorRef } from '@angular/core';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';

import { environment } from '../../../../../environments/environment';
import { RestRequestMethod } from '../../../../../app/core/data/rest-request-method';
import { DspaceRestService } from '../../../../../app/core/dspace-rest/dspace-rest.service';


export interface Patch {
  image: string;
  alt: string;
  title: string;
  url: string;
  accent: string;
  action: string;
  text: string;
}

const PATCHES:Patch[] =[
  { title: 'Sgilean Faclair', image: 'dictionary.jpg', alt: 'a dictionary, open', url: '/handle/1/121', accent: 'ey', action: 'Sgilean Faclair', text: 'Ionnsaich mu na diofar dhòighean anns am bi daoine a’ cleachdadh faclair.' },
  { title: 'Sìm Seunta', image: 'simseunta_nigh.jpg',  alt: 'a red cheeked man with a hat',url: '/handle/1/255', accent: 'ey', action: 'Sìm Seunta agus an Nigheadaireachd', text: 'Bha Sìm Seunta tric a’ dèanamh gheasan. (Storyworlds 3)' },
  { title: 'Raghnall Reubaire', image: 'raghnallrsanad.jpg',  alt: 'a pirate', url: '/handle/1/237', accent: 'ey', action: 'Raghnall Reubaire Agus An Ad', text: '’S e reubaire a bh’ ann an Raghnall. (Storyworlds 4)' },
  { title: 'Na Mathain', image: 'mathanmhil.jpg',  alt: 'bears eating honey', url: '/handle/1/270', accent: 'bs', action: 'Na Mathain agus a’ Mhil', text: 'Uair a bha siud bha dà mhathan ann. (Storyworlds 2)' },
  { title: 'Matamataig', image: 'ww1.jpg',  alt: 'a bar graph', url: '/handle/1/116', accent: 'bs', action: 'Matamataig', text: 'Cruthaich clàr no graf a’ cleachdadh an fhiosrachadh a th’ air a thoirt dhut.' },
  { title: 'Cò Tha Seo?', image: 'cothaseo.jpg',  alt: 'cats hiding', url: '/handle/1/191', accent: 'bs', action: 'Cò Tha Seo?', text: 'Seo piseag. ’S e Coco an t-ainm a th’ oirre. (Storyworlds 1)' },
  { title: 'Bingo', image: 'bingocnaimh.jpg',  alt: 'a black and white dog digging', url: '/handle/1/288', accent: 'as', action: 'Bingo agus an Cnàimh', text: 'Seo Bingo. ’S e cuilean beag dubh agus geal a th’ ann. (Storyworlds 2)' },
  { title: 'Drochaid Shruighlea', image: 'stirlingbridge.jpg', alt: 'stirling bridge', url: '/handle/1/143', accent: 'as', action: 'Drochaid Shruighlea', text: 'Ionnsaich mu Blàr Drochaid Shruighlea leis an taisbeanadh inntinneach seo.' },
  { title: 'Mata Mòr', image: 'colabreithmm.jpg', alt: 'a giant', url: '/handle/1/185', accent: 'as', action: 'Co-là-breith Mhata Mhòir', text: 'Seo Mata Mòr. ’S e fuamhaire a th’ ann. (Storyworlds 1)' },
];


@Component({
  selector: 'ds-home-news',
  styleUrls: ['./home-news.component.scss'],
  //styleUrls: ['../../../../../app/home-page/home-news/home-news.component.scss'],
  templateUrl: './home-news.component.html'
  //templateUrl: '../../../../../app/home-page/home-news/home-news.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class HomeNewsComponent extends BaseComponent {

  items:any = [];

  authors:any = [];
  subjects:any = [];
  
  staticPatches:Patch[]=[];
  noOfPatches:number=3;

  constructor(
    private restService: DspaceRestService,
    private changeDetector: ChangeDetectorRef
  ) {
      super();

      for (let i=0; i<this.noOfPatches; i++) {
        const randomInt = this.getRandomInt(i*this.noOfPatches, this.noOfPatches * i + this.noOfPatches );
        
        this.staticPatches.push(PATCHES[ randomInt ]);
      }
  }

  private getRandomInt(min,max):number {
    return Math.floor(Math.random() * (max-min) +min);
  }

  ngOnInit() {
      // The path to the REST discovery endpoint for recent items (the carousel)
      const discoveryApiEndpoint = environment.rest.baseUrl + '/api/discover/browses/dateissued/items?size=10&sort=dateissued,desc';

      // author & subject facet endpoint
      const authorEndpoint = environment.rest.baseUrl + '/api/discover/facets/author?size=10';
      const subjectEndpoint = environment.rest.baseUrl + '/api/discover/facets/subject?size=10';
      
      this.restService.request(
        RestRequestMethod.GET,
        discoveryApiEndpoint,
      ).subscribe(results => {
        
        this.items = results.payload._embedded.items;

        for(let i=0; i<this.items.length; i++) {
          const thumb = this.items[i]._links.thumbnail.href;
          this.restService.request(
            RestRequestMethod.GET,
            thumb).subscribe (r2 => {
              this.items[i].thumbnailUrl = r2.payload._links.content.href;
            });
        }

        this.changeDetector.markForCheck();
      });

      this.restService.request(
        RestRequestMethod.GET,
        authorEndpoint)
      .subscribe(results => {
        
        this.authors = results.payload._embedded.values;
        this.changeDetector.markForCheck();
        
      });

      this.restService.request(
        RestRequestMethod.GET,
        subjectEndpoint)
      .subscribe(results => {
        
        this.subjects = results.payload._embedded.values;
        this.changeDetector.markForCheck();
      });
  }

  

}

