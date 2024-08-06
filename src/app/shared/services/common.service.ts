import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(
        // private notification: NzNotificationService
    ) { }

    showMessage(type, content, title = 'Thông báo') {
        // this.notification.success()
    }

    listProvince$ = new BehaviorSubject([])
    listDistrict$ = new BehaviorSubject([])
    listWard$ = new BehaviorSubject([])

    loaderService(): Promise<any> {
        return new Promise(resolve => {


            // this.httpClient.get().subscribe(
            //   ()=>{
            //   this.translateService.setTranslation('en_US',en_US_PRO);
            //   this.translateService.setDefaultLang('en_US')
            // },
            //   ()=>{},
            //   ()=>{resolve(null);})
            // let user = this.apiService.getUserInfo()
            // if(this.auth.isLogin()){
            //     forkJoin(this.branchService.fetchAll(), this.branchService.fetchFlatData(), user).subscribe({
            //         next: ([, , user]) => {
            //             console.log(user)
            //             this.auth.profile.next(user)
            //         },
            //         error: e => {
            //             console.log(e)
            //         }
            //     })
            // }
            // this.translateService.setTranslation('en-US', pro_en_US);
            // this.translateService.setDefaultLang('en-US');
            // // this.translateService.setTranslation('zh-CN', pro_zh_CN);
            // // this.translateService.setDefaultLang('zh-CN');
            // this.aclService.setAbility([1, 2])
            resolve(null)
        });
    }
}



/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}
