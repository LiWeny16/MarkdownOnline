import MagicString from "magic-string"

/**
 * @description 处理import重载的插件
 */
function transformImportPlugin(libMaps) {
  return {
    name: "vite-plugin-transform-import",
    async transform(code: string, id: string) {
      if (
        !id.includes("src/js/functions/Events/error/script.ts") &&
        !id.includes("importModule.ts") &&
        (id.endsWith(".ts") || id.endsWith(".tsx"))
      ) {
        const ast = this.parse(code, {
          sourceType: "module",
          plugins: ["typescript", "jsx"],
        })

        const magicString = new MagicString(code)

        let hasImportModule = false
        let lastImportEnd = 0

        // 检查是否已经导入了 importModule
        for (const node of ast.body) {
          if (node.type === "ImportDeclaration") {
            lastImportEnd = node.end
            // console.log(node.source.value)
            if (node.source.value === "@App/import/importModule") {
              hasImportModule = true
              break
            }
          }
        }

        // 添加 importModule 导入语句（如果不存在）
        if (!hasImportModule) {
          const importModuleCode = `import importModule from "@App/import/importModule";`
          magicString.prepend(importModuleCode)
        }

        // 处理其他导入语句
        for (const node of ast.body) {
          if (
            node.type === "ImportDeclaration" &&
            Object.keys(libMaps).includes(node.source.value)
          ) {
            const specifiers = node.specifiers
            let transformedCode = ""

            if (specifiers.length) {
              Object.values(specifiers).forEach((specifier: any, index) => {
                if (specifier.type === "ImportDefaultSpecifier") {
                  // 处理默认导入
                  const importStart = node.start
                  const importEnd = node.end
                  const importName = specifier.local.name

                  const newCode = `
  const ${importName} = (await importModule("${libMaps[node.source.value]}")).default;`
                  transformedCode += newCode
                  // magicString.overwrite(importStart, importEnd, newCode)
                } else if (specifier.type === "ImportSpecifier") {
                  // 处理命名导入
                  const importStart = node.start
                  const importEnd = node.end
                  const importName = specifier.imported.name
                  const localName = specifier.local.name

                  const newCode = `
  const ${localName} = (await importModule("${libMaps[node.source.value]}")).${importName}`
                  transformedCode += newCode
                } else if (specifier.type === "ImportNamespaceSpecifier") {
                  // 处理命名空间导入
                  const importStart = node.start
                  const importEnd = node.end
                  const importName = specifier.local.name

                  const newCode = `
  const ${importName} = await importModule("${libMaps[node.source.value]}");`
                  transformedCode += newCode
                  // magicString.overwrite(importStart, importEnd, newCode)
                }
                if (index == Object.keys(specifiers).length - 1) {
                  magicString.overwrite(node.start, node.end, transformedCode)
                }
              })
            }
          }
        }

        return {
          code: magicString.toString(),
          map: magicString.generateMap({ hires: true }), // 生成 source map
        }
      }
      return code
    },
  }
}

export default transformImportPlugin
