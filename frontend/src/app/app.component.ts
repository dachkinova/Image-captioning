import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUploadService } from './uploadFiles.service';

export interface Info {
  value : number,
  fileName: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedFiles?: File;
  selectedFileNames: string;
  progressInfos?: Info;
  message: string[] = [];
  preview: string;
  isLoading:boolean=false;
  desc:any = '';

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {}

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = undefined;
    this.selectedFileNames = '';
    this.desc='';
    this.selectedFiles = event.target.files[0];

    this.preview = '';
    if (this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result);
        this.preview = e.target.result;
      };

      reader.readAsDataURL(this.selectedFiles);
      this.selectedFileNames = this.selectedFiles.name;
    }
  }

  upload( file: File): void {
    this.progressInfos = { value: 0, fileName: file.name };

    if (file) {
      this.isLoading=true;
      this.uploadService.upload(file).subscribe(
        (res: any) => {
          this.isLoading=false;
          this.desc = res;
          // if (event.type === HttpEventType.UploadProgress) {
          //   this.progressInfos!.value = Math.round(
          //     (100 * event.loaded) / event.total
          //   );
          // } else if (event instanceof HttpResponse) {
          //   const msg = 'Uploaded the file successfully: ' + file.name;
          //   this.message.push(msg);
          // }
        },
        (err: any) => {
          this.isLoading=false;
          this.progressInfos!.value = 0;
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }
      );
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      this.upload(this.selectedFiles);
    }
  }

  delete(){
    this.message = [];
    this.progressInfos = undefined;
    this.selectedFileNames = '';
    this.preview='';
    this.selectedFiles = undefined;
    this.desc = '';
  }
}
