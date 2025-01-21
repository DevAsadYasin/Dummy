declare module "react-syntax-highlighter" {
    import type { ReactNode } from "react"
  
    export interface SyntaxHighlighterProps {
      language?: string
      style?: any
      children?: ReactNode
      customStyle?: any
      codeTagProps?: any
      useInlineStyles?: boolean
      showLineNumbers?: boolean
      startingLineNumber?: number
      lineNumberStyle?: any
      wrapLines?: boolean
      lineProps?: any
      renderer?: any
      PreTag?: any
      CodeTag?: any
      code?: string
    }
  
    export const Prism: React.ComponentType<SyntaxHighlighterProps>
    export const Light: React.ComponentType<SyntaxHighlighterProps>
  }
  
  declare module "react-syntax-highlighter/dist/esm/styles/prism" {
    export const vscDarkPlus: any
  }
  
  