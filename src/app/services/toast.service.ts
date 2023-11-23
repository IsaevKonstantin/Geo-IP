import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(
        private _messageService: MessageService,
    ) {
    }

    public showToast(severity: string, summary: string, messageContent: string): void {
        this._messageService.add({ severity: severity, summary: summary, detail: messageContent });
    }
}