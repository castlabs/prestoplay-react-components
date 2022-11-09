import React, {useCallback, useEffect, useState} from 'react';
import {TestAssets} from "./Asset";
import {BasicOverlayPage} from "./BasicOverlayPage";
import {CustomControlsPage} from "./CustomControlsPage";
import {ComponentsOverviewPage} from "./ComponentsOverviewPage";

// load app styles
import "./styles.css"

// load the player styles
import "@castlabs/prestoplay/clpp.styles.css"

// load the theme
import "../../src/themes/pp-ui-base-theme.css"

function getQueryVariable(variable:string):any {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(variable);
}

function setQueryParam(key:string, value:string) {
  const url = new URL(`${window.location}`);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url);
}

function App() {
  // We track the configuration here to make sure we can dynamically change it
  let [assetId, setAssetId] = useState<number>(getQueryVariable("asset") || 0)
  let [pageId, setPageId] = useState<string>(getQueryVariable("page") || "basic")
  let [asset, setAsset] = useState<any>(TestAssets[assetId]);
  let [autoload, setAutoload] = useState<boolean>(false)

  const selectAsset = (id:number) => () => {
    setAssetId(id)
    setAsset(TestAssets[id])
    setQueryParam("asset", `${id}`)
  }
  const selectPage = (pageId:string) => () => {
    setPageId(pageId)
    setQueryParam("page", `${pageId}`)
  }

  const renderPage = useCallback(() => {
    if(pageId == "basic") {
      return <BasicOverlayPage asset={asset} autoload={autoload}/>
    } else if(pageId == "custom") {
      return <CustomControlsPage asset={asset} autoload={autoload}/>
    } else if(pageId == "components") {
      return <ComponentsOverviewPage asset={asset} autoload={autoload}/>
    }
    return <div>Unknown Page!</div>
  }, [pageId, asset])

  return (
    <div className={"app"}>

      <nav className={"sidenav"}>
        <button onClick={selectAsset(0)} className={`${assetId == 0 ? 'selected' : ''}`}>{TestAssets[0].title}</button>
        <button onClick={selectAsset(1)} className={`${assetId == 1 ? 'selected' : ''}`}>{TestAssets[1].title}</button>
        <button onClick={selectAsset(2)} className={`${assetId == 2 ? 'selected' : ''}`}>{TestAssets[2].title}</button>
        <label>
          <input type={"checkbox"} checked={autoload} onChange={() => {setAutoload(!autoload)}}/>
          Auto Load
        </label>
        <div style={{flexGrow: 1}}></div>
        <button onClick={selectPage("basic")} className={`${pageId == 'basic' ? 'selected' : ''}`}>Basic Overlay</button>
        <button onClick={selectPage("custom")} className={`${pageId == 'custom' ? 'selected' : ''}`}>Custom Overlay</button>
        <button onClick={selectPage("components")} className={`${pageId == 'components' ? 'selected' : ''}`}>Components</button>
      </nav>
      <div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
