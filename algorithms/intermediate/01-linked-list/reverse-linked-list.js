/**
 * 反转链表 - LeetCode 206
 *
 * 问题描述：
 * 给你单链表的头节点 head，请你反转链表，并返回反转后的链表。
 */

// 链表节点定义
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

/**
 * 方法一：迭代法（推荐）
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 *
 * 思路：使用三个指针 prev、curr、next，依次反转每个节点的指向
 */
function reverseList(head) {
    let prev = null;    // 前一个节点
    let curr = head;    // 当前节点

    while (curr !== null) {
        const next = curr.next; // 保存下一个节点
        curr.next = prev;       // 反转当前节点的指向
        prev = curr;            // 移动prev指针
        curr = next;            // 移动curr指针
    }

    return prev; // prev现在指向原链表的尾节点，即新链表的头节点
}

/**
 * 方法二：递归法
 * 时间复杂度：O(n)
 * 空间复杂度：O(n) - 递归调用栈
 *
 * 思路：递归到链表末尾，然后在返回过程中依次反转节点指向
 */
function reverseListRecursive(head) {
    // 递归终止条件：空链表或只有一个节点
    if (head === null || head.next === null) {
        return head;
    }

    // 递归反转剩余部分
    const newHead = reverseListRecursive(head.next);

    // 反转当前节点和下一个节点的连接
    head.next.next = head;
    head.next = null;

    return newHead;
}

/**
 * 方法三：使用栈
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 *
 * 思路：将所有节点压入栈中，然后依次弹出重新连接
 */
function reverseListWithStack(head) {
    if (!head) return null;

    const stack = [];
    let current = head;

    // 将所有节点压入栈
    while (current) {
        stack.push(current);
        current = current.next;
    }

    // 重新构建链表
    const newHead = stack.pop();
    current = newHead;

    while (stack.length > 0) {
        current.next = stack.pop();
        current = current.next;
    }

    current.next = null; // 确保最后一个节点的next为null
    return newHead;
}

/**
 * 反转链表的前 N 个节点
 */
function reverseFirstN(head, n) {
    let successor = null; // 记录第 n+1 个节点

    function reverseN(head, n) {
        if (n === 1) {
            successor = head.next;
            return head;
        }

        const last = reverseN(head.next, n - 1);
        head.next.next = head;
        head.next = successor;

        return last;
    }

    return reverseN(head, n);
}

/**
 * 反转链表的一部分 - LeetCode 92
 * 反转从位置 left 到位置 right 的链表节点
 */
function reverseBetween(head, left, right) {
    if (left === 1) {
        return reverseFirstN(head, right);
    }

    head.next = reverseBetween(head.next, left - 1, right - 1);
    return head;
}

// 工具函数：创建链表
function createLinkedList(arr) {
    if (arr.length === 0) return null;

    const head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}

// 工具函数：链表转数组
function linkedListToArray(head) {
    const result = [];
    let current = head;

    while (current) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

// 工具函数：打印链表
function printLinkedList(head) {
    const arr = linkedListToArray(head);
    return arr.length === 0 ? 'null' : arr.join(' -> ');
}

// 测试用例
function testReverseLinkedList() {
    console.log('=== 反转链表测试 ===\n');

    const testCases = [
        {
            name: '基本测试1',
            input: [1, 2, 3, 4, 5],
            expected: [5, 4, 3, 2, 1]
        },
        {
            name: '基本测试2',
            input: [1, 2],
            expected: [2, 1]
        },
        {
            name: '单个节点',
            input: [1],
            expected: [1]
        },
        {
            name: '空链表',
            input: [],
            expected: []
        }
    ];

    testCases.forEach((testCase, index) => {
        const { name, input, expected } = testCase;

        console.log(`测试用例 ${index + 1}: ${name}`);
        console.log('='.repeat(40));

        // 创建测试链表
        const head1 = createLinkedList(input);
        const head2 = createLinkedList(input);
        const head3 = createLinkedList(input);

        console.log(`原链表: ${printLinkedList(head1)}`);

        // 测试迭代法
        const result1 = reverseList(head1);
        const output1 = linkedListToArray(result1);

        // 测试递归法
        const result2 = reverseListRecursive(head2);
        const output2 = linkedListToArray(result2);

        // 测试栈方法
        const result3 = reverseListWithStack(head3);
        const output3 = linkedListToArray(result3);

        console.log(`迭代法结果: ${printLinkedList(result1)}`);
        console.log(`递归法结果: ${printLinkedList(result2)}`);
        console.log(`栈方法结果: ${printLinkedList(result3)}`);
        console.log(`期望结果: ${expected.join(' -> ')}`);

        const allCorrect =
            JSON.stringify(output1) === JSON.stringify(expected) &&
            JSON.stringify(output2) === JSON.stringify(expected) &&
            JSON.stringify(output3) === JSON.stringify(expected);

        console.log(`测试通过: ${allCorrect ? '✅' : '❌'}\n`);
    });

    // 测试部分反转
    console.log('=== 部分反转测试 ===');

    const partialTests = [
        {
            name: '反转前3个节点',
            input: [1, 2, 3, 4, 5],
            n: 3,
            expected: [3, 2, 1, 4, 5]
        },
        {
            name: '反转前1个节点',
            input: [1, 2, 3],
            n: 1,
            expected: [1, 2, 3]
        }
    ];

    partialTests.forEach(({ name, input, n, expected }) => {
        console.log(`\n${name}:`);

        const head = createLinkedList(input);
        console.log(`原链表: ${printLinkedList(head)}`);

        const result = reverseFirstN(head, n);
        const output = linkedListToArray(result);

        console.log(`反转前${n}个节点: ${printLinkedList(result)}`);
        console.log(`期望结果: ${expected.join(' -> ')}`);
        console.log(`测试通过: ${JSON.stringify(output) === JSON.stringify(expected) ? '✅' : '❌'}`);
    });
}

// 性能比较
function performanceComparison() {
    console.log('\n=== 性能比较测试 ===');

    const sizes = [1000, 10000];

    sizes.forEach(size => {
        console.log(`\n链表长度: ${size}`);

        // 创建大链表
        const arr = Array.from({ length: size }, (_, i) => i + 1);

        // 测试迭代法
        const head1 = createLinkedList(arr);
        const start1 = performance.now();
        reverseList(head1);
        const time1 = performance.now() - start1;

        // 测试递归法
        const head2 = createLinkedList(arr);
        const start2 = performance.now();
        reverseListRecursive(head2);
        const time2 = performance.now() - start2;

        console.log(`迭代法耗时: ${time1.toFixed(2)} ms`);
        console.log(`递归法耗时: ${time2.toFixed(2)} ms`);
        console.log(`性能比较: 迭代法 ${time1 < time2 ? '更快' : '更慢'}`);
    });
}

// 导出函数和类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        reverseList,
        reverseListRecursive,
        reverseListWithStack,
        reverseFirstN,
        reverseBetween,
        createLinkedList,
        linkedListToArray,
        printLinkedList,
        testReverseLinkedList,
        performanceComparison
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    testReverseLinkedList();
}