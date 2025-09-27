/**
 * 排序算法测试和性能对比
 * 包含正确性测试、性能基准测试和可视化对比
 */

// 在 Node.js 环境中导入排序算法
const isNode = typeof require !== 'undefined';
let sortingAlgorithms = {};

if (isNode) {
    sortingAlgorithms = require('./sorting-algorithms.js');
} else {
    // 浏览器环境，假设 sorting-algorithms.js 已经加载
    sortingAlgorithms = {
        bubbleSort, selectionSort, insertionSort, shellSort,
        mergeSort, quickSort, quickSort3Way, heapSort,
        countingSort, bucketSort, radixSort,
        isSorted, generateRandomArray, copyArray
    };
}

const {
    bubbleSort, selectionSort, insertionSort, shellSort,
    mergeSort, quickSort, quickSort3Way, heapSort,
    countingSort, bucketSort, radixSort,
    isSorted, generateRandomArray, copyArray
} = sortingAlgorithms;

// ========================================
// 🎯 测试用例定义
// ========================================

/**
 * 基础测试用例
 */
const testCases = [
    {
        name: "随机数组",
        data: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42]
    },
    {
        name: "已排序数组",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
        name: "逆序数组",
        data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    },
    {
        name: "有重复元素",
        data: [5, 2, 8, 2, 9, 1, 5, 5, 2, 8]
    },
    {
        name: "单个元素",
        data: [42]
    },
    {
        name: "空数组",
        data: []
    },
    {
        name: "两个元素",
        data: [3, 1]
    },
    {
        name: "大量重复",
        data: [3, 3, 3, 1, 1, 1, 2, 2, 2]
    }
];

/**
 * 排序算法列表
 */
const algorithms = [
    { name: '冒泡排序', fn: bubbleSort, category: '基础' },
    { name: '选择排序', fn: selectionSort, category: '基础' },
    { name: '插入排序', fn: insertionSort, category: '基础' },
    { name: '希尔排序', fn: shellSort, category: '改进' },
    { name: '归并排序', fn: mergeSort, category: '高效' },
    { name: '快速排序', fn: quickSort, category: '高效' },
    { name: '三路快排', fn: quickSort3Way, category: '高效' },
    { name: '堆排序', fn: heapSort, category: '高效' },
    { name: '计数排序', fn: countingSort, category: '非比较' },
    { name: '桶排序', fn: bucketSort, category: '非比较' },
    { name: '基数排序', fn: radixSort, category: '非比较' }
];

// ========================================
// 🧪 正确性测试
// ========================================

/**
 * 运行正确性测试
 */
function runCorrectnessTests() {
    console.log('🧪 开始排序算法正确性测试\n');
    console.log('=' .repeat(60));

    let passCount = 0;
    let totalTests = 0;

    for (let testCase of testCases) {
        console.log(`\n📊 测试用例: ${testCase.name}`);
        console.log(`原始数据: [${testCase.data}]`);
        console.log('-'.repeat(50));

        for (let algo of algorithms) {
            totalTests++;
            const inputData = copyArray(testCase.data);
            const expected = copyArray(testCase.data).sort((a, b) => a - b);

            try {
                const startTime = performance.now();
                const result = algo.fn(inputData);
                const endTime = performance.now();
                const time = (endTime - startTime).toFixed(4);

                const passed = JSON.stringify(result) === JSON.stringify(expected);

                if (passed) {
                    console.log(`✅ ${algo.name}: [${result}] (${time}ms)`);
                    passCount++;
                } else {
                    console.log(`❌ ${algo.name}: [${result}] ≠ [${expected}] (${time}ms)`);
                }
            } catch (error) {
                console.log(`💥 ${algo.name}: 错误 - ${error.message}`);
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`📈 测试结果: ${passCount}/${totalTests} 通过 (${(passCount/totalTests*100).toFixed(1)}%)`);

    return passCount === totalTests;
}

// ========================================
// ⚡ 性能基准测试
// ========================================

/**
 * 运行性能基准测试
 */
function runPerformanceTests() {
    console.log('\n⚡ 开始排序算法性能测试\n');
    console.log('=' .repeat(80));

    const testSizes = [100, 1000, 5000, 10000];
    const results = {};

    for (let size of testSizes) {
        console.log(`\n📏 数组大小: ${size} 元素`);
        console.log('-'.repeat(70));

        results[size] = {};

        // 生成测试数据
        const randomData = generateRandomArray(size, 1, size);
        const sortedData = copyArray(randomData).sort((a, b) => a - b);
        const reversedData = copyArray(sortedData).reverse();

        const scenarios = [
            { name: '随机数据', data: randomData },
            { name: '已排序', data: sortedData },
            { name: '逆序数据', data: reversedData }
        ];

        for (let scenario of scenarios) {
            console.log(`\n  🎯 场景: ${scenario.name}`);

            for (let algo of algorithms) {
                // 跳过大数据量的 O(n²) 算法
                if (size > 5000 && ['冒泡排序', '选择排序', '插入排序'].includes(algo.name)) {
                    console.log(`  ⏭️  ${algo.name}: 跳过 (数据量过大)`);
                    continue;
                }

                const inputData = copyArray(scenario.data);

                try {
                    const startTime = performance.now();
                    algo.fn(inputData);
                    const endTime = performance.now();
                    const time = endTime - startTime;

                    console.log(`  ${getPerformanceIcon(time)} ${algo.name}: ${time.toFixed(2)}ms`);

                    // 记录结果
                    if (!results[size][algo.name]) {
                        results[size][algo.name] = {};
                    }
                    results[size][algo.name][scenario.name] = time;

                } catch (error) {
                    console.log(`  💥 ${algo.name}: 错误 - ${error.message}`);
                }
            }
        }
    }

    // 显示性能汇总
    showPerformanceSummary(results);
}

/**
 * 根据执行时间返回性能图标
 */
function getPerformanceIcon(time) {
    if (time < 1) return '🚀';
    if (time < 10) return '⚡';
    if (time < 50) return '🏃';
    if (time < 200) return '🚶';
    return '🐌';
}

/**
 * 显示性能汇总表
 */
function showPerformanceSummary(results) {
    console.log('\n📊 性能汇总表 (单位: ms)');
    console.log('='.repeat(80));

    const sizes = Object.keys(results);
    const algoNames = algorithms.map(a => a.name);

    // 表头
    console.log('算法名称'.padEnd(12) + sizes.map(size => `${size}元素`.padEnd(10)).join(''));
    console.log('-'.repeat(80));

    // 数据行
    for (let algoName of algoNames) {
        let row = algoName.padEnd(12);
        for (let size of sizes) {
            const randomTime = results[size][algoName]?.['随机数据'];
            if (randomTime !== undefined) {
                row += `${randomTime.toFixed(1)}ms`.padEnd(10);
            } else {
                row += '跳过'.padEnd(10);
            }
        }
        console.log(row);
    }
}

// ========================================
// 📈 算法复杂度分析
// ========================================

/**
 * 显示算法复杂度对比
 */
function showComplexityAnalysis() {
    console.log('\n📈 排序算法复杂度分析\n');
    console.log('=' .repeat(90));

    const complexityData = [
        {
            name: '冒泡排序',
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
            space: 'O(1)',
            stable: '✅',
            category: '基础'
        },
        {
            name: '选择排序',
            best: 'O(n²)',
            average: 'O(n²)',
            worst: 'O(n²)',
            space: 'O(1)',
            stable: '❌',
            category: '基础'
        },
        {
            name: '插入排序',
            best: 'O(n)',
            average: 'O(n²)',
            worst: 'O(n²)',
            space: 'O(1)',
            stable: '✅',
            category: '基础'
        },
        {
            name: '希尔排序',
            best: 'O(n log n)',
            average: 'O(n^1.3)',
            worst: 'O(n²)',
            space: 'O(1)',
            stable: '❌',
            category: '改进'
        },
        {
            name: '归并排序',
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            space: 'O(n)',
            stable: '✅',
            category: '高效'
        },
        {
            name: '快速排序',
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)',
            space: 'O(log n)',
            stable: '❌',
            category: '高效'
        },
        {
            name: '堆排序',
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n log n)',
            space: 'O(1)',
            stable: '❌',
            category: '高效'
        },
        {
            name: '计数排序',
            best: 'O(n + k)',
            average: 'O(n + k)',
            worst: 'O(n + k)',
            space: 'O(k)',
            stable: '✅',
            category: '非比较'
        },
        {
            name: '桶排序',
            best: 'O(n + k)',
            average: 'O(n + k)',
            worst: 'O(n²)',
            space: 'O(n + k)',
            stable: '✅',
            category: '非比较'
        },
        {
            name: '基数排序',
            best: 'O(d(n + k))',
            average: 'O(d(n + k))',
            worst: 'O(d(n + k))',
            space: 'O(n + k)',
            stable: '✅',
            category: '非比较'
        }
    ];

    // 表头
    console.log(
        '算法名称'.padEnd(12) +
        '最好'.padEnd(12) +
        '平均'.padEnd(12) +
        '最坏'.padEnd(12) +
        '空间'.padEnd(10) +
        '稳定'.padEnd(6) +
        '类别'.padEnd(8)
    );
    console.log('-'.repeat(90));

    // 按类别分组显示
    const categories = ['基础', '改进', '高效', '非比较'];
    for (let category of categories) {
        console.log(`\n📚 ${category}排序:`);
        console.log('-'.repeat(30));

        const algosInCategory = complexityData.filter(algo => algo.category === category);
        for (let algo of algosInCategory) {
            console.log(
                algo.name.padEnd(12) +
                algo.best.padEnd(12) +
                algo.average.padEnd(12) +
                algo.worst.padEnd(12) +
                algo.space.padEnd(10) +
                algo.stable.padEnd(6) +
                algo.category.padEnd(8)
            );
        }
    }

    console.log('\n💡 说明:');
    console.log('  • n: 数组长度');
    console.log('  • k: 数据范围 (非比较排序)');
    console.log('  • d: 位数 (基数排序)');
    console.log('  • 稳定性: 相等元素的相对位置是否保持不变');
}

// ========================================
// 🎮 交互式测试
// ========================================

/**
 * 比较两个算法的性能
 */
function compareAlgorithms(algo1Name, algo2Name, size = 1000) {
    console.log(`\n🆚 算法对比: ${algo1Name} vs ${algo2Name}\n`);

    const algo1 = algorithms.find(a => a.name === algo1Name);
    const algo2 = algorithms.find(a => a.name === algo2Name);

    if (!algo1 || !algo2) {
        console.log('❌ 找不到指定的算法');
        return;
    }

    const testData = generateRandomArray(size);
    const scenarios = [
        { name: '随机数据', data: copyArray(testData) },
        { name: '已排序', data: copyArray(testData).sort((a, b) => a - b) },
        { name: '逆序数据', data: copyArray(testData).sort((a, b) => b - a) }
    ];

    console.log(`📏 数据规模: ${size} 个元素\n`);

    for (let scenario of scenarios) {
        console.log(`🎯 ${scenario.name}:`);

        // 测试算法1
        const data1 = copyArray(scenario.data);
        const start1 = performance.now();
        algo1.fn(data1);
        const time1 = performance.now() - start1;

        // 测试算法2
        const data2 = copyArray(scenario.data);
        const start2 = performance.now();
        algo2.fn(data2);
        const time2 = performance.now() - start2;

        // 比较结果
        const ratio = time2 / time1;
        const winner = time1 < time2 ? algo1Name : algo2Name;

        console.log(`  ${algo1Name}: ${time1.toFixed(2)}ms`);
        console.log(`  ${algo2Name}: ${time2.toFixed(2)}ms`);
        console.log(`  🏆 胜者: ${winner} (快 ${Math.abs(ratio - 1).toFixed(2)}x)`);
        console.log('');
    }
}

/**
 * 测试特定算法在不同数据规模下的表现
 */
function testAlgorithmScaling(algoName) {
    console.log(`\n📈 ${algoName} 扩展性测试\n`);

    const algo = algorithms.find(a => a.name === algoName);
    if (!algo) {
        console.log('❌ 找不到指定的算法');
        return;
    }

    const sizes = [100, 500, 1000, 2000, 5000];
    console.log('数据规模'.padEnd(10) + '执行时间'.padEnd(12) + '相对增长');
    console.log('-'.repeat(35));

    let previousTime = 0;

    for (let size of sizes) {
        // 跳过大数据量的 O(n²) 算法
        if (size > 2000 && ['冒泡排序', '选择排序'].includes(algoName)) {
            console.log(`${size}`.padEnd(10) + '跳过'.padEnd(12) + '(数据量过大)');
            continue;
        }

        const testData = generateRandomArray(size);
        const start = performance.now();
        algo.fn(testData);
        const time = performance.now() - start;

        const growth = previousTime > 0 ? `${(time / previousTime).toFixed(2)}x` : '-';

        console.log(
            `${size}`.padEnd(10) +
            `${time.toFixed(2)}ms`.padEnd(12) +
            growth
        );

        previousTime = time;
    }
}

// ========================================
// 🚀 主测试函数
// ========================================

/**
 * 运行完整测试套件
 */
function runFullTestSuite() {
    console.log('🎯 JavaScript 排序算法测试套件');
    console.log('时间:', new Date().toLocaleString());
    console.log('环境:', isNode ? 'Node.js' : '浏览器');
    console.log('\n');

    try {
        // 1. 正确性测试
        const correctnessPass = runCorrectnessTests();

        if (correctnessPass) {
            // 2. 性能测试
            runPerformanceTests();

            // 3. 复杂度分析
            showComplexityAnalysis();

            console.log('\n🎉 所有测试完成！');
        } else {
            console.log('\n❌ 正确性测试失败，跳过性能测试');
        }

    } catch (error) {
        console.error('\n💥 测试过程中发生错误:', error.message);
    }
}

/**
 * 快速验证所有算法
 */
function quickTest() {
    console.log('🚀 快速验证所有排序算法\n');

    const testData = [64, 34, 25, 12, 22, 11, 90];
    console.log(`原始数组: [${testData}]`);
    console.log(`期望结果: [${[...testData].sort((a, b) => a - b)}]\n`);

    for (let algo of algorithms) {
        const inputData = copyArray(testData);
        const result = algo.fn(inputData);
        const icon = isSorted(result) ? '✅' : '❌';
        console.log(`${icon} ${algo.name}: [${result}]`);
    }
}

// ========================================
// 🌐 导出和浏览器兼容
// ========================================

// Node.js 环境导出
if (isNode) {
    module.exports = {
        runFullTestSuite,
        runCorrectnessTests,
        runPerformanceTests,
        showComplexityAnalysis,
        compareAlgorithms,
        testAlgorithmScaling,
        quickTest
    };

    // 如果直接运行此文件
    if (require.main === module) {
        runFullTestSuite();
    }
} else {
    // 浏览器环境，添加到全局对象
    window.SortingTests = {
        runFullTestSuite,
        runCorrectnessTests,
        runPerformanceTests,
        showComplexityAnalysis,
        compareAlgorithms,
        testAlgorithmScaling,
        quickTest
    };

    console.log('💡 可用的测试函数:');
    console.log('  • SortingTests.runFullTestSuite() - 完整测试');
    console.log('  • SortingTests.quickTest() - 快速验证');
    console.log('  • SortingTests.compareAlgorithms("快速排序", "归并排序") - 算法对比');
    console.log('  • SortingTests.testAlgorithmScaling("快速排序") - 扩展性测试');
}