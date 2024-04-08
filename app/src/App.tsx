import React, {
  createRef,
  useMemo,
  useState,
} from 'react'

import { Asset, TestAssets } from './Asset'
import { BasicOverlayPage } from './BasicOverlayPage'
import { ComponentsOverviewPage } from './ComponentsOverviewPage'
import { CustomControlsPage } from './CustomControlsPage'
import { InterstitialPage } from './InterstitialPage'
import { YoutubeControlsPage } from './YoutubeControlsPage'

// load app styles
import './styles.css'
// load the player styles
import '@castlabs/prestoplay/clpp.styles.css'
// load the theme
import '../../src/themes/pp-ui-base-theme.css'

type Page = 'basic' | 'custom' | 'components' | 'youtube' | 'interstitial'

function getQueryVariable(variable: string) {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(variable) as Page | null
}

function setQueryParam(key: string, value: string) {
  const url = new URL(window.location.toString())
  url.searchParams.set(key, value)
  window.history.pushState({}, '', url)
}

export function App() {
  // We track the configuration here to make sure we can dynamically change it
  const [assetId, setAssetId] = useState<number>(Number(getQueryVariable('asset') || 0))
  const [pageId, setPageId] = useState<Page>(getQueryVariable('page') ?? 'basic')
  const [asset, setAsset] = useState<Asset|undefined>(TestAssets[assetId])
  const [autoload, setAutoload] = useState<boolean>(false)
  const [navVisible, setNavVisible] = useState<boolean>(false)

  const navRef = createRef<HTMLElement>()

  const selectAsset = (id: number) => () => {
    setAssetId(id)
    setAsset(TestAssets[id])
    setQueryParam('asset', `${id}`)
  }
  const selectPage = (pageId: Page) => () => {
    setPageId(pageId)
    setQueryParam('page', `${pageId}`)
    setNavVisible(false)
  }

  const page = useMemo(() => {
    if (pageId === 'basic') {
      return <BasicOverlayPage asset={asset} autoload={autoload}/>
    } else if (pageId === 'custom') {
      return <CustomControlsPage asset={asset} autoload={autoload}/>
    } else if (pageId === 'components') {
      return <ComponentsOverviewPage asset={asset} autoload={autoload}/>
    } else if (pageId === 'youtube') {
      return <YoutubeControlsPage asset={asset} autoload={autoload}/>
    } else if (pageId === 'interstitial') {
      return <InterstitialPage />
    }
    return <div>Unknown Page!</div>
  }, [pageId, asset, autoload])

  const toggleNav = (event: React.MouseEvent) => {
    setNavVisible(visible => !visible)
    event.stopPropagation()
  }

  return (
    <div className={'app'}>

      <div className={'header'}>
        <button onClick={toggleNav} className={'nav-toggle'}>Options</button>
        <h1>PRESTOplay React Components</h1>
      </div>
      
      <nav className={`sidenav ${navVisible ? 'visible' : ''}`} ref={navRef}>
        <button onClick={toggleNav} className={'nav-toggle'}>Hide</button>
        <h3>Content</h3>
        <button onClick={selectAsset(0)} className={`${assetId === 0 ? 'selected' : ''}`}>{TestAssets[0].title}</button>
        <button onClick={selectAsset(1)} className={`${assetId === 1 ? 'selected' : ''}`}>{TestAssets[1].title}</button>
        <button onClick={selectAsset(2)} className={`${assetId === 2 ? 'selected' : ''}`}>{TestAssets[2].title}</button>
        <button onClick={selectAsset(3)} className={`${assetId === 3 ? 'selected' : ''}`}>{TestAssets[3].title}</button>
        <h3>Options</h3>
        <label>
          <input type={'checkbox'} checked={autoload} onChange={() => {setAutoload(!autoload)}}/>
          Auto Load
        </label>
        <h3>Layouts</h3>
        <button onClick={selectPage('basic')} className={`${pageId === 'basic' ? 'selected' : ''}`}>Basic Overlay</button>
        <button onClick={selectPage('custom')} className={`${pageId === 'custom' ? 'selected' : ''}`}>Custom Overlay</button>
        <button onClick={selectPage('youtube')} className={`${pageId === 'youtube' ? 'selected' : ''}`}>Youtube Overlay</button>
        <button onClick={selectPage('components')} className={`${pageId === 'components' ? 'selected' : ''}`}>Components</button>
        <button onClick={selectPage('interstitial')} className={`${pageId === 'interstitial' ? 'selected' : ''}`}>HLS Interstitial</button>
      </nav>

      <div>
        {page}
      </div>
    </div>
  )
}
