/**
 * 冒泡排序算法
 *
 * 算法原理：
 * 重复遍历要排序的数列，每次比较相邻的两个元素，如果顺序错误就交换它们。
 * 遍历数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。
 *
 * 为什么叫"冒泡"？
 * 因为较小的元素会经由交换慢慢"浮"到数列的顶端，就像水中的气泡一样。
 */

/**
 * 基础冒泡排序
 * 时间复杂度：O(n²) - 最好、最坏、平均情况都是 O(n²)
 * 空间复杂度：O(1)
 * 稳定性：稳定
 */
function bubbleSort(arr) {
    const n = arr.length;

    console.log('开始冒泡排序...');
    console.log(`初始数组: [${arr}]`);

    // 外层循环控制排序轮数
    for (let i = 0; i < n - 1; i++) {
        console.log(`\n第 ${i + 1} 轮排序:`);

        // 内层循环进行相邻元素比较
        for (let j = 0; j < n - 1 - i; j++) {
            console.log(`  比较 ${arr[j]} 和 ${arr[j + 1]}`);

            // 如果前面的元素大于后面的元素，就交换
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                console.log(`    交换! 现在数组: [${arr}]`);
            } else {
                console.log(`    不需要交换`);
            }
        }

        console.log(`第 ${i + 1} 轮结束: [${arr}]`);
    }

    console.log(`\n排序完成: [${arr}]`);
    return arr;
}

/**
 * 优化版冒泡排序 - 提前终止
 * 如果在某一轮遍历中没有进行任何交换，说明数组已经有序，可以提前结束
 *
 * 时间复杂度：
 * - 最好情况：O(n) - 数组已经有序
 * - 最坏情况：O(n²) - 数组完全逆序
 * - 平均情况：O(n²)
 */
function bubbleSortOptimized(arr) {
    const n = arr.length;
    let swapped;

    console.log('开始优化版冒泡排序...');
    console.log(`初始数组: [${arr}]`);

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        console.log(`\n第 ${i + 1} 轮排序:`);

        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        console.log(`第 ${i + 1} 轮结束: [${arr}]`);

        // 如果这一轮没有发生交换，说明数组已经有序
        if (!swapped) {
            console.log('没有发生交换，数组已有序，提前结束!');
            break;
        }
    }

    console.log(`\n排序完成: [${arr}]`);
    return arr;
}

/**
 * 双向冒泡排序（鸡尾酒排序）
 * 每一轮同时从两个方向进行冒泡，可以稍微提高效率
 *
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 */
function cocktailSort(arr) {
    let start = 0;
    let end = arr.length - 1;
    let swapped = true;

    console.log('开始鸡尾酒排序...');
    console.log(`初始数组: [${arr}]`);

    while (swapped) {
        swapped = false;

        // 从左到右的冒泡
        console.log(`\n从左到右冒泡 (${start} 到 ${end}):`);
        for (let i = start; i < end; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
            }
        }
        end--;

        if (!swapped) break;

        // 从右到左的冒泡
        console.log(`从右到左冒泡 (${end} 到 ${start}):`);
        for (let i = end; i > start; i--) {
            if (arr[i] < arr[i - 1]) {
                [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
                swapped = true;
            }
        }
        start++;

        console.log(`当前状态: [${arr}]`);
    }

    console.log(`\n排序完成: [${arr}]`);
    return arr;
}

/**
 * 静默版冒泡排序（不打印过程）
 */
function bubbleSortSilent(arr) {
    const n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        if (!swapped) break;
    }

    return arr;
}

// 测试用例
function testBubbleSort() {
    console.log('=== 冒泡排序测试 ===\n');

    const testCases = [
        {
            name: '随机数组',
            input: [64, 34, 25, 12, 22, 11, 90],
            expected: [11, 12, 22, 25, 34, 64, 90]
        },
        {
            name: '已排序数组',
            input: [1, 2, 3, 4, 5],
            expected: [1, 2, 3, 4, 5]
        },
        {
            name: '逆序数组',
            input: [5, 4, 3, 2, 1],
            expected: [1, 2, 3, 4, 5]
        },
        {
            name: '包含重复元素',
            input: [3, 7, 3, 1, 7, 1],
            expected: [1, 1, 3, 3, 7, 7]
        },
        {
            name: '单个元素',
            input: [42],
            expected: [42]
        },
        {
            name: '空数组',
            input: [],
            expected: []
        }
    ];

    testCases.forEach((testCase, index) => {
        const { name, input, expected } = testCase;

        console.log(`\n测试用例 ${index + 1}: ${name}`);
        console.log('='.repeat(40));

        const arr = [...input];
        const result = bubbleSortSilent(arr);

        console.log(`输入: [${input}]`);
        console.log(`输出: [${result}]`);
        console.log(`期望: [${expected}]`);
        console.log(`测试通过: ${JSON.stringify(result) === JSON.stringify(expected) ? '✅' : '❌'}`);
    });

    // 演示详细过程
    console.log('\n=== 详细过程演示 ===');
    console.log('\n1. 基础冒泡排序演示:');
    bubbleSort([64, 34, 25, 12]);

    console.log('\n\n2. 优化版冒泡排序演示（已有序数组）:');
    bubbleSortOptimized([1, 2, 3, 4, 5]);

    console.log('\n\n3. 鸡尾酒排序演示:');
    cocktailSort([5, 3, 8, 1, 6]);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const sizes = [100, 1000];

    sizes.forEach(size => {
        // 生成随机数组
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));

        console.log(`\n数组大小: ${size}`);

        // 测试基础冒泡排序
        const arr1 = [...arr];
        const start1 = performance.now();
        bubbleSortSilent(arr1);
        const time1 = performance.now() - start1;

        // 测试鸡尾酒排序
        const arr2 = [...arr];
        const start2 = performance.now();
        cocktailSort([...arr2]);
        const time2 = performance.now() - start2;

        console.log(`基础冒泡排序耗时: ${time1.toFixed(2)} ms`);
        console.log(`鸡尾酒排序耗时: ${time2.toFixed(2)} ms`);
    });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bubbleSort,
        bubbleSortOptimized,
        cocktailSort,
        bubbleSortSilent,
        testBubbleSort,
        performanceTest
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testBubbleSort();
}