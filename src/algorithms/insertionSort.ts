import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export const INSERTION_SORT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
  python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
  java: `public class InsertionSort {
    public static void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}`,
  cpp: `void insertionSort(std::vector<int>& arr) {
    for (size_t i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
};

export function generateInsertionSortSteps(input: number[]): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  const arr = [...input];

  steps.push({
    state: input.map((val, idx) => ({ id: `el-${idx}`, value: val, status: idx === 0 ? 'sorted' as const : 'default' as const })),
    highlightedLines: [1, 2],
    description: `Insertion Sort initialized. Element at index 0 (${arr[0]}) is trivially sorted.`,
  });

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      state: arr.map((val, idx) => {
        if (idx === i) return { id: `el-${idx}`, value: val, status: 'comparing' as const };
        if (idx < i) return { id: `el-${idx}`, value: val, status: 'sorted' as const };
        return { id: `el-${idx}`, value: val, status: 'default' as const };
      }),
      highlightedLines: [3, 4],
      description: `Iterating i=${i}: Key selected is ${key}. Comparing with sorted left sub-array.`,
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];

      steps.push({
        state: arr.map((val, idx) => {
          if (idx === j + 1) return { id: `el-${idx}`, value: val, status: 'swapping' as const };
          if (idx <= i) return { id: `el-${idx}`, value: val, status: 'sorted' as const };
          return { id: `el-${idx}`, value: val, status: 'default' as const };
        }),
        highlightedLines: [5, 6],
        description: `Shift: Element ${arr[j]} > Key (${key}). Shifting ${arr[j]} right to position ${j + 1}.`,
      });

      j--;
    }

    arr[j + 1] = key;

    steps.push({
      state: arr.map((val, idx) => {
        if (idx <= i) return { id: `el-${idx}`, value: val, status: 'sorted' as const };
        return { id: `el-${idx}`, value: val, status: 'default' as const };
      }),
      highlightedLines: [8],
      description: `Inserted: Key ${key} placed into correct sorted position index ${j + 1}.`,
    });
  }

  steps.push({
    state: arr.map((val, idx) => ({ id: `el-${idx}`, value: val, status: 'sorted' as const })),
    highlightedLines: [10],
    description: 'Insertion Sort Complete! Entire array sorted in O(N^2) worst / O(N) best time.',
  });

  return steps;
}

export const insertionSortDefinition: AlgorithmDefinition<number[], ArrayState> = {
  meta: {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'sorting',
    timeComplexity: {
      best: 'O(N)',
      average: 'O(N^2)',
      worst: 'O(N^2)',
    },
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time by inserting elements into their correct position.',
    code: INSERTION_SORT_CODE_SNIPPETS,
    defaultInput: [34, 12, 45, 8, 23],
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: generateInsertionSortSteps,
};
