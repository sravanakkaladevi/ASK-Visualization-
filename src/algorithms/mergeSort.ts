import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export const MERGE_SORT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
  python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  java: `public class MergeSort {
    public static void mergeSort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            mergeSort(arr, l, m);
            mergeSort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    private static void merge(int[] arr, int l, int m, int r) {
        int n1 = m - l + 1, n2 = r - m;
        int[] L = new int[n1], R = new int[n2];
        for (int i = 0; i < n1; ++i) L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j) R[j] = arr[m + 1 + j];
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
        }
        while (i < n1) arr[k++] = L[i++];
        while (j < n2) arr[k++] = R[j++];
    }
}`,
  cpp: `void merge(std::vector<int>& arr, int l, int m, int r) {
    std::vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    std::vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.size()) arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(std::vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
};

export function generateMergeSortSteps(input: number[]): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  const initial = input.map((val, idx) => ({ id: `el-${idx}`, value: val, status: 'default' as const }));

  steps.push({
    state: initial,
    highlightedLines: [1, 2],
    description: `Merge Sort initialized with input array of ${input.length} elements.`,
  });

  const arr = [...input];
  const n = arr.length;

  // Simulate bottom-up merge passes to generate step snapshots
  for (let currSize = 1; currSize < n; currSize *= 2) {
    for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * currSize) {
      const mid = Math.min(leftStart + currSize - 1, n - 1);
      const rightEnd = Math.min(leftStart + 2 * currSize - 1, n - 1);

      // Highlight sub-arrays being merged
      steps.push({
        state: arr.map((val, idx) => {
          if (idx >= leftStart && idx <= mid) return { id: `el-${idx}`, value: val, status: 'comparing' as const };
          if (idx > mid && idx <= rightEnd) return { id: `el-${idx}`, value: val, status: 'swapping' as const };
          return { id: `el-${idx}`, value: val, status: 'default' as const };
        }),
        highlightedLines: [4, 5, 6],
        description: `Sub-array Split: Merging left range [${leftStart}..${mid}] and right range [${mid + 1}..${rightEnd}].`,
      });

      // Merge sorted range
      const temp: number[] = [];
      let i = leftStart, j = mid + 1;
      while (i <= mid && j <= rightEnd) {
        if (arr[i] <= arr[j]) temp.push(arr[i++]);
        else temp.push(arr[j++]);
      }
      while (i <= mid) temp.push(arr[i++]);
      while (j <= rightEnd) temp.push(arr[j++]);

      for (let k = 0; k < temp.length; k++) {
        arr[leftStart + k] = temp[k];
      }

      steps.push({
        state: arr.map((val, idx) => {
          if (idx >= leftStart && idx <= rightEnd) return { id: `el-${idx}`, value: val, status: 'sorted' as const };
          return { id: `el-${idx}`, value: val, status: 'default' as const };
        }),
        highlightedLines: [12, 13, 14],
        description: `Sub-array Merged: Range [${leftStart}..${rightEnd}] combined in sorted order: [${temp.join(', ')}].`,
      });
    }
  }

  // Final Complete Step
  steps.push({
    state: arr.map((val, idx) => ({ id: `el-${idx}`, value: val, status: 'sorted' as const })),
    highlightedLines: [1, 2, 3],
    description: 'Merge Sort Complete! Entire array sorted in O(N log N) time.',
  });

  return steps;
}

export const mergeSortDefinition: AlgorithmDefinition<number[], ArrayState> = {
  meta: {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    timeComplexity: {
      best: 'O(N log N)',
      average: 'O(N log N)',
      worst: 'O(N log N)',
    },
    spaceComplexity: 'O(N)',
    description: 'Divide and conquer sorting algorithm splitting array into sub-arrays and merging them back in sorted order.',
    code: MERGE_SORT_CODE_SNIPPETS,
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    implemented: true,
    conceptType: 'code',
  },
  generateSteps: generateMergeSortSteps,
};
