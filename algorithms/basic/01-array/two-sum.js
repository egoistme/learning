/**
 * 两数之和 - LeetCode 1
 *
 * 问题描述：
 * 给定一个整数数组 nums 和一个整数目标值 target，
 * 请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。
 *
 * 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。
 */

/**
 * 方法一：暴力解法
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 *
 * 思路：遍历每个元素，对于每个元素，再遍历其余元素查找目标值
 */
function twoSumBruteForce(nums, target) {
    // 外层循环遍历每个元素
    for (let i = 0; i < nums.length - 1; i++) {
        // 内层循环查找配对元素
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return []; // 未找到解
}

/**
 * 方法二：哈希表解法（推荐）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 *
 * 思路：用哈希表存储已遍历的元素值和索引，查找配对元素时只需要O(1)时间
 */
function twoSum(nums, target) {
    // 创建哈希表存储 值 -> 索引 的映射
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i]; // 计算需要的配对值

        // 如果配对值在哈希表中，说明找到了解
        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        // 将当前元素存入哈希表
        map.set(nums[i], i);
    }

    return []; // 未找到解
}

// 测试用例
function testTwoSum() {
    console.log('=== 两数之和测试 ===');

    const testCases = [
        { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
        { nums: [3, 2, 4], target: 6, expected: [1, 2] },
        { nums: [3, 3], target: 6, expected: [0, 1] },
    ];

    testCases.forEach((testCase, index) => {
        const { nums, target, expected } = testCase;

        console.log(`\n测试用例 ${index + 1}:`);
        console.log(`输入: nums = [${nums}], target = ${target}`);
        console.log(`期望输出: [${expected}]`);

        const result1 = twoSumBruteForce([...nums], target);
        const result2 = twoSum([...nums], target);

        console.log(`暴力解法: [${result1}]`);
        console.log(`哈希表解法: [${result2}]`);
        console.log(`测试通过: ${JSON.stringify(result2) === JSON.stringify(expected) ? '✅' : '❌'}`);
    });
}

// 导出函数供其他文件使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { twoSum, twoSumBruteForce, testTwoSum };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testTwoSum();
}