import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
// import { constants } from 'os';
import { DishService } from '../services/dish.service';
import { baseURL } from '../shared/baseurl';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})


export class MenuComponent implements OnInit {

  dishes: Dish[];

  constructor(private dishService: DishService,
    @Inject ('BaseURL') private BaseURL) { }

  ngOnInit(){
    this.dishService.getDishes()
      .subscribe((dishes) => this.dishes = dishes);
  }
  
}
