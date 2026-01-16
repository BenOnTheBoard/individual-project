import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlgorithmRetrievalService } from 'src/app/algorithm-retrieval.service';
import { CanvasService } from '../services/canvas/canvas.service';
import { PlaybackService } from '../services/playback/playback.service';
import { MatInputModule } from '@angular/material/input';
import { UtilsService } from '../../utils/utils.service';
import { AgentCountFormComponent } from 'src/app/forms/agent-count-form/agent-count-form.component';

@Component({
  selector: 'app-edit-preferences-dialog',
  templateUrl: './edit-preferences-dialog.component.html',
  styleUrls: ['./edit-preferences-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    AgentCountFormComponent,
  ],
})
export class EditPreferencesDialogComponent implements OnInit {
  @ViewChild(AgentCountFormComponent, { static: true })
  agentForm!: AgentCountFormComponent;

  group1Preferences: Map<string, Array<string>> = new Map();
  group2Preferences: Map<string, Array<string>> = new Map();

  keyList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  equalGroups: boolean = false;
  group1Plural = this.algorithmService.pluralMap.get(
    this.algorithmService.currentAlgorithm.orientation[0]
  );
  group2Plural = this.algorithmService.pluralMap.get(
    this.algorithmService.currentAlgorithm.orientation[1]
  );

  @Input() algorithm: Algorithm;

  missingPreferences: string[][];
  missingPreferencesGroup1: string[][];
  missingPreferencesGroup2: string[][];

  preferenceTextGroup1 = [];
  preferenceTextGroup2 = [];

  valid: boolean = true;

  constructor(
    public algorithmService: AlgorithmRetrievalService,
    public playbackService: PlaybackService,
    public canvasService: CanvasService,
    public utils: UtilsService,
    public dialogRef: MatDialogRef<EditPreferencesDialogComponent>,
    private _snackBar: MatSnackBar
  ) {}

  @HostListener('document:keydown.enter')
  onEnter() {
    if (this.isValidPreferences()) {
      if (!this.agentForm.isFormValid()) {
        this.callGenerateAlgorithmPreferences();
      }
    }
  }

  ngOnInit(): void {
    this.group1Preferences =
      this.playbackService.commandList[0]['group1CurrentPreferences'];
    this.group2Preferences =
      this.playbackService.commandList[0]['group2CurrentPreferences'];

    if (this.algorithmService.currentAlgorithm.equalGroups) {
      this.equalGroups = true;
    }
    this.generatePreferenceString();
  }

  // calls correct function to generate algoirhtm preferences - based on current alg
  callGenerateAlgorithmPreferences(): void {
    if (
      this.algorithmService.currentAlgorithm.name == 'Stable Roommates Problem'
    ) {
      console.log('input value', this.agentForm.getGroup1AgentCount());
      if (this.agentForm.getSRAgentCount() % 2 == 0) {
        this.generateAlgorithmPreferences1Group();
      }
    } else {
      this.generateAlgorithmPreferences();
    }
  }

  generatePreferenceString(): void {
    if (
      this.algorithmService.currentAlgorithm.name == 'Stable Roommates Problem'
    ) {
      this.generateSRPreferenceString();
    } else {
      this.generateBipartitePreferenceString();
    }
  }

  generateBipartitePreferenceString(): void {
    this.preferenceTextGroup1 = [];
    this.preferenceTextGroup2 = [];

    this.missingPreferences = [];

    this.missingPreferencesGroup1 = [];
    this.missingPreferencesGroup2 = [];

    const group1Count = this.agentForm.getGroup1AgentCount();
    const group2Count = this.equalGroups
      ? this.agentForm.getGroup1AgentCount()
      : this.agentForm.getGroup2AgentCount();

    if (
      this.algorithmService.numberOfGroup1Agents < group1Count ||
      this.algorithmService.numberOfGroup2Agents < group2Count
    ) {
      // if value has been changed
      let numbersToAdd: Array<string> = [];
      let lettersToAdd: Array<string> = [];

      for (
        let i = this.algorithmService.numberOfGroup2Agents + 1;
        i <= group2Count;
        i++
      ) {
        lettersToAdd.push(String.fromCharCode(i + 64));
      }

      for (
        let i = this.algorithmService.numberOfGroup1Agents + 1;
        i <= group1Count;
        i++
      ) {
        numbersToAdd.push(String(i));
      }

      // ADDS TEXT TO TEXT BOXES

      // GROUP 1 //
      // addes pre-generated rankings
      for (let agent of this.group1Preferences) {
        // filter out value that are too large
        let agentCopy = Object.assign([], agent[1]);
        let safe_values = agentCopy.filter(
          (pref) => pref.charCodeAt(0) - 64 <= group2Count
        );

        this.preferenceTextGroup1.push(safe_values);
      }
      // adds new rankings to end of pre-generated rankings
      for (let index = 0; index < this.group1Preferences.size; index++) {
        this.preferenceTextGroup1[index] =
          this.preferenceTextGroup1[index].concat(lettersToAdd);
      }

      // adds new rankings
      for (
        let i = this.algorithmService.numberOfGroup1Agents;
        i <= group1Count - 1;
        i++
      ) {
        let newPreferences = Array.from(this.group1Preferences.values())[0]
          .concat(lettersToAdd)
          .filter((pref) => pref.charCodeAt(0) - 64 <= group2Count);
        this.utils.shuffle(newPreferences);
        this.preferenceTextGroup1.push(newPreferences);
      }

      // GROUP 2 //
      // addes pre-generated rankings
      for (let agent of this.group2Preferences) {
        let agentCopy = Object.assign([], agent[1]);
        this.preferenceTextGroup2.push(agentCopy);
      }
      // adds new rankings to end of pre-generated rankings
      for (let index = 0; index < this.group2Preferences.size; index++) {
        this.preferenceTextGroup2[index] =
          this.preferenceTextGroup2[index].concat(numbersToAdd);
      }
      // adds new rankings
      for (
        let i = this.algorithmService.numberOfGroup2Agents;
        i <= group2Count - 1;
        i++
      ) {
        let newPreferences = Array.from(this.group2Preferences.values())[0]
          .concat(numbersToAdd)
          .filter((pref) => pref.charCodeAt(0) - 64 <= group2Count);
        this.utils.shuffle(newPreferences);
        this.preferenceTextGroup2.push(newPreferences);
      }
    } else {
      // ADDS TEXT TO THE TEXT BOXES - if value has not been changed or is lower

      // GROUP 1 //
      let counter = 0;
      // for each ranking
      for (let agent of this.group1Preferences) {
        // stop adding rankings if the number added is equal to the number needed
        if (counter >= group1Count) {
          break;
        }
        // filter out values in the ranking which are too large
        let agentCopy = Object.assign([], agent[1]);
        let safe_values = agentCopy.filter(
          (pref) => pref.charCodeAt(0) - 64 <= group2Count
        );
        // add rankning
        this.preferenceTextGroup1.push(safe_values);
        counter++;
      }

      // GROUP 2 //
      counter = 0;
      // for each ranking
      for (let agent of this.group2Preferences) {
        // stop adding rankings if the number added is equal to the number needed
        if (counter >= group2Count) {
          break;
        }
        // filter out values in the ranking which are too large
        let agentCopy = Object.assign([], agent[1]);
        let safe_values = agentCopy.filter((pref) => pref <= group1Count);
        // add rankning
        this.preferenceTextGroup2.push(safe_values);
        counter++;
      }
    }
  }

  generateSRPreferenceString(): void {
    this.preferenceTextGroup1 = [];
    this.missingPreferences = [];

    this.missingPreferencesGroup1 = [];
    this.missingPreferencesGroup2 = [];

    const agentCount = this.agentForm.getSRAgentCount();

    if (this.algorithmService.numberOfGroup1Agents < agentCount) {
      // if value has been changed
      let numbersToAdd: Array<string> = [];

      for (
        let i = this.algorithmService.numberOfGroup1Agents + 1;
        i <= agentCount;
        i++
      ) {
        numbersToAdd.push(String(i));
      }

      // ADDS TEXT TO TEXT BOXES

      // GROUP 1 //
      // addes pre-generated rankings
      for (let agent of this.group1Preferences) {
        let agentCopy = Object.assign([], agent[1]);
        this.preferenceTextGroup1.push(agentCopy);
      }
      // adds new rankings to end of pre-generated rankings
      for (let index = 0; index < this.group1Preferences.size; index++) {
        this.preferenceTextGroup1[index] =
          this.preferenceTextGroup1[index].concat(numbersToAdd);
      }
      // adds new rankings
      for (
        let i = this.algorithmService.numberOfGroup1Agents;
        i <= agentCount - 1;
        i++
      ) {
        let newPreferences = Array.from(this.group1Preferences.values())[0]
          .concat(numbersToAdd)
          .filter((pref) => pref.charCodeAt(0) - 64 != i);

        newPreferences = [];

        // loop through range number of agents - add number to list unless it is equal to the agent key/name
        for (let j = 1; j < agentCount + 1; j++) {
          if (j != i + 1) {
            newPreferences.push(String(j));
          }
        }

        this.utils.shuffle(newPreferences);
        this.preferenceTextGroup1.push(newPreferences);
      }
    } else {
      // ADDS TEXT TO THE TEXT BOXES - if value has not been changed or is lower

      // GROUP 1 //
      let counter = 0;
      // for each ranking
      for (let agent of this.group1Preferences) {
        // stop adding rankings if the number added is equal to the number needed
        if (counter >= agentCount) {
          break;
        }
        // filter out values in the ranking which are too large
        let agentCopy = Object.assign([], agent[1]); //.sort()
        let safe_values = agentCopy.filter((pref) => pref <= agentCount);
        // add rankning
        this.preferenceTextGroup1.push(safe_values);
        counter++;
      }
    }
  }

  /////////////////////////////////////////////////////////////

  isValidPreferences(): boolean {
    // CREATES ARRAYS FROM THE STRING
    // GROUP 1
    for (let index = 0; index < this.preferenceTextGroup1.length; index++) {
      // if input is new/a string - split by comma
      if (typeof this.preferenceTextGroup1[index] != typeof []) {
        let arr = this.preferenceTextGroup1[index].split(',');
        this.preferenceTextGroup1[index] = arr;
      }
    }

    // GROUP 2
    for (let index = 0; index < this.preferenceTextGroup2.length; index++) {
      // if input is new/a string - split by comma
      if (typeof this.preferenceTextGroup2[index] != typeof []) {
        let arr = this.preferenceTextGroup2[index].split(',');
        this.preferenceTextGroup2[index] = arr;
      }
    }

    switch (this.algorithmService.currentAlgorithm.name) {
      case 'Student Project Allocation':
        return this.SPAisvalid();
      case 'Stable Roommates Problem':
        return this.isValid1Group();
      default:
        return this.isValid();
    }
  }

  generateAlgorithmPreferences(): void {
    //// UPDATE REAL PREFERANCES
    // fill out new preferences
    let newPreferences: Map<String, Array<String>> = new Map();

    // GROUP 1
    let num = 1;
    for (let agent of this.preferenceTextGroup1) {
      newPreferences.set(num.toString(), agent);
      num++;
    }

    //GROUP 2
    if (
      this.algorithmService.currentAlgorithm.name !=
      'Student Project Allocation'
    ) {
      num = 1;
      for (let agent of this.preferenceTextGroup2) {
        newPreferences.set(String.fromCharCode(64 + num), agent);
        num++;
      }
    }

    var command =
      this.playbackService.commandList[
        this.playbackService.previousStepCounter
      ];
    let a = document.getElementById('line' + command['lineNumber']);
    a.style.backgroundColor = '';
    a.style.color = '';

    this.algorithmService.numberOfGroup1Agents =
      this.agentForm.getGroup1AgentCount();
    this.algorithmService.numberOfGroup2Agents =
      this.agentForm.getGroup2AgentCount();

    this.canvasService.initialise();
    this.playbackService.setAlgorithm(
      this.algorithmService.currentAlgorithm.id,
      this.algorithmService.numberOfGroup1Agents,
      this.algorithmService.numberOfGroup2Agents,
      newPreferences
    );

    this.dialogRef.close();

    this._snackBar.open('Preferences changed', 'Dismiss', {
      duration: 2000,
    });
  }

  // function to disable/enable button - false = enabled / true = disabled
  isValid(): boolean {
    // values that should be in each list
    // letters

    let numbers = [];
    let letters = [];
    this.missingPreferences = [];

    this.missingPreferencesGroup1 = [];
    this.missingPreferencesGroup2 = [];

    let lettersValid = true;
    let numbersValid = true;

    // Gets all letters/numbers that should be in each preference
    for (let i = 1; i <= this.agentForm.getGroup2AgentCount(); i++) {
      letters.push(String.fromCharCode(i + 64));
    }
    for (let i = 1; i <= this.agentForm.getGroup1AgentCount(); i++) {
      numbers.push(String(i));
    }

    // GROUP 1
    for (let [key, ranking] of this.preferenceTextGroup1.entries()) {
      for (let char of letters) {
        if (!ranking.includes(char)) {
          // letter in ranking that is not supposed to be
          lettersValid = false;

          //input missing preferences
          this.missingPreferences.push([key + 1, char]);
          this.missingPreferencesGroup1.push([key + 1, char]);
        }
      }
      // checks for smae size
      if (ranking.length != letters.length) {
        lettersValid = false;
      }
    }

    // GROUP 2
    for (let [key, ranking] of this.preferenceTextGroup2.entries()) {
      for (let num of numbers) {
        if (!ranking.includes(num)) {
          // letter in ranking that is not supposed to be
          numbersValid = false;

          //input missing preferences
          this.missingPreferences.push([String.fromCharCode(65 + key), num]);
          this.missingPreferencesGroup2.push([
            String.fromCharCode(65 + key),
            num,
          ]);
        }
      }
      // checks for smae size
      if (ranking.length != numbers.length) {
        numbersValid = false;
      }
    }

    return lettersValid && numbersValid;
  }

  SPAisvalid() {
    // values that should be in each list
    // letters

    let letters = [];
    this.missingPreferences = [];

    this.missingPreferencesGroup1 = [];
    this.missingPreferencesGroup2 = [];

    let lettersValid = true;

    // Gets all letters/numbers that should be in each preference
    for (let i = 1; i <= this.agentForm.getGroup2AgentCount(); i++) {
      letters.push(String.fromCharCode(i + 64));
    }

    // GROUP 1
    for (let [key, ranking] of this.preferenceTextGroup1.entries()) {
      for (let char of letters) {
        if (!ranking.includes(char)) {
          // letter in ranking that is not supposed to be
          lettersValid = false;

          //input missing preferences
          this.missingPreferences.push([key + 1, char]);
          this.missingPreferencesGroup1.push([key + 1, char]);
        }
      }
      // checks for smae size
      if (ranking.length != letters.length) {
        lettersValid = false;
      }
    }

    return lettersValid;
  }

  generateAlgorithmPreferences1Group(): void {
    //// UPDATE REAL PREFERANCES

    // fill out new preferences
    let newPreferences: Map<String, Array<String>> = new Map();

    // GROUP 1
    let num = 1;
    for (let agent of this.preferenceTextGroup1) {
      newPreferences.set(num.toString(), agent);
      num++;
    }

    //GROUP 2
    num = 1;
    for (let agent of this.preferenceTextGroup2) {
      newPreferences.set(String.fromCharCode(64 + num), agent);
      num++;
    }

    var command =
      this.playbackService.commandList[
        this.playbackService.previousStepCounter
      ];
    let a = document.getElementById('line' + command['lineNumber']);
    a.style.backgroundColor = '';
    a.style.color = '';

    this.algorithmService.numberOfGroup1Agents =
      this.agentForm.getGroup1AgentCount();
    this.algorithmService.numberOfGroup2Agents =
      this.agentForm.getGroup2AgentCount();

    this.canvasService.initialise();
    this.playbackService.setAlgorithm(
      this.algorithmService.currentAlgorithm.id,
      this.algorithmService.numberOfGroup1Agents,
      this.algorithmService.numberOfGroup2Agents,
      newPreferences
    );

    this.dialogRef.close();

    this._snackBar.open('Preferences changed', 'Dismiss', {
      duration: 2000,
    });
  }

  // Checks is instance of SR (1 group matchings) is valid
  isValid1Group(): boolean {
    // values that should be in each list
    // letters

    let numbers = [];
    this.missingPreferences = [];
    this.missingPreferencesGroup1 = [];

    let numbersValid = true;

    // Gets all letters/numbers that should be in each preference
    for (let i = 1; i <= this.agentForm.getGroup1AgentCount(); i++) {
      numbers.push(String(i));
    }

    // GROUP 1
    for (let [key, ranking] of this.preferenceTextGroup1.entries()) {
      for (let num of numbers) {
        // ranking does not include value in numbers -
        if (!ranking.includes(num)) {
          // checks if the missing number is not the key, if its not the key then its a rouge number
          if (num != key + 1) {
            numbersValid = false;
            //input missing preferences
            this.missingPreferences.push([key + 1, num]);
            this.missingPreferencesGroup1.push([key + 1, num]);
          }
        }
      }
      // checks for correct length
      if (ranking.length != numbers.length - 1) {
        numbersValid = false;
      }
    }

    return numbersValid;
  }
}
