import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {


  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      domain: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      location: [null, [Validators.required]]
    });

  }


  submitForm():void {

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

  }
  onBack(): void {
    console.log('onBack');
  }

}
