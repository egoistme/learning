/**
 * 反转字符串 - LeetCode 344
 *
 * 问题描述：
 * 编写一个函数，其作用是将输入的字符串反转过来。
 * 输入字符串以字符数组 char[] 的形式给出。
 * 不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
 */

/**
 * 方法一：双指针法（推荐）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：使用首尾双指针，交换对应位置的字符，直到指针相遇
 */
function reverseString(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // 交换左右指针位置的字符
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }

    return s;
}

/**
 * 方法二：递归法
 * 时间复杂度：O(n)
 * 空间复杂度：O(n) - 递归调用栈
 *
 * 思路：递归交换首尾字符，直到处理完所有字符
 */
function reverseStringRecursive(s, left = 0, right = s.length - 1) {
    if (left >= right) {
        return s;
    }

    // 交换首尾字符
    [s[left], s[right]] = [s[right], s[left]];

    // 递归处理内部字符
    return reverseStringRecursive(s, left + 1, right - 1);
}

/**
 * 字符串反转（非原地修改）
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */
function reverseStringSimple(str) {
    return str.split('').reverse().join('');
}

/**
 * 手动实现字符串反转
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */
function reverseStringManual(str) {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

/**
 * 反转单词中的字符串III - LeetCode 557
 * 问题：给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
 */
function reverseWords(s) {
    return s.split(' ')
        .map(word => word.split('').reverse().join(''))
        .join(' ');
}

// 测试用例
function testReverseString() {
    console.log('=== 反转字符串测试 ===');

    const testCases = [
        {
            name: '基本测试1',
            input: ['h', 'e', 'l', 'l', 'o'],
            expected: ['o', 'l', 'l', 'e', 'h']
        },
        {
            name: '基本测试2',
            input: ['H', 'a', 'n', 'n', 'a', 'h'],
            expected: ['h', 'a', 'n', 'n', 'a', 'H']
        },
        {
            name: '单个字符',
            input: ['A'],
            expected: ['A']
        },
        {
            name: '空数组',
            input: [],
            expected: []
        }
    ];

    testCases.forEach((testCase) => {
        const { name, input, expected } = testCase;

        console.log(`\n${name}:`);
        console.log(`原数组: [${input.map(c => `'${c}'`).join(', ')}]`);

        // 测试双指针法
        const arr1 = [...input];
        reverseString(arr1);

        // 测试递归法
        const arr2 = [...input];
        reverseStringRecursive(arr2);

        console.log(`双指针结果: [${arr1.map(c => `'${c}'`).join(', ')}]`);
        console.log(`递归法结果: [${arr2.map(c => `'${c}'`).join(', ')}]`);
        console.log(`测试通过: ${JSON.stringify(arr1) === JSON.stringify(expected) ? '✅' : '❌'}`);
    });

    // 测试字符串反转
    console.log('\n=== 字符串反转测试 ===');
    const stringTests = [
        { input: 'hello', expected: 'olleh' },
        { input: 'JavaScript', expected: 'tpircSavaJ' },
        { input: '12345', expected: '54321' }
    ];

    stringTests.forEach(({ input, expected }) => {
        const result1 = reverseStringSimple(input);
        const result2 = reverseStringManual(input);

        console.log(`\n输入: "${input}"`);
        console.log(`内置方法: "${result1}"`);
        console.log(`手动实现: "${result2}"`);
        console.log(`测试通过: ${result1 === expected && result2 === expected ? '✅' : '❌'}`);
    });

    // 测试反转单词中的字符
    console.log('\n=== 反转单词中的字符测试 ===');
    const wordTests = [
        { input: "Let's take LeetCode contest", expected: "s'teL ekat edoCteeL tsetnoc" },
        { input: "God Ding", expected: "doG gniD" }
    ];

    wordTests.forEach(({ input, expected }) => {
        const result = reverseWords(input);
        console.log(`\n输入: "${input}"`);
        console.log(`输出: "${result}"`);
        console.log(`测试通过: ${result === expected ? '✅' : '❌'}`);
    });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        reverseString,
        reverseStringRecursive,
        reverseStringSimple,
        reverseStringManual,
        reverseWords,
        testReverseString
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testReverseString();
}