/**
 * 斐波那契数列 - 经典动态规划问题
 *
 * 问题描述：
 * 斐波那契数列通常用 F(n) 表示，形成的序列称为斐波那契数列。
 * 该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。
 * F(0) = 0, F(1) = 1
 * F(n) = F(n-1) + F(n-2), 其中 n > 1
 */

/**
 * 方法一：递归法（朴素递归）
 * 时间复杂度：O(2^n) - 指数级，非常慢
 * 空间复杂度：O(n) - 递归调用栈
 *
 * 问题：存在大量重复计算
 */
function fibonacciRecursive(n) {
    console.log(`计算 F(${n})`);

    if (n <= 1) {
        return n;
    }

    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

/**
 * 方法二：记忆化递归（自顶向下的动态规划）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 *
 * 思路：使用缓存存储已计算的结果，避免重复计算
 */
function fibonacciMemoized(n, memo = {}) {
    // 如果已经计算过，直接返回缓存结果
    if (n in memo) {
        return memo[n];
    }

    if (n <= 1) {
        return n;
    }

    // 计算并缓存结果
    memo[n] = fibonacciMemoized(n - 1, memo) + fibonacciMemoized(n - 2, memo);
    return memo[n];
}

/**
 * 方法三：动态规划（自底向上）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 *
 * 思路：从小到大计算，使用数组存储中间结果
 */
function fibonacciDP(n) {
    if (n <= 1) {
        return n;
    }

    // 创建dp数组，dp[i]表示第i个斐波那契数
    const dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;

    console.log('动态规划计算过程:');
    console.log(`dp[0] = ${dp[0]}`);
    console.log(`dp[1] = ${dp[1]}`);

    // 从小到大填充dp数组
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        console.log(`dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
    }

    return dp[n];
}

/**
 * 方法四：空间优化的动态规划
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：只需要保存前两个数，不需要整个数组
 */
function fibonacciOptimized(n) {
    if (n <= 1) {
        return n;
    }

    let prev2 = 0; // F(i-2)
    let prev1 = 1; // F(i-1)

    console.log('空间优化计算过程:');
    console.log(`F(0) = ${prev2}`);
    console.log(`F(1) = ${prev1}`);

    for (let i = 2; i <= n; i++) {
        const current = prev1 + prev2;
        console.log(`F(${i}) = F(${i - 1}) + F(${i - 2}) = ${prev1} + ${prev2} = ${current}`);

        // 更新前两个数
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

/**
 * 方法五：矩阵快速幂
 * 时间复杂度：O(log n)
 * 空间复杂度：O(1)
 *
 * 思路：利用矩阵乘法的性质，通过快速幂算法快速计算
 * [F(n+1)] = [1 1]^n * [F(1)]
 * [F(n)  ]   [1 0]     [F(0)]
 */
function fibonacciMatrix(n) {
    if (n <= 1) {
        return n;
    }

    // 基础矩阵
    const base = [
        [1, 1],
        [1, 0]
    ];

    const result = matrixPower(base, n);
    return result[0][1];
}

// 矩阵快速幂
function matrixPower(matrix, n) {
    // 单位矩阵
    let result = [
        [1, 0],
        [0, 1]
    ];

    let base = matrix;

    while (n > 0) {
        if (n % 2 === 1) {
            result = matrixMultiply(result, base);
        }
        base = matrixMultiply(base, base);
        n = Math.floor(n / 2);
    }

    return result;
}

// 2x2矩阵乘法
function matrixMultiply(a, b) {
    return [
        [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
        [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]]
    ];
}

/**
 * 生成斐波那契数列的前n项
 */
function generateFibonacciSequence(n) {
    const sequence = [];

    for (let i = 0; i < n; i++) {
        sequence.push(fibonacciOptimized(i));
    }

    return sequence;
}

/**
 * 黄金分割比近似计算
 * 当n足够大时，F(n+1)/F(n) 趋近于黄金分割比 φ ≈ 1.618
 */
function goldenRatioApproximation(n) {
    if (n <= 0) return 0;

    const fn = fibonacciOptimized(n);
    const fn_1 = fibonacciOptimized(n + 1);

    return fn_1 / fn;
}

// 测试用例
function testFibonacci() {
    console.log('=== 斐波那契数列测试 ===\n');

    const testCases = [
        { n: 0, expected: 0 },
        { n: 1, expected: 1 },
        { n: 2, expected: 1 },
        { n: 3, expected: 2 },
        { n: 4, expected: 3 },
        { n: 5, expected: 5 },
        { n: 6, expected: 8 },
        { n: 10, expected: 55 },
        { n: 15, expected: 610 }
    ];

    console.log('基本功能测试:');
    testCases.forEach(({ n, expected }) => {
        const result1 = fibonacciMemoized(n);
        const result2 = fibonacciOptimized(n);
        const result3 = fibonacciMatrix(n);

        console.log(`F(${n}):`);
        console.log(`  记忆化递归: ${result1}`);
        console.log(`  空间优化DP: ${result2}`);
        console.log(`  矩阵快速幂: ${result3}`);
        console.log(`  期望结果: ${expected}`);
        console.log(`  测试通过: ${
            result1 === expected &&
            result2 === expected &&
            result3 === expected ? '✅' : '❌'
        }\n`);
    });

    // 演示详细计算过程
    console.log('=== 详细计算过程演示 ===\n');

    console.log('1. 动态规划方法计算 F(6):');
    fibonacciDP(6);

    console.log('\n2. 空间优化方法计算 F(6):');
    fibonacciOptimized(6);

    // 生成数列
    console.log('\n=== 斐波那契数列前10项 ===');
    const sequence = generateFibonacciSequence(10);
    console.log(`序列: [${sequence.join(', ')}]`);

    // 黄金分割比
    console.log('\n=== 黄金分割比近似 ===');
    for (let i = 5; i <= 20; i += 5) {
        const ratio = goldenRatioApproximation(i);
        console.log(`F(${i + 1})/F(${i}) ≈ ${ratio.toFixed(6)}`);
    }
    console.log('理论值: φ ≈ 1.618034');
}

// 性能对比测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const testValues = [10, 20, 30, 40];

    testValues.forEach(n => {
        console.log(`\n计算 F(${n}):`);

        // 记忆化递归
        const start1 = performance.now();
        const result1 = fibonacciMemoized(n);
        const time1 = performance.now() - start1;

        // 动态规划
        const start2 = performance.now();
        const result2 = fibonacciOptimized(n);
        const time2 = performance.now() - start2;

        // 矩阵快速幂
        const start3 = performance.now();
        const result3 = fibonacciMatrix(n);
        const time3 = performance.now() - start3;

        console.log(`记忆化递归: ${result1} (${time1.toFixed(4)} ms)`);
        console.log(`空间优化DP: ${result2} (${time2.toFixed(4)} ms)`);
        console.log(`矩阵快速幂: ${result3} (${time3.toFixed(4)} ms)`);

        // 对于小的n值，朴素递归也可以测试（但要小心）
        if (n <= 35) {
            const start0 = performance.now();
            const result0 = fibonacciRecursive(n);
            const time0 = performance.now() - start0;
            console.log(`朴素递归: ${result0} (${time0.toFixed(4)} ms)`);
        } else {
            console.log(`朴素递归: 跳过测试（太慢）`);
        }
    });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fibonacciRecursive,
        fibonacciMemoized,
        fibonacciDP,
        fibonacciOptimized,
        fibonacciMatrix,
        generateFibonacciSequence,
        goldenRatioApproximation,
        testFibonacci,
        performanceTest
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testFibonacci();
}