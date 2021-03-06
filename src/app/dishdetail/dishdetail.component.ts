import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseURL } from '../shared/baseurl';
import { visibility, flyInOut, expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishcopy: Dish;

  errMess: string;

  dishIds: string[];
  prev: string;
  next: string;

  commentForm: FormGroup;
  comment: Comment;
  @ViewChild('cform') commentFormDirective;

  visibility = 'shown';



  commentFormErrors = {
    'author':'',
    'rating': '',
    'comment':''
  };

  validationMessage = {
    'author':{
      'required': 'Name is required.',
      'minlength':'Name should be at least 2 character.'
    },
    'rating':{
      'required': 'Rating is required.'
    },
    'comment':{
      'required': 'Comment is required',
      'minlength': 'Comment should be at least 2 characters.'
    },

  };

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private CF: FormBuilder,
    @Inject ('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility='hidden'; return this.dishService.getDish(params['id']);}))
      .subscribe((dish) => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = errmess);
  }

  createForm(){
    this.commentForm = this.CF.group({
      author:['', [Validators.required, Validators.minLength(2)]],
      rating:[5, Validators.required],
      comment:['', [Validators.required, Validators.minLength(2)]]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); //(re)set validation message now

  }

  onValueChanged(data?: any){
    if(!this.commentForm){return;} //if this form is empty return nothing

    const cForm= this.commentForm;
    for(const field in this.commentFormErrors){
      if(this.commentFormErrors.hasOwnProperty(field)){
        this.commentFormErrors[field]=''; //clear previous error message if any

        const ccontrol = cForm.get(field);
        if(ccontrol && ccontrol.dirty && !ccontrol.valid){
          const cmessage = this.validationMessage[field];
          for(const key in ccontrol.errors){
            if(ccontrol.errors.hasOwnProperty(key)){
              this.commentFormErrors[field] += cmessage[key] + '';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index +1) % this.dishIds.length];
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date=new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {this.dish = dish; this.dishcopy = dish;
      },
      errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess;});
      
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });

    this.commentFormDirective.resetForm({rating:5});
    
  }

  goBack(): void{
    this.location.back();
  }
}
