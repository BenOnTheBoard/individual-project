import { Group, TiedAgent } from '../interfaces/Agents';
import { MatchingAlgorithm } from './MatchingAlgorithm';

const TIEFREQ = 0.4;
const MAXTIE = 3;

export abstract class TiedMatchingAlgorithm extends MatchingAlgorithm {
  protected abstract group1Agents: Map<String, TiedAgent>;
  protected abstract group2Agents: Map<String, TiedAgent>;

  protected origPrefsG1: Map<String, Array<Array<String>>>;
  protected origPrefsG2: Map<String, Array<Array<String>>>;

  copyOriginalPrefs(group: Group): Map<String, Array<Array<String>>> {
    const agents = group == 'group1' ? this.group1Agents : this.group2Agents;
    const origPrefs = new Map<String, Array<Array<String>>>();
    for (const agent of agents.values()) {
      origPrefs.set(agent.name, []);
      for (const tie of agent.ranking) {
        const nameTie = tie.map((a) => a.name);
        origPrefs.get(agent.name).push(nameTie);
      }
    }
    return origPrefs;
  }

  initCurrentAndOriginalPrefs() {
    this.styledPrefsG1 = this.getRankings(this.group1Agents);
    this.origPrefsG1 = this.copyOriginalPrefs('group1');
    this.styledPrefsG2 = this.getRankings(this.group2Agents);
    this.origPrefsG2 = this.copyOriginalPrefs('group2');
  }

  addTiesToList(list: Array<TiedAgent>): Array<Array<TiedAgent>> {
    const tiedList = new Array<Array<TiedAgent>>();
    let curTie = new Array<TiedAgent>();
    for (const agent of list) {
      curTie.push(agent);
      if (curTie.length >= MAXTIE || Math.random() > TIEFREQ) {
        tiedList.push([...curTie]);
        curTie = [];
      }
    }
    if (curTie.length > 0) tiedList.push([...curTie]);
    return tiedList;
  }

  generateRandomRankings(
    rankers: Map<String, TiedAgent>,
    targets: Map<String, TiedAgent>,
  ): void {
    for (const agent of rankers.values()) {
      const shuffledTargets = Array.from(targets.values());
      this.utils.shuffle(shuffledTargets);
      agent.ranking = this.addTiesToList(shuffledTargets);
    }
  }

  generatePrefs(): void {
    this.generateRandomRankings(this.group1Agents, this.group2Agents);
    this.generateRandomRankings(this.group2Agents, this.group1Agents);
  }

  packageTiedList(list: Array<Array<TiedAgent>>): Array<String> {
    const textRanking = new Array<String>();
    for (const tie of list) {
      textRanking.push('(');
      for (const agent of tie) {
        textRanking.push(this.utils.getAsChar(agent));
      }
      textRanking.push(')');
    }
    return textRanking;
  }

  getRankings(agentMap: Map<String, TiedAgent>): Map<String, Array<String>> {
    return new Map(
      Array.from(agentMap.values()).map((agent) => [
        this.utils.getAsChar(agent),
        this.packageTiedList(agent.ranking),
      ]),
    );
  }

  getIdxInTie(tie: Array<TiedAgent>, target: TiedAgent): number {
    return tie.findIndex((a) => a.name == target.name);
  }

  getRank(agent: TiedAgent, target: TiedAgent): number {
    return agent.ranking.findIndex((tie) => tie.includes(target));
  }

  getOriginalRank(agent: TiedAgent, target: TiedAgent, group: Group): number {
    const prefs = group == 'group1' ? this.origPrefsG1 : this.origPrefsG2;
    const ranking = prefs.get(agent.name);
    return ranking.findIndex((tie) => tie.includes(target.name));
  }

  // ------ Algorithm Utilities ------

  getHead<T>(agent: TiedAgent): Array<T> {
    for (const tie of agent.ranking) {
      if (tie.length > 0) return tie.slice() as Array<T>;
    }
    throw Error(`tried to get head of empty list: ${agent.name}`);
  }

  getTail<T>(agent: TiedAgent): Array<T> {
    for (const tie of agent.ranking.slice().reverse()) {
      if (tie.length > 0) return tie.slice() as Array<T>;
    }
    throw Error(`tried to get tail of empty list: ${agent.name}`);
  }

  getStrictSuccessors<T>(agent: TiedAgent, match: TiedAgent): Array<T> {
    return agent.ranking
      .slice(this.getRank(agent, match) + 1)
      .reduce(
        (arr: Array<TiedAgent>, tie: Array<TiedAgent>) => arr.concat(...tie),
        [],
      ) as Array<T>;
  }

  hasEmptyList(agent: TiedAgent): boolean {
    for (const tie of agent.ranking) {
      if (tie.length > 0) return false;
    }
    return true;
  }
}
