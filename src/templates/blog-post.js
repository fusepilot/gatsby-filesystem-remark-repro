import React from 'react'

export default class DocTemplate extends React.Component {
  render() {
    const { file } = this.props.data

    return (
      <div>
        <h1>{file.childMarkdownRemark.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: file.childMarkdownRemark.html }} />
      </div>
    )
  }
}

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    file(fields: { slug: { eq: $slug } }) {
      childMarkdownRemark {
        fileAbsolutePath
        html
        frontmatter {
          title
        }
      }
    }
  }
`
