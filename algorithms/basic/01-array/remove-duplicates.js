/**
 * 删除排序数组中的重复项 - LeetCode 26
 *
 * 问题描述：
 * 给你一个有序数组 nums，请你原地删除重复出现的元素，使每个元素只出现一次，
 * 返回删除后数组的新长度。不要使用额外的数组空间。
 */

/**
 * 方法一：双指针法（推荐）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：使用快慢双指针，快指针遍历数组，慢指针指向下一个不重复元素的位置
 */
function removeDuplicates(nums) {
    if (nums.length <= 1) {
        return nums.length;
    }

    let slow = 0; // 慢指针，指向不重复元素的位置

    // 快指针从第二个元素开始遍历
    for (let fast = 1; fast < nums.length; fast++) {
        // 如果快指针的元素与慢指针不同，说明找到了新的不重复元素
        if (nums[fast] !== nums[slow]) {
            slow++; // 慢指针前移
            nums[slow] = nums[fast]; // 将新元素放到正确位置
        }
    }

    return slow + 1; // 返回不重复元素的个数
}

/**
 * 方法二：使用 Set 去重（非原地算法，仅作对比）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */
function removeDuplicatesWithSet(nums) {
    // 使用 Set 去重
    const uniqueElements = [...new Set(nums)];

    // 将去重后的元素复制回原数组
    for (let i = 0; i < uniqueElements.length; i++) {
        nums[i] = uniqueElements[i];
    }

    return uniqueElements.length;
}

/**
 * 通用去重函数：适用于未排序数组
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */
function removeDuplicatesUnsorted(nums) {
    const seen = new Set();
    let writeIndex = 0;

    for (let i = 0; i < nums.length; i++) {
        if (!seen.has(nums[i])) {
            seen.add(nums[i]);
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }

    return writeIndex;
}

// 测试用例
function testRemoveDuplicates() {
    console.log('=== 删除重复元素测试 ===');

    const testCases = [
        {
            name: '基本用例1',
            nums: [1, 1, 2],
            expected: { length: 2, array: [1, 2] }
        },
        {
            name: '基本用例2',
            nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            expected: { length: 5, array: [0, 1, 2, 3, 4] }
        },
        {
            name: '无重复',
            nums: [1, 2, 3, 4, 5],
            expected: { length: 5, array: [1, 2, 3, 4, 5] }
        },
        {
            name: '全部重复',
            nums: [1, 1, 1, 1, 1],
            expected: { length: 1, array: [1] }
        }
    ];

    testCases.forEach((testCase) => {
        const { name, nums, expected } = testCase;

        console.log(`\n${name}:`);
        console.log(`原数组: [${nums}]`);

        // 测试双指针法
        const nums1 = [...nums];
        const length1 = removeDuplicates(nums1);
        const result1 = nums1.slice(0, length1);

        // 测试 Set 方法
        const nums2 = [...nums];
        const length2 = removeDuplicatesWithSet(nums2);
        const result2 = nums2.slice(0, length2);

        console.log(`双指针法结果: 长度=${length1}, 数组=[${result1}]`);
        console.log(`Set方法结果: 长度=${length2}, 数组=[${result2}]`);
        console.log(`测试通过: ${
            length1 === expected.length &&
            JSON.stringify(result1) === JSON.stringify(expected.array) ? '✅' : '❌'
        }`);
    });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        removeDuplicates,
        removeDuplicatesWithSet,
        removeDuplicatesUnsorted,
        testRemoveDuplicates
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testRemoveDuplicates();
}