import { useState, useEffect } from 'react'
import { marked } from 'marked'

interface Chapter {
  id: string
  title: string
  file: string
}

const chapters: Chapter[] = [
  { id: 'overview', title: '路书大纲', file: '00-路书大纲.md' },
  { id: 'car', title: '租车建议', file: '01-租车建议.md' },
  { id: 'hotel', title: '住宿推荐', file: '02-住宿推荐.md' },
  { id: 'daily', title: '每日行程', file: '03-每日详细行程.md' },
  { id: 'food', title: '餐厅推荐', file: '04-餐厅推荐.md' },
  { id: 'booking', title: '活动预订', file: '05-活动预订指南.md' },
  { id: 'packing', title: '装备清单', file: '06-穿衣与装备清单.md' },
  { id: 'budget', title: '预算估算', file: '07-预算估算.md' },
  { id: 'tips', title: '实用信息', file: '08-实用信息.md' },
]

function App() {
  const [activeChapter, setActiveChapter] = useState<string>('overview')
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      const chapter = chapters.find(c => c.id === activeChapter)
      if (chapter) {
        try {
          const response = await fetch(`./content/${chapter.file}`)
          const markdown = await response.text()
          const html = await marked(markdown)
          setContent(html)
        } catch (error) {
          setContent('<p>加载失败，请重试</p>')
        }
      }
      setLoading(false)
    }
    loadContent()
  }, [activeChapter])

  const currentTitle = chapters.find(c => c.id === activeChapter)?.title || ''

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-200
        overflow-y-auto z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">🇳🇿 新西兰路书</h1>
            <p className="text-sm text-gray-500 mt-1">9.28 - 10.5 南岛自驾</p>
          </div>

          <nav className="space-y-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setActiveChapter(chapter.id)
                  setSidebarOpen(false)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeChapter === chapter.id
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {chapter.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 font-semibold text-gray-900">{currentTitle}</span>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 lg:py-12">
          {/* Desktop title */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{currentTitle}</h1>
            <div className="mt-2 h-1 w-20 bg-blue-500 rounded-full" />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : (
            <article
              className="prose-content bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-10"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Footer */}
          <footer className="mt-12 text-center text-sm text-gray-400 pb-8">
            <p>新西兰南岛8天7晚自驾路书</p>
            <p className="mt-1">2025年9月28日 - 10月5日</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
