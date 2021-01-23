import type { Analyser } from 'tone';
/**
 * Frequency
 */
type FrequencyRange = 'low' | 'mid' | 'high';

const frequencyRanges: Record<FrequencyRange, [number, number]> = {
  low: [20, 400],
  mid: [400, 2600],
  high: [2600, 14000],
};

const getEnergyAtHz = (hz: number, analyzer: Analyser): number => {
  const nyquist = analyzer.context.sampleRate / 2;
  const frequencyBinCount = analyzer.size;

  return Math.max(0, Math.min(frequencyBinCount - 1, Math.floor((hz / nyquist) * frequencyBinCount)));
};

const getEnergy = (analyser: Analyser, low: FrequencyRange, high?: FrequencyRange): number => {
  const buffer = analyser.getValue();

  const lowHz = frequencyRanges[low][0];
  const highHz = frequencyRanges[high || low][1];

  const lowIndex = getEnergyAtHz(lowHz, analyser);
  const highIndex = getEnergyAtHz(highHz, analyser);

  let total = 0;
  let numFrequencies = 0;

  for (let i = lowIndex; i <= highIndex; i++) {
    total += buffer[i] as number;
    numFrequencies++;
  }

  const toReturn = total / numFrequencies;
  return toReturn;
};

export default getEnergy;
