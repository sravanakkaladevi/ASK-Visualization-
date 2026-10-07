import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';

export interface BinarySearchInput {
  array: number[];
  target: number;
}

export const BINARY_SEARCH_CODE_SNIPPETS: CodeSnippets = {
  typescript: `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid; // Found target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`,
  python: `def binary_search(arr: list[int], target: int) -> int:
  left, right = 0, len(arr) - 1
  while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
      return mid # Found target
    elif arr[mid] < target:
      left = mid + 1 # Search right half
    else:
      right = mid - 1 # Search left half
  return -1 # Not found`,
  java: `public static int binarySearch(int[] arr, int target) {
  int left = 0;
  int right = arr.length - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid; // Found target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`,
  cpp: `int binarySearch(const std::vector<int>& arr, int target) {
  int left = 0;
  int right = arr.size() - 1;
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) {
      return mid; // Found target
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  return -1; // Not found
}`,
};

export const DEFAULT_BINARY_SEARCH_INPUT: BinarySearchInput = {
  array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
  target: 23,
};

export function generateBinarySearchSteps(input: BinarySearchInput): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  
  const sortedArray = [...input.array].sort((a, b) => a - b);
  const target = input.target;

  const currentElements: ArrayState = sortedArray.map((val, idx) => ({
    id: `elem-${idx}-${val}`,
    value: val,
    status: 'default',
  }));

  const pushStep = (
    highlightedLines: number[],
    description: string,
    left: number,
    right: number,
    mid?: number,
    foundIdx?: number
  ) => {
    const stateSnapshot: ArrayState = currentElements.map((el, idx) => {
      if (foundIdx !== undefined && idx === foundIdx) {
        return { ...el, status: 'sorted' };
      }
      if (idx === mid) {
        return { ...el, status: 'pivot' };
      }
      if (idx >= left && idx <= right) {
        return { ...el, status: 'comparing' };
      }
      return { ...el, status: 'visited' };
    });

    steps.push({
      state: stateSnapshot,
      highlightedLines,
      description,
      metadata: { left, right, mid, target },
    });
  };

  let left = 0;
  let right = currentElements.length - 1;

  pushStep(
    [1, 2, 3],
    `Searching for target = ${target}. Initialized search window [left: 0, right: ${right}].`,
    left,
    right
  );

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = currentElements[mid].value;

    pushStep(
      [4, 5],
      `Calculated mid = Math.floor((${left} + ${right}) / 2) = ${mid} (val: ${midVal}).`,
      left,
      right,
      mid
    );

    if (midVal === target) {
      pushStep(
        [6, 7],
        `Target ${target} found at index ${mid}!`,
        left,
        right,
        mid,
        mid
      );
      return steps;
    } else if (midVal < target) {
      pushStep(
        [8, 9],
        `${midVal} < ${target}: Target is greater than mid value. Shifting left pointer to ${mid + 1}.`,
        left,
        right,
        mid
      );
      left = mid + 1;
    } else {
      pushStep(
        [10, 11],
        `${midVal} > ${target}: Target is less than mid value. Shifting right pointer to ${mid - 1}.`,
        left,
        right,
        mid
      );
      right = mid - 1;
    }
  }

  pushStep(
    [13, 14],
    `Target ${target} was not found in the array (left > right).`,
    left,
    right
  );

  return steps;
}

export const binarySearchDefinition: AlgorithmDefinition<BinarySearchInput, ArrayState> = {
  meta: {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'searching',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(log n)',
      worst: 'O(log n)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Binary Search efficiently locates a target value in a sorted array by repeatedly dividing the search space in half.',
    code: BINARY_SEARCH_CODE_SNIPPETS,
    defaultInput: DEFAULT_BINARY_SEARCH_INPUT,
    implemented: true,
  },
  generateSteps: generateBinarySearchSteps,
};
