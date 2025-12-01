import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { Algorithm } from '../../../Algorithm';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

declare var anime: any;

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'algorithm-card',
  templateUrl: './algorithm-card.component.html',
  styleUrls: ['./algorithm-card.component.scss', '../../home-page.component.scss', '../../home-content/home-content.component.scss'],
  imports: [
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      ReactiveFormsModule,
      CommonModule,
      FormsModule
    ]
})
export class AlgorithmCardComponent implements OnInit {

  @Input() algorithm: Algorithm;


  numberOfGroup1Agents = new FormControl<number |null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9),
  ]);

  numberOfGroup2Agents = new FormControl<number|null>(null, [
    Validators.required,
    Validators.min(1),
    Validators.max(9)
  ]);

  SReven: boolean = true


  evenOnly(event): void {

    // console.log("evenOnly", event, this.numberOfGroup1Agents.value)
    if (this.numberOfGroup1Agents.value % 2 == 1) {
      this.SReven = false
    } else {
      this.SReven = true
    }
  }


  isValid(): boolean {

    // console.log("event", this.numberOfGroup1Agents)

    return false

  }



  // matcher = new MyErrorStateMatcher();

  constructor(public algorithmService: AlgorithmRetrievalService, public router: Router) { }

  ngOnInit(): void {
  }


  // on clicking "Generate Preferences" change the global algorithm to the one passed into this dialog
  async onGeneratePreferences(): Promise<void> {

    this.algorithmService.currentAlgorithm = this.algorithm;

    // makes sure the SR value is not odd or too large 
    if (this.algorithmService.currentAlgorithm.id == "smp-room-irv") {
      if (this.numberOfGroup1Agents.value % 2 == 1) {
        this.algorithmService.numberOfGroup1Agents = this.numberOfGroup1Agents.value + 1

        
        if (this.algorithmService.numberOfGroup1Agents == 10){
          this.algorithmService.numberOfGroup1Agents = 8
        }

      } else {
        this.algorithmService.numberOfGroup1Agents = this.numberOfGroup1Agents.value
      }
    } else {
      this.algorithmService.numberOfGroup1Agents = this.numberOfGroup1Agents.value;
    }


    if (this.numberOfGroup2Agents.value) {
      this.algorithmService.numberOfGroup2Agents = this.numberOfGroup1Agents.value;

      
    } else {
      this.algorithmService.numberOfGroup2Agents = this.numberOfGroup2Agents.value;
    }


    anime({
      targets: '.main-page',
      easing: 'easeOutQuint',
      opacity: [1, 0],
      duration: 500
    })

    anime({
      targets: '.navbar',
      easing: 'easeOutQuint',
      translateY: [0, -150],
      opacity: [1, 0],
      delay: 300,
      duration: 500
    })

    await this.delay(700);

    this.router.navigateByUrl("/animation", { skipLocationChange: true });
  }


  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
