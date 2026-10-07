import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export const BUBBLE_SORT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  python: `def bubble_sort(arr: list[int]) -> list[int]:
  n = len(arr)
  for i in range(n - 1):
    for j in range(n - i - 1):
      if arr[j] > arr[j + 1]:
        # Swap elements
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
  return arr`,
  java: `public static int[] bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
  cpp: `std::vector<int> bubbleSort(std::vector<int> arr) {
  int n = arr.size();
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        std::swap(arr[j], arr[j + 1]);
      }
    }
  }
  return arr;
}`,
};

export const DEFAULT_BUBBLE_SORT_INPUT: number[] = [42, 15, 28, 8, 33, 19, 50, 4];

export function generateBubbleSortSteps(input: number[]): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  
  const currentElements: ArrayState = input.map((val, idx) => ({
    id: `elem-${idx}-${val}`,
    value: val,
    status: 'default',
  }));

  const pushStep = (
    highlightedLines: number[],
    description: string,
    overrideStatuses?: Record<number, ArrayState[number]['status']>
  ) => {
    const stateSnapshot: ArrayState = currentElements.map((el, idx) => ({
      ...el,
      status: overrideStatuses && overrideStatuses[idx] !== undefined ? overrideStatuses[idx] : el.status,
    }));
    steps.push({
      state: stateSnapshot,
      highlightedLines,
      description,
    });
  };

  pushStep([1, 2], 'Starting Bubble Sort with the initial array.');

  const n = currentElements.length;
  if (n <= 1) {
    if (n === 1) currentElements[0].status = 'sorted';
    pushStep([11], 'Array has 1 or 0 elements and is already sorted.');
    return steps;
  }

  for (let i = 0; i < n - 1; i++) {
    pushStep([3], `Starting pass ${i + 1} of ${n - 1}.`);

    for (let j = 0; j < n - i - 1; j++) {
      const val1 = currentElements[j].value;
      const val2 = currentElements[j + 1].value;

      pushStep(
        [4, 5],
        `Comparing arr[${j}] (${val1}) and arr[${j + 1}] (${val2}).`,
        { [j]: 'comparing', [j + 1]: 'comparing' }
      );

      if (val1 > val2) {
        pushStep(
          [6, 7],
          `${val1} > ${val2}: Swapping arr[${j}] and arr[${j + 1}].`,
          { [j]: 'swapping', [j + 1]: 'swapping' }
        );

        const temp = currentElements[j];
        currentElements[j] = currentElements[j + 1];
        currentElements[j + 1] = temp;

        pushStep(
          [7],
          `Swapped ${val1} and ${val2}.`,
          { [j]: 'default', [j + 1]: 'default' }
        );
      } else {
        pushStep(
          [5],
          `${val1} <= ${val2}: No swap needed.`,
          { [j]: 'default', [j + 1]: 'default' }
        );
      }
    }

    currentElements[n - i - 1].status = 'sorted';
    pushStep(
      [9, 10],
      `Element ${currentElements[n - i - 1].value} at index ${n - i - 1} is in its final sorted position.`
    );
  }

  currentElements[0].status = 'sorted';
  pushStep([11, 12], 'Bubble Sort completed! All elements are sorted.');

  return steps;
}

export const bubbleSortDefinition: AlgorithmDefinition<number[], ArrayState> = {
  meta: {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    code: BUBBLE_SORT_CODE_SNIPPETS,
    defaultInput: DEFAULT_BUBBLE_SORT_INPUT,
    implemented: true,
  },
  generateSteps: generateBubbleSortSteps,
};
