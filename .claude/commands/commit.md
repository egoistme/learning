# Git Commit 自定义指令

## 提交前检查
在执行 git commit 之前，必须运行以下命令确保代码质量：

```bash
npm run type-check
```

如果类型检查失败，不允许提交。

## Commit Message 规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，格式如下：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type 类型
- `feat`: 新功能 (feature)
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式修改（不影响功能）
- `refactor`: 重构代码（既不是新功能也不是修复bug）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `build`: 影响构建系统或外部依赖项的更改
- `ci`: 持续集成配置文件和脚本的更改

### Scope 范围（可选）
- `frontend`: 前端相关
- `mobile`: 移动端相关  
- `backend`: 后端相关
- `networks`: 网络学习相关
- `aigc`: AI相关
- `config`: 配置文件
- `deps`: 依赖项

### 示例
```
feat(frontend): 添加TypeScript类型定义和接口设计

- 新增用户接口类型定义
- 完善API响应数据结构
- 添加组件Props类型约束

学习要点：TypeScript类型系统在实际项目中的应用
```

```
fix(mobile): 修复SwiftUI视图状态更新问题

解决了@State属性在视图更新时不触发重绘的bug
```

```
docs: 更新学习笔记和项目结构说明

补充了计算机网络部分的学习路径
```

## 提交流程

1. **代码检查**: 运行 `npm run type-check` 确保无类型错误
2. **暂存文件**: `git add .` 或选择性添加文件
3. **提交代码**: 使用规范的commit message格式
4. **推送代码**: `git push` (如需要)

## 注意事项

- 每次提交应该是一个逻辑单元，避免混合不同类型的修改
- commit message 使用中文描述，便于学习记录
- 在commit body中可以添加学习要点和思考总结
- 对于学习项目，建议在footer中记录参考资料或学习心得