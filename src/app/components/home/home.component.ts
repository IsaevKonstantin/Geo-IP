import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { IGeolocation } from 'src/app/models/geolocation.model';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ApiService]
})
export class HomeComponent implements OnInit, OnDestroy {
  public Form: FormGroup;
  public geoData: IGeolocation | null = null;
  public downloadUrl: SafeUrl | any;
  public loading: boolean = false;
  private _ip: string = '';
  private _subscriber$: Subject<null> = new Subject<null>();

  constructor(
    private _apiService: ApiService,
    private _sanitizer: DomSanitizer,
    private _toastService: ToastService
  ) {
    this.Form = new FormGroup({
      "address": new FormControl('', [
        Validators.required,
        Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        )
      ])
    })
  }

  public ngOnInit(): void {
    this.setMyIp();
  }

  public ngOnDestroy(): void {
    this._subscriber$.next(null);
    this._subscriber$.complete();
}

  public search(): void {
    this.getFormValue();
    this.loading = true;
    this._apiService.getGeolocationByIP(this._ip)
    .pipe(takeUntil(this._subscriber$))
    .subscribe((geolocationData) => {
      this.loading = false;
      if (geolocationData.status === 'fail') {
        this.geoData = null;
        this._toastService.showToast('error', geolocationData.status ?? 'Error', geolocationData.message ?? 'Информация не найдена ;(');
      } else {
        this.geoData = geolocationData;
        this._toastService.showToast('success', geolocationData.status ?? 'Success', geolocationData.message ?? 'Успешно!');
        this.downloadUrl = this.createDownloadUrl();
      }
    })
  }

  private createDownloadUrl(): SafeUrl {
    const data = JSON.stringify(this.geoData);
    const url = this._sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(data)
    );
    return url;
  }

  private setMyIp(): void {
    this._apiService.getIp()
    .pipe(takeUntil(this._subscriber$))
    .subscribe((ipData) => {
      if (ipData) {
        this.Form.controls['address'].setValue(ipData.IPv4);
        this.search();
      } else {
        this._toastService.showToast('error', 'Error', 'Произошла ошибка!');
      }
    })
  }

  private getFormValue(): void {
    this._ip = this.Form.controls['address'].value;
  }
}
