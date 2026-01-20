import { Injectable } from '@angular/core';
import { Algorithm } from './Algorithm';
import { HrResidentEgsService } from './algorithm-page/algorithms/algorithm-services/hr-resident-egs/hr-resident-egs.service';
import { EgsStableMarriageService } from './algorithm-page/algorithms/algorithm-services/smp-man-egs/egs-stable-marriage.service';
import { GsStableMarriageService } from './algorithm-page/algorithms/algorithm-services/smp-man-gs/gs-stable-marriage.service';
import { StableRoomIrvService } from './algorithm-page/algorithms/algorithm-services/smp-room-irv/stable-room-irv.service';
import { HrHospitalEgsService } from './algorithm-page/algorithms/algorithm-services/hr-hospital-egs/hr-hospital-egs.service';
import { SpaStudentEgsService } from './algorithm-page/algorithms/algorithm-services/spa-stu-egs/spa-student-egs.service';

// ------------------------------------------------------- ALGORITHM TEMPLATE

// [
//   "smp-man-egs", {
//     id: "smp-man-egs",
//     name: "Stable Marriage Problem",
//     orientation: ["Man", "Woman"],
//     algorithm: "Extended Gale-Shapley Stable Matching",
//     service: null,
//     description: "The stable marriage problem is the problem of finding a stable matching between two equally sized sets of elements. In this case: <b>men and women</b>.<br><br>To do this, the Extended Gale-Shapley Stable Marriage algorithm is used.",
//     helpTextMap: {

//     },
//   }
// ],

// -------------------------------------------------------

@Injectable({
  providedIn: 'root',
})
export class AlgorithmRetrievalService {
  currentAlgorithm: Algorithm;

  numberOfGroup1Agents: number = 5;
  numberOfGroup2Agents: number = 5;

  mapOfAvailableAlgorithms: Map<String, Algorithm> = new Map([
    [
      'smp-man-gs',
      {
        id: 'smp-man-gs',
        name: 'Stable Marriage Problem',
        orientation: ['Man', 'Woman'],
        equalGroups: true,
        algorithm: 'Gale-Shapley Algorithm',
        service: this.gsStableMarriageService,
        description:
          'The stable marriage problem is the problem of finding a one-to-one stable matching between two equally sized sets of agents: <b>men</b> and <b>women</b>.<br>Here we demonstrate the original Gale-Shapley algorithm.',
        helpTextMap: {
          1: 'Start with no matches between men and women.',
          2: 'While there are unmatched man, select the first one (%man%).',
          3: 'He selects %woman% because she is the next most preferred woman for %man% whom he has not yet proposed to.',
          4: 'We check to see whether %woman% has a match already.',
          5: '%woman% is free; match her with %man%.',
          6: '%woman% is currently matched to %match%, so we must compare %match% to %man%.',
          7: 'We check whether %woman% prefers %match% to %man%.',
          8: '%woman% prefers %man% to %match% so we free up %match% and assign %woman% to %man%.',
          9: '%woman% prefers %match% to %man%.',
          10: 'No change is made to the matching.',
          11: 'We have arrived at a stable matching.',
        },
        code: [
          'Set each person to be free',
          'While some man m is free do:',
          "\tw := next most preferred woman on m\'s list",
          '\tIf w is free then:',
          '\t\tAssign m to w',
          '\tElse:',
          "\t\tIf w prefers m to her current partner m\' then:",
          "\t\t\tAssign m to w and set m\' to be free",
          '\t\tElse:',
          "\t\t\tw rejects m and remains with m\'",
          'The current set of assignments is stable',
        ],
      },
    ],

    [
      'smp-man-egs',
      {
        id: 'smp-man-egs',
        name: 'Stable Marriage Problem',
        orientation: ['Man', 'Woman'],
        equalGroups: true,
        algorithm: 'Extended Gale-Shapley Algorithm',
        service: this.egsStableMarriageService,
        description:
          'The stable marriage problem is the problem of finding a one-to-one stable matching between two equally sized sets of agents: <b>men</b> and <b>women</b>.<br>Here we demonstrate a modified version of the original algorithm which will form the basis of the more complex algorithms on this page.',
        helpTextMap: {
          1: 'Start with no engagements between men and women.',
          2: 'While there are unengaged men, select the next one (%currentAgent%).',
          3: '%currentAgent% selects %potentialProposee% because she is the most preferred woman remaining on his list.',
          4: 'We check whether %woman% is engaged already.',
          5: '%woman% is engaged to %currentPartner%, so we break the engagement between them.',
          6: '%woman% is not engaged.',
          7: 'We engage %man% and %woman%.',
          8: "We loop over all the men on %woman%'s list whom she prefers %man% to.",
          9: "The next worst man on %woman%'s list is %nextWorstMan%.",
          10: "Remove %nextWorstMan% and %woman% from each other's lists.",
          11: 'All men to whom %woman% prefers %man% have been removed.',
          12: 'We have arrived at a stable matching.',
        },
        code: [
          'Set each person to be free',
          'While some man m is free {',
          "\tw := first woman on m's list",
          '\tIf w is currently engaged {',
          "\t\tBreak engagement between w and w's current partner",
          '\t}',
          '\tProvisionally engage m and w',
          "\tFor each successor m'' of m on w's list {",
          "\t\tm'' is the next worst man on w's preference list",
          "\t\tRemove m'' from w's preference list and vice versa",
          '\t}',
          '}',
        ],
      },
    ],

    [
      'hr-resident-egs',
      {
        id: 'hr-resident-egs',
        name: 'Hospitals/Residents Problem',
        orientation: ['Resident', 'Hospital'],
        equalGroups: false,
        algorithm: 'Capacitated Extended Gale-Shapley Algorithm',
        service: this.HrResidentEgsService,
        description:
          'The Hospitals/Residents Problem is the problem of finding a many-to-one stable matching between a set of <b>hospitals</b> and <b>residents</b>, where a hospital can be assigned multiple residents up to some capacity.',
        helpTextMap: {
          1: 'Start with no engagements between residents and hospitals.',
          2: "%currentAgent% is the next resident who doesn't have a hospital and still has some hospitals in their preference list.",
          3: '%currentAgent% selects %potentialProposee%,the first hospital left on its list.',
          4: 'We check if %hospital% is currently full. If not, we provisionally assign %resident% to %hospital%.',
          5: "%hospital%'s number of residents is equal to its max capacity, so choose the worst resident assigned to %hospital% (%worstResident%).",
          6: 'We unassign %hospital% and %worstResident%.',
          7: 'Assign %resident% to %hospital%.',
          8: 'We check if %hospital% is full after assigning %resident% to %hospital%.',
          9: "%hospital% is fully subscribed, so choose the worst resident assigned to them (%worstResident%) and remove each successor from %hospital%'s preference list.",
          10: '%hospital% selects %nextResident% as the next resident to be removed from its list.',
          11: "We remove %nextResident% from %hospital%'s list.",
          12: 'We have arrived at a stable matching.',
        },
        code: [
          'Set each hospital and resident to be completely free',
          'While (some resident r is free) and (r has a nonempty list):',
          "\th := first hospital on r's list",
          '\tIf h is fully subscribed then:',
          "\t\tr' := worst resident provisionally assigned to h",
          "\t\tAssign r' to be free (clear match)",
          '\tAssign r to h',
          '\tIf h is fully subscribed then:',
          '\t\ts := worst resident provisionally assigned to h',
          "\t\tFor each successor s' of s on h's list:",
          "\t\t\tRemove s' and h from each other's lists",
          'The current set of assignments is stable',
        ],
      },
    ],

    [
      'hr-hospital-egs',
      {
        id: 'hr-hospital-egs',
        name: 'Hospitals/Residents Problem',
        orientation: ['Hospital', 'Resident'],
        equalGroups: false,
        algorithm: 'Capacitated Extended Gale-Shapley Algorithm',
        service: this.HrHospitalEgsService,
        description:
          'The Hospitals/Residents Problem is the problem of finding a many-to-one stable matching between a set of <b>hospitals</b> and <b>residents</b>, where a hospital can be assigned multiple residents up to some capacity.',
        helpTextMap: {
          1: 'Start with no engagements between residents and hospitals.',
          2: '%hospital% is undersubscribed and has a resident on their preference list that is not assigned to them.',
          3: "%hospital% selects %resident% from hospital's preference list.",
          4: 'We check whether %resident% is assigned to another hospital.',
          5: 'We unassign %resident% and %oldHospital% from each other.',
          6: 'We assign %resident% and %hospital% to each other.',
          7: "We loop over each hospital h' which %resident% prefers %hospital% to on %resident%'s preference list.",
          8: "We remove %resident% AND %hospital% from each other's list.",
          9: 'We have arrived at a stable matching.',
        },
        code: [
          'Set each hospital and resident to be completely free',
          'While some hospital h is undersubscibed, and has a non-empty preference list:',
          "\tr := first resident on h's prefernace list not assigned to h",
          "\tIf r is assigned to another hospital h':",
          "\t\tUnassign r and h'",
          '\tProvisionally assign r to h',
          "\tFor each successor h' of h on r's list:",
          "\t\tRemove h' and r from each others preference list",
          'The current set of assignments is stable',
        ],
      },
    ],

    [
      'smp-room-irv',
      {
        id: 'smp-room-irv',
        name: 'Stable Roommates Problem',
        orientation: ['Person', 'Person'],
        equalGroups: true,
        algorithm: "Irving's Algorithm",
        service: this.StableRoomIrvService,
        description:
          'The stable roommates problem is the problem of finding a one-to-one stable matching amongst a single set of agents, which we thus refer to neutrally as <b>people</b>.<br>We demonstrate the algorithm due to Robert W. Irving.',
        helpTextMap: {
          1: 'Set all people to be free',
          2: 'While some person %person% has not been assigned to a anyone and has a non-empty preference list',
          3: "check if %person%'s preference list is empty",
          4: 'end the algorithm, there is no stable matching',

          5: "the first person on %person%'s preference list is selected - %selected%",
          6: 'set %person% to be provisonally assigned to selected person %selected%',

          7: 'check if any other person, other than %person% is assigned to %selected% ',
          8: 'If they are, then unassign them. unassign %old_person% from %selected%',

          9: "look through %selected%'s preference list - %list%, for each person less prefered than %person%",
          10: "remove %removee% from %person%'s preference list and remove %person% from %removee%'s preference list",

          11: 'While some person %person% has more then 1 person left in their preference list - %list%',
          12: "look for rotations within %person%'s preference list, that is a cycle of ordered pairs through preference lists",
          13: 'if a rotation is found', //%rotation%
          14: "delete pairs in rotation - remove %removee% from %person%'s preference list and remove %person% from %removee%'s preference list",

          15: 'check if any person has only 1 preference left',
          16: 'assign %person% to the last person in their preference list - %preference%',
          17: "check if %person%'s preference list is empty",
          18: 'end the algorithm, there is no stable matching',

          19: 'Stable mathcing found.',
        },
        code: [
          'Set each person to be free',
          'While some person p is free (not assigned to someone)',
          '\tif person p has a empty preference list',
          '\t\tend - no stable matching',

          "\t person b := first preference on p's list",
          '\t assign p to b',

          '\t if any person a is assigned to person b',
          '\t\t free a',

          "\t for each person c less preferded than p on b's preference list",
          "\t\t remove c from p's list and remove p from c's list",
          // 10 lines so far

          // PAHSE 2
          'While some person p has more than 1 preference left',
          "look for rotations in perosn p's preference list",
          'if rotation r is found',
          '\t delete pairs in rotation r',

          '\t if a person b has 1 perferance left',
          '\t\t person b := last preference',

          'if any people have empty preference lists',
          '\t end - no stable matching',

          'done',
          // 11 ---> 17 lines
        ],
      },
    ],

    // SPA

    [
      'spa-stu-egs',
      {
        id: 'spa-stu-egs',
        name: 'Student-Project Allocation',
        orientation: ['Student', 'Project'],
        equalGroups: false,
        algorithm: 'A.I.M. Algorithm',
        service: this.SpaStudentEgsService,
        description:
          'The Student-Project Allocation Problem is the problem of finding a many-to-one stable matching between <b>students</b> and <b>projects</b>. Projects are not agents, but do have a fixed maximum capacity. They are offered by <b>lecturers</b>, and it is the lecturer that has preferences over the students. One lecturer may offer many projects.<br>We demonstrate the algorithm due to Abraham, Irving and Manlove.',
        helpTextMap: {
          1: 'set each student, lecturer, and project to be free and unmatched',
          2: 'While some student %student% is free and has a non-empty preference list',
          3: "%project% is selected as %student%'s most prefered project",
          4: 'The lecturer %lecturer% offers that project',
          5: 'The project %project% and the student %student% are assigned to each other',
          6: 'If the project %project% is over-subscribed',
          7: 'The worst (least preferable) student assigned to project %project% is %student%',
          8: 'The provisional assigment between %project% and %student% is broken',
          9: 'Else if the lecturer %lecturer% is over-subscribed',
          10: 'The worst (least preferable) student assigned to the lecturer %lecturer% is %student%',
          11: 'The project that %student% is assigned to is %project%',
          12: 'The provisional assigment between %project% and %student% is broken',

          13: 'If the project %project% is at capacity',
          14: 'The worst (least preferable) student assigned to project %project% is %student%',
          15: "For each student less preferable that %student% on the %lecturer%'s prefernce list",
          16: 'If the student %student% has the project %project% on their preference list',
          17: "Remove %project% from %student%'s preference list",

          18: 'If the lecturer %lecturer% is at capacity',
          19: 'The worst (least preferable) student assigned to a project %project% run by %lecturer% is %student%',
          20: "For each student less preferable that %student% on the %lecturer%'s prefernce list",
          21: 'For each project that %lecturer% offers',
          22: "Remove %project% from %student%'s preference list",

          23: 'Stable matching is found ',
        },
        code: [
          'set each student, lecturer, and project to be free',
          'while some student s is free:',
          "\t p = next most prefered project on s's list",
          '\tl = lecturer who offers p',
          '\t provisionally assign s to p',
          '\t if p is over-subscribed:',
          '\t\t Sw = worst student assigned to p',
          '\t\t break provisional assignment between Sw and P',
          '\t else if l is over-subscribed:',
          '\t\t Sw = worst student assigned to l',
          '\t\t Pw = project that Sw is assigned to',
          '\t\t break provisional assignment between Sw and Pw',

          '\t if p is full:',
          '\t\t Sw = worst student assigned to p',
          "\t\t for each student S_i less prefered than Sw on l's preference list:",
          '\t\t\t if S_i finds project p acceptable:',
          "\t\t\t\t remove p from S_i's preference list",

          '\t if l is full:',
          '\t\t Sw = worst student assigned to l',
          "\t\t for each student S_i less prefered than Sw on l's preference list:",
          '\t\t\t for each project P_i that l offers:',
          "\t\t\t\t remove P_i from S_i's preference list",

          'Stable matching is found',
          // 23 lines
        ],
      },
    ],
  ]);

  pluralMap: Map<string, string> = new Map([
    ['Man', 'Men'],
    ['Woman', 'Women'],
    ['Resident', 'Residents'],
    ['Hospital', 'Hospitals'],
    ['Person', 'People'],
    ['Student', 'Students'],
    ['Project', 'Projects'],
    ['Lecturer', 'Lecturers'],
  ]);

  constructor(
    public gsStableMarriageService: GsStableMarriageService,
    public egsStableMarriageService: EgsStableMarriageService,
    public HrResidentEgsService: HrResidentEgsService,
    public StableRoomIrvService: StableRoomIrvService,
    public HrHospitalEgsService: HrHospitalEgsService,
    public SpaStudentEgsService: SpaStudentEgsService,
  ) {}

  getListOfAlgorithms(): Array<Algorithm> {
    return Array.from(this.mapOfAvailableAlgorithms.values());
  }
}
