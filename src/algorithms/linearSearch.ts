import { AlgorithmDefinition, ArrayState, CodeSnippets, Step } from '../types/algorithm';
import { BinarySearchInput } from './binarySearch';

export const LINEAR_SEARCH_CODE_SNIPPETS: CodeSnippets = {
  python: `def linear_search(arr: list[int], target: int) -> int:
    for index, value in enumerate(arr):
        # Inspect each element one-by-one from left to right
        if value == target:
            return index    # Target found at index
    return -1               # Target not present in array`,
  java: `public class LinearSearch {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
  cpp: `int linearSearch(const std::vector<int>& arr, int target) {
    for (size_t i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return static_cast<int>(i);
        }
    }
    return -1;
}`,
  javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
};

export const DEFAULT_LINEAR_SEARCH_INPUT: BinarySearchInput = {
  array: [14, 45, 23, 7, 89, 34, 62],
  target: 7,
};

export function generateLinearSearchSteps(input: BinarySearchInput): Step<ArrayState>[] {
  const steps: Step<ArrayState>[] = [];
  const { array, target } = input;

  const baseElements: ArrayState = array.map((val, idx) => ({
    id: `el-${idx}-${val}`,
    value: val,
    status: 'default',
  }));

  steps.push({
    state: baseElements.map((e) => ({ ...e })),
    highlightedLines: [1, 2],
    description: `Target = ${target}. Starting Linear Search from index 0 across the array.`,
  });

  let foundIndex = -1;

  for (let i = 0; i < array.length; i++) {
    const isMatch = array[i] === target;

    steps.push({
      state: baseElements.map((e, idx) => {
        if (idx === i) {
          return { ...e, status: isMatch ? 'sorted' : 'comparing' };
        }
        if (idx < i) {
          return { ...e, status: 'visited' };
        }
        return { ...e, status: 'default' };
      }),
      highlightedLines: [3, 4],
      description: `Checking index ${i} (value = ${array[i]}). Is ${array[i]} == ${target}? ${isMatch ? 'YES! Target Found!' : 'No, advancing to next element.'}`,
    });

    if (isMatch) {
      foundIndex = i;
      steps.push({
        state: baseElements.map((e, idx) => ({
          ...e,
          status: idx === i ? 'sorted' : idx < i ? 'visited' : 'default',
        })),
        highlightedLines: [4, 5],
        description: `Linear Search Success: Target ${target} located at index ${i}. Returning index ${i}.`,
      });
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      state: baseElements.map((e) => ({ ...e, status: 'deleted' })),
      highlightedLines: [6],
      description: `Target ${target} was not found after scanning all ${array.length} elements. Returning -1.`,
    });
  }

  return steps;
}

export const linearSearchDefinition: AlgorithmDefinition<BinarySearchInput, ArrayState> = {
  meta: {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'searching',
    timeComplexity: {
      best: 'O(1)',
      average: 'O(N)',
      worst: 'O(N)',
    },
    spaceComplexity: 'O(1)',
    description:
      'Linear Search sequentially inspects every element in a list one by one until finding the target or reaching the end.',
    code: LINEAR_SEARCH_CODE_SNIPPETS,
    defaultInput: DEFAULT_LINEAR_SEARCH_INPUT,
    implemented: true,
  },
  generateSteps: generateLinearSearchSteps,
};
