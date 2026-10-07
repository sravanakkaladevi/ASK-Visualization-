import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export const SELECTION_SORT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function selectionSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      // Swap elements
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
  python: `def selection_sort(arr: list[int]) -> list[int]:
  n = len(arr)
  for i in range(n - 1):
    min_idx = i
    for j in range(i + 1, n):
      if arr[j] < arr[min_idx]:
        min_idx = j
    if min_idx != i:
      # Swap elements
      arr[i], arr[min_idx] = arr[min_idx], arr[i]
  return arr`,
  java: `public static int[] selectionSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx != i) {
      // Swap elements
      int temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
    }
  }
  return arr;
}`,
  cpp: `std::vector<int> selectionSort(std::vector<int> arr) {
  int n = arr.size();
  for (int i = 0; i < n - 1; i++) {
    int minIdx = i;
    for (int j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx != i) {
      // Swap elements
      std::swap(arr[i], arr[minIdx]);
    }
  }
  return arr;
}`,
};

export const DEFAULT_SELECTION_SORT_INPUT: number[] = [29, 10, 14, 37, 13, 5, 22];

export function generateSelectionSortSteps(input: number[]): Step<ArrayState>[] {
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

  pushStep([1, 2], 'Starting Selection Sort on initial array.');

  const n = currentElements.length;
  if (n <= 1) {
    if (n === 1) currentElements[0].status = 'sorted';
    pushStep([14], 'Array is already sorted.');
    return steps;
  }

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    pushStep(
      [3, 4],
      `Pass ${i + 1}: Assuming minimum is element at index ${i} (val: ${currentElements[i].value}).`,
      { [i]: 'pivot' }
    );

    for (let j = i + 1; j < n; j++) {
      const valJ = currentElements[j].value;
      const valMin = currentElements[minIdx].value;

      pushStep(
        [5, 6],
        `Comparing current minimum arr[${minIdx}] (${valMin}) with arr[${j}] (${valJ}).`,
        { [minIdx]: 'pivot', [j]: 'comparing' }
      );

      if (valJ < valMin) {
        minIdx = j;
        pushStep(
          [7],
          `New minimum found: ${valJ} at index ${j}.`,
          { [minIdx]: 'pivot' }
        );
      }
    }

    if (minIdx !== i) {
      const valI = currentElements[i].value;
      const valMin = currentElements[minIdx].value;

      pushStep(
        [10, 11],
        `Swapping index ${i} (${valI}) with minimum at index ${minIdx} (${valMin}).`,
        { [i]: 'swapping', [minIdx]: 'swapping' }
      );

      const temp = currentElements[i];
      currentElements[i] = currentElements[minIdx];
      currentElements[minIdx] = temp;
    }

    currentElements[i].status = 'sorted';
    pushStep(
      [13],
      `Index ${i} (${currentElements[i].value}) is now in its sorted position.`
    );
  }

  currentElements[n - 1].status = 'sorted';
  pushStep([14, 15], 'Selection Sort complete! All elements are sorted.');

  return steps;
}

export const selectionSortDefinition: AlgorithmDefinition<number[], ArrayState> = {
  meta: {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Selection Sort repeatedly finds the minimum element from the unsorted segment of the array and moves it to the sorted position at the beginning.',
    code: SELECTION_SORT_CODE_SNIPPETS,
    defaultInput: DEFAULT_SELECTION_SORT_INPUT,
    implemented: true,
  },
  generateSteps: generateSelectionSortSteps,
};
