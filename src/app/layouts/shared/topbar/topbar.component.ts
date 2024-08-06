import { WorkspaceComponent } from './../../../account/auth/workspace/workspace.component';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';
import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from 'src/app/shared/services/api.service';
import { EventService } from 'src/app/core/services/event.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  pageSize = 10
  pageIndex = 1
  totalElements = 2
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Thailand', flag: 'assets/images/flags/tha.jpeg', lang: 'th' },
    { text: 'China', flag: 'assets/images/flags/cn.png', lang: 'cn' },
    // { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    // { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    // { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    // { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];
  // workspaceId = JSON.parse(localStorage.getItem('workspace')).id;
  data: any;
  role = JSON.parse(localStorage.getItem('currentUser')).role;
  listData: any;
  listWorkspace: any[];
  // nameWorkspace = localStorage.getItem('workSpace1');
  nameWorkspace = localStorage.getItem('workSpaceName');

  // tableName/
  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(DOCUMENT) private document: any,
    // private eventService: EventService,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    public languageService: LanguageService,
    public cookiesService: CookieService) {
    this.currentUser = this.authFackservice.currentUserValue;
  }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();

  currentUser
  ngOnInit(): void {
    this.fetchData();
    // console.log(this.role);
    // this.updateStatus();
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };
    // setInterval(() => this.updateStatus(), 300000)

    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.jpg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
  editProfile() {
    this.router.navigate(['/edit-profile']);
  }
  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }


  getWorkspaceIdByCode(workspaceCode: string): string {
    const workspace = this.listData.find(data => data.code === workspaceCode);
    return workspace ? workspace['id'] : '';
  }

  changeWorkspace(workspaceCode: string, workspaceName: string) {
    this.activeWorkspace = workspaceCode;
    const workspaceId = this.getWorkspaceIdByCode(workspaceCode);
    //   this.listData.forEach(data => {
    //     data.isActive = (data.name === workspaceCode);
    // });
    localStorage.setItem('workspace', workspaceId);
    localStorage.setItem('workSpaceCode', workspaceCode);
    localStorage.setItem('workSpace1', workspaceName);
    // localStorage.setItem('workSpaceCode', workspaceCode);

    window.location.reload();
  }
  /**
 * Fullscreen method
 */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  // workspace
  // activeWorkspace: string = this.workspaceId
  workSpace: string = localStorage.getItem('workSpace1');
  workSpaceCode: string = localStorage.getItem('workSpaceCode');
  activeWorkspace: string = this.workSpaceCode;

  setActiveWorkspace(workspaceCode: string) {
    this.activeWorkspace = workspaceCode;
  }


  //updateStatus 
  updateStatus() {
    this.apiService.updateStatus('devices/update-status').subscribe({
      next: (res) => {
      }
    })
  }
  //choose workspace
  fetchData(params = '') {
    // this.eventService.setLoading(true)
    params = '&order=updated_at&direction=desc'
    if (this.role === 'user') {
      this.apiService.getList('workspaces' + `?page=${this.pageIndex}&limit=${this.pageSize}${params}`
      ).subscribe({
        next: (res) => {

          this.data = res
          this.listData = res['workspaces'] ? res['workspaces'] : [];
          // console.log(this.workSpace);

        }
      })
    }
  }
  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
    localStorage.setItem('lang', lang)
  }


  /**
   * Logout the user
   */
  logout() {
      // this.apiService.exportExcel('auth/logout').subscribe({
      //   next: (res) => {
      //   }
      // });
    this.authFackservice.logout();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/account/login']);
  }
}
 