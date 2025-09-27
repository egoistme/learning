/**
 * JavaScript 排序算法完整实现
 * 包含 10 种经典排序算法，分为基础排序、高效排序和非比较排序
 * 每个算法都标注了时间复杂度、空间复杂度和稳定性
 */

// ========================================
// 🔵 基础比较排序 (O(n²) 时间复杂度)
// ========================================

/**
 * 冒泡排序 - 相邻元素两两比较，大的往后冒泡
 * 时间复杂度: 最好 O(n)，平均/最坏 O(n²)
 * 空间复杂度: O(1)
 * 稳定性: 稳定
 * 适用场景: 小数据集、教学演示
 */
function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false; // 优化：记录是否发生交换

        // 每轮把最大值"冒泡"到末尾
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        // 如果没有交换，说明已经有序
        if (!swapped) break;
    }

    return arr;
}

/**
 * 选择排序 - 每次选择最小元素放到前面
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 * 稳定性: 不稳定
 * 适用场景: 小数据集、内存受限
 */
function selectionSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        // 在未排序部分找到最小值的索引
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        // 交换到当前位置
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        }
    }

    return arr;
}

/**
 * 插入排序 - 像整理扑克牌，将元素插入到已排序部分的合适位置
 * 时间复杂度: 最好 O(n)，平均/最坏 O(n²)
 * 空间复杂度: O(1)
 * 稳定性: 稳定
 * 适用场景: 小数据集、基本有序的数据
 */
function insertionSort(arr) {
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const current = arr[i];
        let j = i - 1;

        // 在已排序部分找到插入位置
        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = current;
    }

    return arr;
}

// ========================================
// 🟢 高效比较排序 (O(n log n) 时间复杂度)
// ========================================

/**
 * 希尔排序 - 插入排序的改进版，使用间隔序列减少元素移动
 * 时间复杂度: O(n^1.3) 到 O(n²)
 * 空间复杂度: O(1)
 * 稳定性: 不稳定
 * 适用场景: 中等大小数据集
 */
function shellSort(arr) {
    const n = arr.length;

    // 使用 Knuth 序列: h = 1, 4, 13, 40, 121, ...
    // 初始间隔为数组长度的一半，每次减半（简化版）
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {

        // 对每个间隔进行插入排序
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;

            while (j >= gap && arr[j - gap] > temp) {
                arr[j] = arr[j - gap];
                j -= gap;
            }

            arr[j] = temp;
        }
    }

    return arr;
}

/**
 * 归并排序 - 分治法：分割数组后合并有序子数组
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n)
 * 稳定性: 稳定
 * 适用场景: 需要稳定排序、数据量大
 */
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

/**
 * 合并两个有序数组
 */
function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    // 比较两个数组的元素，依次放入结果数组
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    // 处理剩余元素
    return result.concat(left.slice(i)).concat(right.slice(j));
}

/**
 * 快速排序 - 分治法：选择基准元素，分区后递归排序
 * 时间复杂度: 平均 O(n log n)，最坏 O(n²)
 * 空间复杂度: O(log n)
 * 稳定性: 不稳定
 * 适用场景: 通用排序，平均性能优秀
 */
function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    return arr;
}

/**
 * 分区函数 - 将数组分为小于基准和大于基准两部分
 */
function partition(arr, left, right) {
    const pivot = arr[right]; // 选择最右边元素为基准
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
}

/**
 * 三路快速排序 - 处理重复元素优化版本
 * 特别适合有大量重复元素的数组
 */
function quickSort3Way(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return arr;

    let lt = left;      // 小于区域的右边界
    let gt = right;     // 大于区域的左边界
    let i = left + 1;   // 当前处理位置
    const pivot = arr[left];

    while (i <= gt) {
        if (arr[i] < pivot) {
            [arr[lt], arr[i]] = [arr[i], arr[lt]];
            lt++;
            i++;
        } else if (arr[i] > pivot) {
            [arr[i], arr[gt]] = [arr[gt], arr[i]];
            gt--;
        } else {
            i++;
        }
    }

    quickSort3Way(arr, left, lt - 1);
    quickSort3Way(arr, gt + 1, right);
    return arr;
}

/**
 * 堆排序 - 利用堆数据结构的特性进行排序
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(1)
 * 稳定性: 不稳定
 * 适用场景: 需要原地排序、时间复杂度稳定
 */
function heapSort(arr) {
    const n = arr.length;

    // 构建最大堆（从最后一个非叶子节点开始）
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // 逐个取出堆顶元素（最大值）放到末尾
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    return arr;
}

/**
 * 堆化函数 - 维护堆的性质
 */
function heapify(arr, n, i) {
    let largest = i;        // 假设当前节点最大
    const left = 2 * i + 1; // 左子节点
    const right = 2 * i + 2; // 右子节点

    // 找出三个节点中的最大值
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    // 如果最大值不是当前节点，交换并继续堆化
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// ========================================
// 🟡 非比较排序 (特定条件下的线性时间)
// ========================================

/**
 * 计数排序 - 统计每个值出现的次数
 * 时间复杂度: O(n + k)，k 为数据范围
 * 空间复杂度: O(k)
 * 稳定性: 稳定
 * 适用场景: 整数且范围不大
 */
function countingSort(arr) {
    if (arr.length === 0) return arr;

    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;

    // 统计每个值出现的次数
    const count = new Array(range).fill(0);
    for (let num of arr) {
        count[num - min]++;
    }

    // 计算累积计数
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    // 构建结果数组（从后往前保证稳定性）
    const result = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--) {
        const num = arr[i];
        result[count[num - min] - 1] = num;
        count[num - min]--;
    }

    return result;
}

/**
 * 桶排序 - 将数据分配到多个桶，分别排序后合并
 * 时间复杂度: 平均 O(n + k)，最坏 O(n²)
 * 空间复杂度: O(n + k)
 * 稳定性: 稳定
 * 适用场景: 数据分布均匀
 */
function bucketSort(arr, bucketSize = 5) {
    if (arr.length === 0) return arr;

    const max = Math.max(...arr);
    const min = Math.min(...arr);

    // 确定桶的数量
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = Array.from({ length: bucketCount }, () => []);

    // 将元素分配到对应的桶
    for (let num of arr) {
        const bucketIndex = Math.floor((num - min) / bucketSize);
        buckets[bucketIndex].push(num);
    }

    // 对每个桶进行排序并合并结果
    const result = [];
    for (let bucket of buckets) {
        insertionSort(bucket); // 对桶内元素进行排序
        result.push(...bucket);
    }

    return result;
}

/**
 * 基数排序 - 按位数排序，从低位到高位
 * 时间复杂度: O(d * (n + k))，d 为位数，k 为基数
 * 空间复杂度: O(n + k)
 * 稳定性: 稳定
 * 适用场景: 整数或字符串，位数固定
 */
function radixSort(arr) {
    if (arr.length === 0) return arr;

    const max = Math.max(...arr);
    const maxDigit = String(max).length;

    // 从个位开始，依次对每一位进行计数排序
    for (let exp = 0; exp < maxDigit; exp++) {
        arr = countingSortByDigit(arr, exp);
    }

    return arr;
}

/**
 * 按指定位数进行计数排序
 */
function countingSortByDigit(arr, digit) {
    const result = new Array(arr.length);
    const count = new Array(10).fill(0);
    const divisor = Math.pow(10, digit);

    // 统计当前位的数字出现次数
    for (let num of arr) {
        const digitValue = Math.floor(num / divisor) % 10;
        count[digitValue]++;
    }

    // 计算累积计数
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 构建结果数组（从后往前保证稳定性）
    for (let i = arr.length - 1; i >= 0; i--) {
        const num = arr[i];
        const digitValue = Math.floor(num / divisor) % 10;
        result[count[digitValue] - 1] = num;
        count[digitValue]--;
    }

    return result;
}

// ========================================
// 🔧 实用工具函数
// ========================================

/**
 * 检查数组是否已排序
 */
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

/**
 * 生成随机数组用于测试
 */
function generateRandomArray(size, min = 0, max = 100) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * 复制数组（用于测试时避免修改原数组）
 */
function copyArray(arr) {
    return [...arr];
}

// ========================================
// 导出所有排序算法
// ========================================

// Node.js 环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 基础排序
        bubbleSort,
        selectionSort,
        insertionSort,

        // 高效排序
        shellSort,
        mergeSort,
        merge,
        quickSort,
        quickSort3Way,
        partition,
        heapSort,
        heapify,

        // 非比较排序
        countingSort,
        bucketSort,
        radixSort,
        countingSortByDigit,

        // 工具函数
        isSorted,
        generateRandomArray,
        copyArray
    };
}

// 浏览器环境，函数已经在全局作用域中可用