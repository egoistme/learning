/**
 * 算法测试工具函数
 * 提供通用的测试、性能分析和数据生成功能
 */

/**
 * 生成随机数组
 * @param {number} size - 数组大小
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number[]} 随机数组
 */
function generateRandomArray(size, min = 0, max = 1000) {
    return Array.from({ length: size }, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * 生成有序数组
 * @param {number} size - 数组大小
 * @param {boolean} ascending - 是否升序，默认true
 * @returns {number[]} 有序数组
 */
function generateSortedArray(size, ascending = true) {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    return ascending ? arr : arr.reverse();
}

/**
 * 生成部分有序数组
 * @param {number} size - 数组大小
 * @param {number} swapCount - 交换次数
 * @returns {number[]} 部分有序数组
 */
function generatePartiallyOrderedArray(size, swapCount = Math.floor(size / 10)) {
    const arr = generateSortedArray(size);

    for (let i = 0; i < swapCount; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
    }

    return arr;
}

/**
 * 生成包含重复元素的数组
 * @param {number} size - 数组大小
 * @param {number} uniqueCount - 不同元素的个数
 * @returns {number[]} 包含重复元素的数组
 */
function generateArrayWithDuplicates(size, uniqueCount = Math.floor(size / 3)) {
    const uniqueElements = generateRandomArray(uniqueCount, 1, 100);
    const arr = [];

    for (let i = 0; i < size; i++) {
        const randomElement = uniqueElements[Math.floor(Math.random() * uniqueElements.length)];
        arr.push(randomElement);
    }

    return arr;
}

/**
 * 性能测试函数
 * @param {Function} func - 要测试的函数
 * @param {Array} args - 函数参数数组
 * @param {string} name - 测试名称
 * @returns {Object} 测试结果 {result, time, memory}
 */
function performanceTest(func, args, name = 'Function') {
    const startMemory = process.memoryUsage();
    const startTime = performance.now();

    const result = func(...args);

    const endTime = performance.now();
    const endMemory = process.memoryUsage();

    const executionTime = endTime - startTime;
    const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;

    return {
        name,
        result,
        time: executionTime,
        memory: memoryUsed,
        timeFormatted: `${executionTime.toFixed(2)} ms`,
        memoryFormatted: `${(memoryUsed / 1024).toFixed(2)} KB`
    };
}

/**
 * 批量性能测试
 * @param {Array} tests - 测试配置数组 [{func, args, name}]
 * @returns {Array} 测试结果数组
 */
function batchPerformanceTest(tests) {
    const results = [];

    console.log('=== 性能测试开始 ===\n');

    tests.forEach(test => {
        const result = performanceTest(test.func, test.args, test.name);
        results.push(result);

        console.log(`${result.name}:`);
        console.log(`  执行时间: ${result.timeFormatted}`);
        console.log(`  内存使用: ${result.memoryFormatted}`);
        console.log('');
    });

    // 找出最快和最慢的
    if (results.length > 1) {
        const fastest = results.reduce((a, b) => a.time < b.time ? a : b);
        const slowest = results.reduce((a, b) => a.time > b.time ? a : b);

        console.log(`🏆 最快: ${fastest.name} (${fastest.timeFormatted})`);
        console.log(`🐌 最慢: ${slowest.name} (${slowest.timeFormatted})`);
        console.log(`📈 性能差异: ${(slowest.time / fastest.time).toFixed(2)}x`);
    }

    return results;
}

/**
 * 验证数组是否已排序
 * @param {number[]} arr - 要验证的数组
 * @param {boolean} ascending - 是否检查升序，默认true
 * @returns {boolean} 是否已排序
 */
function isSorted(arr, ascending = true) {
    for (let i = 1; i < arr.length; i++) {
        if (ascending) {
            if (arr[i] < arr[i - 1]) return false;
        } else {
            if (arr[i] > arr[i - 1]) return false;
        }
    }
    return true;
}

/**
 * 数组深度复制
 * @param {Array} arr - 源数组
 * @returns {Array} 复制的数组
 */
function deepCopyArray(arr) {
    return JSON.parse(JSON.stringify(arr));
}

/**
 * 比较两个数组是否相等
 * @param {Array} arr1 - 数组1
 * @param {Array} arr2 - 数组2
 * @returns {boolean} 是否相等
 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!arraysEqual(arr1[i], arr2[i])) return false;
        } else if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

/**
 * 格式化测试结果
 * @param {string} testName - 测试名称
 * @param {any} input - 输入
 * @param {any} expected - 期望输出
 * @param {any} actual - 实际输出
 * @param {boolean} passed - 是否通过
 */
function formatTestResult(testName, input, expected, actual, passed) {
    console.log(`\n${testName}:`);
    console.log('='.repeat(40));
    console.log(`输入: ${JSON.stringify(input)}`);
    console.log(`期望: ${JSON.stringify(expected)}`);
    console.log(`实际: ${JSON.stringify(actual)}`);
    console.log(`结果: ${passed ? '✅ 通过' : '❌ 失败'}`);
}

/**
 * 运行测试套件
 * @param {string} suiteName - 测试套件名称
 * @param {Array} testCases - 测试用例数组
 * @param {Function} testFunction - 测试函数
 */
function runTestSuite(suiteName, testCases, testFunction) {
    console.log(`\n=== ${suiteName} 测试套件 ===`);

    let passedCount = 0;
    const totalCount = testCases.length;

    testCases.forEach((testCase, index) => {
        const { name, input, expected } = testCase;

        try {
            const actual = testFunction(input);
            const passed = arraysEqual(actual, expected);

            formatTestResult(`测试 ${index + 1}: ${name}`, input, expected, actual, passed);

            if (passed) passedCount++;
        } catch (error) {
            console.log(`\n测试 ${index + 1}: ${name} - ❌ 异常`);
            console.log(`错误: ${error.message}`);
        }
    });

    console.log(`\n📊 测试结果: ${passedCount}/${totalCount} 通过`);
    console.log(`成功率: ${((passedCount / totalCount) * 100).toFixed(1)}%`);

    return { passed: passedCount, total: totalCount };
}

/**
 * 计算数组统计信息
 * @param {number[]} arr - 数组
 * @returns {Object} 统计信息
 */
function arrayStats(arr) {
    if (arr.length === 0) {
        return { min: null, max: null, sum: 0, avg: null, length: 0 };
    }

    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = sum / arr.length;

    return {
        min,
        max,
        sum,
        avg: parseFloat(avg.toFixed(2)),
        length: arr.length
    };
}

/**
 * 生成性能测试报告
 * @param {Array} results - 测试结果数组
 */
function generatePerformanceReport(results) {
    console.log('\n=== 性能测试报告 ===');

    const times = results.map(r => r.time);
    const memories = results.map(r => r.memory);

    const timeStats = arrayStats(times);
    const memoryStats = arrayStats(memories);

    console.log('\n📊 执行时间统计:');
    console.log(`  平均: ${timeStats.avg.toFixed(2)} ms`);
    console.log(`  最快: ${timeStats.min.toFixed(2)} ms`);
    console.log(`  最慢: ${timeStats.max.toFixed(2)} ms`);

    console.log('\n💾 内存使用统计:');
    console.log(`  平均: ${(memoryStats.avg / 1024).toFixed(2)} KB`);
    console.log(`  最少: ${(memoryStats.min / 1024).toFixed(2)} KB`);
    console.log(`  最多: ${(memoryStats.max / 1024).toFixed(2)} KB`);

    console.log('\n🏆 性能排名:');
    results
        .sort((a, b) => a.time - b.time)
        .forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.name}: ${result.timeFormatted}`);
        });
}

// 导出所有工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateRandomArray,
        generateSortedArray,
        generatePartiallyOrderedArray,
        generateArrayWithDuplicates,
        performanceTest,
        batchPerformanceTest,
        isSorted,
        deepCopyArray,
        arraysEqual,
        formatTestResult,
        runTestSuite,
        arrayStats,
        generatePerformanceReport
    };
}