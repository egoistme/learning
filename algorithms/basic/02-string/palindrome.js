/**
 * 回文字符串相关算法
 *
 * 回文：正着读和反着读都一样的字符串，如 "aba"、"racecar"
 */

/**
 * 验证回文串 - LeetCode 125
 *
 * 问题描述：
 * 给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。
 */

/**
 * 方法一：双指针法（推荐）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：使用双指针从两端向中间移动，比较对应字符是否相等
 */
function isPalindrome(s) {
    // 预处理：转为小写，只保留字母和数字
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

/**
 * 方法二：不预处理的双指针法
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：在移动指针的同时跳过非字母数字字符
 */
function isPalindromeOptimal(s) {
    let left = 0;
    let right = s.length - 1;

    while (left < right) {
        // 跳过左侧非字母数字字符
        while (left < right && !isAlphanumeric(s[left])) {
            left++;
        }

        // 跳过右侧非字母数字字符
        while (left < right && !isAlphanumeric(s[right])) {
            right--;
        }

        // 比较字符（不区分大小写）
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

// 辅助函数：判断字符是否为字母或数字
function isAlphanumeric(char) {
    return /[a-zA-Z0-9]/.test(char);
}

/**
 * 最长回文子串 - LeetCode 5
 *
 * 问题描述：
 * 给你一个字符串 s，找到 s 中最长的回文子串。
 */

/**
 * 方法一：中心扩展算法
 * 时间复杂度：O(n²)
 * 空间复杂度：O(1)
 *
 * 思路：以每个字符（或字符间隙）为中心，向两边扩展寻找回文
 */
function longestPalindrome(s) {
    if (!s || s.length < 2) {
        return s;
    }

    let start = 0;
    let maxLen = 1;

    for (let i = 0; i < s.length; i++) {
        // 奇数长度回文（以字符为中心）
        const len1 = expandAroundCenter(s, i, i);
        // 偶数长度回文（以字符间隙为中心）
        const len2 = expandAroundCenter(s, i, i + 1);

        const currentMaxLen = Math.max(len1, len2);

        if (currentMaxLen > maxLen) {
            maxLen = currentMaxLen;
            start = i - Math.floor((currentMaxLen - 1) / 2);
        }
    }

    return s.substring(start, start + maxLen);
}

// 辅助函数：从中心向外扩展
function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
}

/**
 * 回文子串的数量 - LeetCode 647
 *
 * 问题描述：
 * 给定一个字符串，你的任务是计算这个字符串中有多少个回文子串。
 */
function countSubstrings(s) {
    let count = 0;

    for (let i = 0; i < s.length; i++) {
        // 计算以 i 为中心的奇数长度回文数量
        count += expandAndCount(s, i, i);
        // 计算以 i, i+1 为中心的偶数长度回文数量
        count += expandAndCount(s, i, i + 1);
    }

    return count;
}

// 辅助函数：从中心扩展并计数
function expandAndCount(s, left, right) {
    let count = 0;
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        count++;
        left--;
        right++;
    }
    return count;
}

/**
 * 简单回文判断（不考虑特殊字符）
 */
function isSimplePalindrome(str) {
    const reversed = str.split('').reverse().join('');
    return str === reversed;
}

// 测试用例
function testPalindrome() {
    console.log('=== 回文串验证测试 ===');

    const palindromeTests = [
        { input: "A man, a plan, a canal: Panama", expected: true },
        { input: "race a car", expected: false },
        { input: "", expected: true },
        { input: "a", expected: true },
        { input: "Madam", expected: true },
        { input: "12321", expected: true },
        { input: "hello", expected: false }
    ];

    palindromeTests.forEach(({ input, expected }) => {
        const result1 = isPalindrome(input);
        const result2 = isPalindromeOptimal(input);

        console.log(`\n输入: "${input}"`);
        console.log(`方法一结果: ${result1}`);
        console.log(`方法二结果: ${result2}`);
        console.log(`测试通过: ${result1 === expected && result2 === expected ? '✅' : '❌'}`);
    });

    console.log('\n=== 最长回文子串测试 ===');

    const longestTests = [
        { input: "babad", expected: ["bab", "aba"] }, // 两种答案都正确
        { input: "cbbd", expected: ["bb"] },
        { input: "a", expected: ["a"] },
        { input: "ac", expected: ["a", "c"] } // 两种答案都正确
    ];

    longestTests.forEach(({ input, expected }) => {
        const result = longestPalindrome(input);
        const isCorrect = expected.includes(result);

        console.log(`\n输入: "${input}"`);
        console.log(`输出: "${result}"`);
        console.log(`期望: ${expected.join(' 或 ')}`);
        console.log(`测试通过: ${isCorrect ? '✅' : '❌'}`);
    });

    console.log('\n=== 回文子串计数测试 ===');

    const countTests = [
        { input: "abc", expected: 3 },
        { input: "aaa", expected: 6 },
        { input: "aba", expected: 4 },
        { input: "", expected: 0 }
    ];

    countTests.forEach(({ input, expected }) => {
        const result = countSubstrings(input);

        console.log(`\n输入: "${input}"`);
        console.log(`回文子串数量: ${result}`);
        console.log(`期望: ${expected}`);
        console.log(`测试通过: ${result === expected ? '✅' : '❌'}`);
    });
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isPalindrome,
        isPalindromeOptimal,
        longestPalindrome,
        countSubstrings,
        isSimplePalindrome,
        testPalindrome
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testPalindrome();
}