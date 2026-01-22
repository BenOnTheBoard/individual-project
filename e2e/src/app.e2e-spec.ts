import { AppPage } from './app.po';
import { browser, by, element, logging, protractor } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // // ---------------- Home Page e2e Tests

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toContain('Learn, visualise and walk');
  });

  it('should display logo', () => {
    page.navigateTo();
    expect(page.getLogoAlg()).toContain('alg');
    expect(page.getLogoMatch()).toContain('match');
  });

  it('navbar links should appear', () => {
    page.navigateTo();
    expect(element(by.css('#homeLink')).isPresent()).toBeTruthy();
    expect(element(by.css('#aboutLink')).isPresent()).toBeTruthy();
    expect(element(by.css('#algorithmsLink')).isPresent()).toBeTruthy();
    expect(element(by.css('#feedbackLink')).isPresent()).toBeTruthy();
  });

  it('video should appear', () => {
    page.navigateTo();
    expect(element(by.css('#animationVideo')).isPresent()).toBeTruthy();
  });

  it('home page text should appear', () => {
    page.navigateTo();
    expect(page.getHomePageRow1Text()).toContain('Perfect for beginners');
    expect(page.getHomePageRow1Text()).toContain(
      'With a simple, intuitive interface, learn how the Gale-Shapley and Extended Gale-Shapley matching algorithms work in different problems with step-by-step playback.',
    );

    expect(page.getHomePageRow2Text()).toContain('Learn visually');
    expect(page.getHomePageRow2Text()).toContain(
      'Decide to play each algorithm with pseudocode shown or not in conjunction with a visual representation of matching.',
    );

    expect(page.getHomePageRow3Text()).toContain('Control your learning');
    expect(page.getHomePageRow3Text()).toContain(
      'Use the playback controls for each algorithm to control the speed you learn.',
    );
  });

  it('feedback banner should appear', () => {
    page.navigateTo();
    expect(element(by.css('#feedbackBanner')).isPresent()).toBeTruthy();
  });

  it('feedback banner text should appear', () => {
    page.navigateTo();
    expect(page.getFeedbackBannerText()).toContain(
      "If you have any feedback for me, or anything you'd like to see in this app, click the button below to be navigated to the feedback page",
    );
  });

  it('social media icons should appear', () => {
    page.navigateTo();
    expect(element(by.css('#github-icon')).isPresent()).toBeTruthy();
    expect(element(by.css('#linkedin-icon')).isPresent()).toBeTruthy();
  });

  // // ---------------- Home Page Hyperlink tests

  it('about link works', () => {
    page.navigateTo();
    element(by.id('aboutLink')).click();
    element(by.cssContainingText('h1', 'Welcome')).click();
  });

  it('algorithms link works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.cssContainingText('h1', 'Learn')).click();
  });

  it('feedback link works', () => {
    page.navigateTo();
    element(by.id('feedbackLink')).click();
    element(by.cssContainingText('h1', 'feedback')).click();
  });

  // ---------------- SMP-MAN-GS TESTS

  it('navigation to smp-man-gs works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);
  });

  it('smp-man-gs: playback controls display correctly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#restartButton')).isPresent()).toBeTruthy();
    expect(element(by.css('#backButton')).isPresent()).toBeTruthy();
    expect(element(by.css('#playButton')).isPresent()).toBeTruthy();
    expect(element(by.css('#forwardButton')).isPresent()).toBeTruthy();
    expect(element(by.css('#endButton')).isPresent()).toBeTruthy();
  });

  it('smp-man-gs: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'Ensure there are no pre-existing matches between men and women',
    );
  });

  it('smp-man-gs: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain('if w is free then');
  });

  it('smp-man-gs: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#executionTrace')).getText()).toContain(
      'Ensure there are no pre-existing matches between men and women.',
    );
  });

  it('smp-man-gs: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#lhsName')).getText()).toContain('Men');
    expect(element(by.css('#rhsName')).getText()).toContain('Women');
  });

  it('smp-man-gs: playback works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#stepCounter')).getText()).toContain('0');
    element(by.id('forwardButton')).click();
    expect(element(by.css('#stepCounter')).getText()).toContain('1');
  });

  it('smp-man-gs: pseudocode highlighting works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#line2')).getCssValue('color')).toEqual(
      'rgba(55, 255, 0, 1)',
    );
  });

  it('smp-man-gs: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'While there is still a man without a match, select the first one (man1)',
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-gs')).click();
    element(by.id('smp-man-gs')).sendKeys(5);
    element(by.id('smp-man-gs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Stable Marriage Problem',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  // // ---------------- SMP-MAN-EGS TESTS

  it('navigation to smp-man-egs works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);
  });

  it('smp-man-egs: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'Set all men and women to have no engagements',
    );
  });

  it('smp-man-egs: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain(
      'if w is currently engaged to someone { ',
    );
  });

  it('smp-man-egs: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#executionTrace')).getText()).toContain(
      'Set all men and women to have no engagements.',
    );
  });

  it('smp-man-egs: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#lhsName')).getText()).toContain('Men');
    expect(element(by.css('#rhsName')).getText()).toContain('Women');
  });

  it('smp-man-egs: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'While there are some men who are not engaged, select the next one (man1)',
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-man-egs')).click();
    element(by.id('smp-man-egs')).sendKeys(5);
    element(by.id('smp-man-egs')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Stable Marriage Problem',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  // // ---------------- HR-RESIDENTS-EGS TESTS

  it('navigation to hr works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);
  });

  it('hr: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'Clear the matches of all residents and hospitals',
    );
  });

  it('hr: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain(
      'if h is fully subscribed then',
    );
  });

  it('hr: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#executionTrace')).getText()).toContain(
      'Clear the matches of all residents and hospitals.',
    );
  });

  it('hr: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#lhsName')).getText()).toContain('Residents');
    expect(element(by.css('#rhsName')).getText()).toContain('Hospitals');
  });

  it('hr: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      "The next resident who doesn't have a match and still has some hospitals in their preference list is selected (resident1)",
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Hospitals/Residents Problem',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  // ---------------- HR-HOSPITAL-EGS TESTS

  it('navigation to hr works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr1')).click();
    element(by.id('hr1')).sendKeys(5);
    element(by.id('hr2')).click();
    element(by.id('hr2')).sendKeys(5);
    element(by.id('hr2')).sendKeys(protractor.Key.ENTER);
  });

  it('hr/h: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'Set all hospitals and residents to be completely free',
    );
  });

  it('hr/h: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain(
      "if r is assigned to another hospital h'",
    );
  });

  it('hr/h: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#executionTrace')).getText()).toContain(
      'Set all hospitals and residents to be completely free',
    );
  });

  it('hr/h: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    // flipped
    expect(element(by.css('#rhsName')).getText()).toContain('Hospitals');
    expect(element(by.css('#lhsName')).getText()).toContain('Residents');
  });

  it('hr/h: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'While some hospital (hospitalA) is undersubscribed and has a resident on their preference list that is not assigned to them',
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('hr3')).click();
    element(by.id('hr3')).sendKeys(5);
    element(by.id('hr4')).click();
    element(by.id('hr4')).sendKeys(5);
    element(by.id('hr4')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Hospitals/Residents Problem',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  // // ---------------- SMP-ROOM-IRV TESTS

  it('navigation to smp-room-irv works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);
  });

  it('smp-room-irv: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'Set all people to be free',
    );
  });

  it('smp-room-irv: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain(
      'end - no stable matching',
    );
  });

  it('smp-room-irv: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    // expect(element(by.id('executionTrace')).getText()).toContain("Set all people to be free.");
    expect(element(by.css('#executionTrace')).getText()).toContain(
      'Set all people to be free.',
    );
  });

  it('smp-room-irv: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    // only one group name
    expect(element(by.css('#lhsName')).getText()).toContain('People');
  });

  it('smp-room-irv: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'While some person person1 has not been assigned to a anyone and has a non-empty preference list',
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('smp-room-irv')).click();
    element(by.id('smp-room-irv')).sendKeys(6);
    element(by.id('smp-room-irv')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Stable Roommates Problem',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  // // ---------------- SPA-STU-EGS TESTS

  it('navigation to spa-stu-egs works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);
  });

  it('spa-stu-egs: description displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'set each student, lecturer, and project to be free and unmatched',
    );
  });

  it('spa-stu-egs: pseudocode displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#line4')).getText()).toContain(
      'l = lecturer who offers p',
    );
  });

  it('spa-stu-egs: execution log displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#executionTrace')).getText()).toContain(
      'set each student, lecturer, and project to be free and unmatched',
    );
  });

  it('spa-stu-egs: group names display properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.css('#lhsName')).getText()).toContain('Students');
    expect(element(by.css('#rhsName')).getText()).toContain('Projects');
  });

  it('spa-stu-egs: description changing works', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    element(by.id('forwardButton')).click();
    expect(element(by.css('#algorithmDescription')).getText()).toContain(
      'While some student student1 is free and has a non-empty preference list',
    );
  });

  it('smp-room-irv: Information sidebar displays properly', () => {
    page.navigateTo();
    element(by.id('algorithmsLink')).click();
    element(by.id('spa1')).click();
    element(by.id('spa1')).sendKeys(5);
    element(by.id('spa2')).click();
    element(by.id('spa2')).sendKeys(5);
    element(by.id('spa2')).sendKeys(protractor.Key.ENTER);

    expect(element(by.id('title_main')).getText()).toContain(
      'Student-Project Allocation',
    );
    expect(element(by.id('title')).getText()).toContain('Set Up');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry),
    );
  });
});
