import { Component, OnInit, ViewChild } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType= ContactType;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages = {
    'firstname':{
      'required':     'Firstname is required.',
      'minlength':    'First Name must be at least 2 characters long.',
      'maxlength':    'FirstName cannot be more than 25 characters long.'
    },
    'lastname':{
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum':{
      'required': 'Tel num is required.',
      'pattern': 'Tel num must contain numbers.'
    },
    'email':{
      'required': 'Email is required.',
      'email': 'Email is not valid.'
    },

  };
    

  constructor(private fb: FormBuilder) { 
    this.createForm();
  }

  ngOnInit() {
  }

  createForm(){
    this.feedbackForm=this.fb.group({
      firstname:['', [Validators.required, Validators.minLength(2),Validators.maxLength(25)]],
      lastname:['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      telnum: [0, [Validators.required,Validators.pattern]],
      email: ['', [Validators.required,Validators.required]],
      agree: false,
      contacttype: 'None',
      message:''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set validation message now
  }

  onValueChanged(data?: any){
    if(!this.feedbackForm){return;} //if this form is empty return nothing

    const form = this.feedbackForm;
    for( const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field]=''; //clear previous error message if any

        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const message = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += message[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.feedback=this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname:'',
      lastname:'',
      telnum:0,
      email:'',
      agree:false,
      contacttype:'None',
      message:''
    });

   

    this.feedbackFormDirective.resetForm();
  }

}
