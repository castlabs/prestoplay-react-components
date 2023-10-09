import { linkTo } from '@storybook/addon-links'
import React from 'react'

type Props = {
  children: React.ReactNode
  /**
   * URI
   */
  uri?: string
  /**
   * Title of the story to link to
   */
  title?: string
}

export const Link = (props: Props) => {
  const { title, uri } = props

  const action = () => {
    if (title) {
      linkTo(title)()
    } else if (uri) {
      window.top.location.href = uri
    }
  }

  return (
    <a className="sb-clpp-anchor sb-unstyled" onClick={action}>{props.children}</a>
  )
}
