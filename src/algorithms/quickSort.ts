import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export const QUICK_SORT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  java: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
            }
        }
        int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
        return i + 1;
    }
}`,
  cpp: `int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
};

export function generateQuickSortSteps(input: number[]): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  const arr = [...input];
  const initial = input.map((val, idx) => ({ id: `el-${idx}`, value: val, status: 'default' as const }));

  steps.push({
    state: initial,
    highlightedLines: [1, 2],
    description: `Quick Sort initialized with input array of ${input.length} elements.`,
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];

    steps.push({
      state: arr.map((val, idx) => {
        if (idx === high) return { id: `el-${idx}`, value: val, status: 'pivot' as const };
        if (idx >= low && idx < high) return { id: `el-${idx}`, value: val, status: 'comparing' as const };
        return { id: `el-${idx}`, value: val, status: 'default' as const };
      }),
      highlightedLines: [10, 11],
      description: `Partition: Picked pivot element ${pivot} at index ${high}. Inspecting range [${low}..${high - 1}].`,
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          state: arr.map((val, idx) => {
            if (idx === i || idx === j) return { id: `el-${idx}`, value: val, status: 'swapping' as const };
            if (idx === high) return { id: `el-${idx}`, value: val, status: 'pivot' as const };
            return { id: `el-${idx}`, value: val, status: 'default' as const };
          }),
          highlightedLines: [14, 15, 16],
          description: `Element ${arr[i]} < pivot (${pivot}). Swapped to left partition index ${i}.`,
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pivotFinalIndex = i + 1;

    steps.push({
      state: arr.map((val, idx) => {
        if (idx === pivotFinalIndex) return { id: `el-${idx}`, value: val, status: 'sorted' as const };
        return { id: `el-${idx}`, value: val, status: 'default' as const };
      }),
      highlightedLines: [18, 19],
      description: `Pivot Place: Pivot ${pivot} placed at final sorted index ${pivotFinalIndex}.`,
    });

    return pivotFinalIndex;
  }

  function runQuickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      runQuickSort(low, pi - 1);
      runQuickSort(pi + 1, high);
    }
  }

  runQuickSort(0, arr.length - 1);

  steps.push({
    state: arr.map((val, idx) => ({ id: `el-${idx}`, value: val, status: 'sorted' as const })),
    highlightedLines: [1, 2, 3],
    description: 'Quick Sort Complete! Entire array sorted in O(N log N) average time.',
  });

  return steps;
}

export const quickSortDefinition: AlgorithmDefinition<number[], ArrayState> = {
  meta: {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    timeComplexity: {
      best: 'O(N log N)',
      average: 'O(N log N)',
      worst: 'O(N^2)',
    },
    spaceComplexity: 'O(log N)',
    description: 'Partition-based divide and conquer sorting algorithm selecting a pivot and placing elements < pivot to the left and > pivot to the right.',
    code: QUICK_SORT_CODE_SNIPPETS,
    defaultInput: [24, 9, 29, 14, 37, 12, 5],
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: generateQuickSortSteps,
};
