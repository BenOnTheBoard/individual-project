import { AlgorithmBuilder } from '../Algorithm';

export const spasStudentConfig = new AlgorithmBuilder()
  .id('spa-stu-egs')
  .name('Student-Project Allocation')
  .orientation(['Student', 'Project'])
  .equalGroups(false)
  .algorithm('A.I.M. Algorithm')
  .description(
    'The Student-Project Allocation Problem is the problem of finding a many-to-one stable matching between <b>students</b> and <b>projects</b>. Projects are not agents, but they do have a fixed maximum capacity. They are offered by <b>lecturers</b>, and it is the lecturer that has preferences over the students. One lecturer may offer many projects.<br>We demonstrate the algorithm due to Abraham, Irving, and Manlove.',
  )
  .helpTextMap({
    1: 'Start with no assignments between students and projects.',
    2: '%student% is free and has a non-empty preference list.',
    3: '%student% selects %project%, the most preferred project remaining on their list.',
    4: '%lecturer% offers that project.',
    5: 'We assign %project% and %student% to each other.',
    6: 'We check whether %project% is over-subscribed.',
    7: 'The worst student assigned to project %project% is %student%.',
    8: 'We break the provisional assignment between %project% and %student%.',
    9: 'We check whether %lecturer% is over-subscribed.',
    10: 'The worst student assigned to %lecturer% is %student%.',
    11: 'The project that %student% is assigned to is %project%.',
    12: 'We break the provisional assignment between %project% and %student%.',
    13: 'We check whether %project% is at capacity.',
    14: 'The worst student assigned to project %project% is %student%.',
    15: "We loop over the students on %lecturer%'s list whom they prefer %student% to.",
    16: 'We check whether %student% has %project% on their preference list.',
    17: "We remove %project% from %student%'s preference list.",
    18: 'We check whether %lecturer% is at capacity',
    19: 'The worst student assigned to a project (%project%) offered by %lecturer% is %student%.',
    20: "We loop over the students on %lecturer%'s list whom they prefer %student% to.",
    21: 'We also loop over the projects that %lecturer% offers.',
    22: "We remove %project% from %student%'s preference list.",
    23: 'We have arrived at a stable matching.',
  })
  .code([
    'Set each student, lecturer, and project to be free',
    'While some student s is free:',
    "\tp = next most preferred project on s's list",
    '\tl = lecturer who offers p',
    '\tProvisionally assign s to p',
    '\tIf p is over-subscribed:',
    '\t\tSw = worst student assigned to p',
    '\t\tBreak provisional assignment between Sw and P',
    '\tElse if l is over-subscribed:',
    '\t\tSw = worst student assigned to l',
    '\t\tPw = project that Sw is assigned to',
    '\t\tBreak provisional assignment between Sw and Pw',
    '\tIf p is full:',
    '\t\tSw = worst student assigned to p',
    "\t\tFor each student S_i less preferred than Sw on l's preference list:",
    '\t\t\tIf S_i finds project p acceptable:',
    "\t\t\t\tRemove p from S_i's preference list",
    '\tIf l is full:',
    '\t\tSw = worst student assigned to l',
    "\t\tFor each student S_i less preferred than Sw on l's preference list:",
    '\t\t\tFor each project P_i that l offers:',
    "\t\t\t\tRemove P_i from S_i's preference list",
    'The current set of assignments is stable',
  ]);
